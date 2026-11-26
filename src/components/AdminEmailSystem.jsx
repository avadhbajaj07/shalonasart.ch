import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Mail,
  Send,
  Inbox,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Reply,
  Archive,
  RefreshCw,
  X,
  Phone,
  MapPin,
  Palette,
  ExternalLink,
  Check,
  AlertCircle,
  Trash2,
  Loader2,
  Paperclip,
  FileText,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  getStudioEmails,
  updateStudioEmailStatus,
  sendOutgoingStudioEmail
} from '../utils/sourceOfTruthStore';

function mapDbEmail(row) {
  const isIncoming = row.direction === 'inbound';
  let meta = row.metadata;
  if (typeof meta === 'string') {
    try {
      meta = JSON.parse(meta);
    } catch {
      meta = {};
    }
  }
  meta = meta || {};

  let senderName = meta.name;
  let senderEmail = meta.email;

  if (!senderName && row.from_email) {
    if (row.from_email.includes('<')) {
      senderName = row.from_email.split('<')[0].trim();
      senderEmail = row.from_email.match(/<([^>]+)>/)?.[1];
    } else {
      senderName = row.from_email.split('@')[0];
      senderEmail = row.from_email;
    }
  }

  // Ensure attachments is always an array
  const attachments = Array.isArray(meta.attachments) ? meta.attachments : [];

  return {
    id: row.id,
    direction: isIncoming ? 'incoming' : 'outgoing',
    sender: row.from_email,
    senderName: senderName || 'Collector',
    senderEmail: senderEmail || row.from_email,
    recipient: row.to_email,
    subject: row.subject || 'No Subject',
    body: (row.body_text && row.body_text.trim()) ? row.body_text : (attachments.length > 0 ? `[Collector sent ${attachments.length} attached file${attachments.length > 1 ? 's' : ''}]` : 'No text content.'),
    bodyHtml: row.body_html || null,
    status: row.status === 'sent' ? 'replied' : row.status,
    artworkTitle: meta.artworkTitle || null,
    phone: meta.phone || null,
    location: meta.location || null,
    created_at: row.created_at || row.received_at || row.sent_at,
    attachments,
  };
}

export default function AdminEmailSystem() {
  const [storeVersion, setStoreVersion] = useState(0);
  const [dbEmails, setDbEmails] = useState([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);

  const [directionFilter, setDirectionFilter] = useState('all'); // 'all' | 'incoming' | 'outgoing'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unread' | 'replied' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyModalEmail, setReplyModalEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Compose / Reply Form State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachments, setComposeAttachments] = useState([]);
  const composeFileInputRef = useRef(null);
  const replyFileInputRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      if (file.size > 25 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 25MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        setComposeAttachments(prev => [...prev, {
          filename: file.name,
          content: base64,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setComposeAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const fetchEmailsFromSupabase = async () => {
    try {
      setIsLoadingEmails(true);
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapDbEmail);
        setDbEmails(mapped);
      }
    } catch (err) {
      console.warn('Supabase emails fetch fallback:', err.message);
    } finally {
      setIsLoadingEmails(false);
    }
  };

  useEffect(() => {
    fetchEmailsFromSupabase();

    // Listen to local broadcast events
    const handleUpdate = () => {
      setStoreVersion(v => v + 1);
      fetchEmailsFromSupabase();
    };
    window.addEventListener('shalona_emails_updated', handleUpdate);
    window.addEventListener('shalona_new_inquiry_received', handleUpdate);

    // Supabase Real-Time Channel for instant email notifications
    const channel = supabase
      .channel('public:emails')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emails' }, () => {
        fetchEmailsFromSupabase();
      })
      .subscribe();

    return () => {
      window.removeEventListener('shalona_emails_updated', handleUpdate);
      window.removeEventListener('shalona_new_inquiry_received', handleUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  const allEmails = useMemo(() => {
    if (dbEmails.length > 0) return dbEmails;
    return getStudioEmails();
  }, [dbEmails, storeVersion]);

  // Filtered emails
  const filteredEmails = useMemo(() => {
    let list = allEmails;

    if (directionFilter !== 'all') {
      list = list.filter(e => e.direction === directionFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter(e => e.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e =>
        e.sender?.toLowerCase().includes(q) ||
        e.recipient?.toLowerCase().includes(q) ||
        e.subject?.toLowerCase().includes(q) ||
        e.body?.toLowerCase().includes(q) ||
        e.artworkTitle?.toLowerCase().includes(q) ||
        e.senderName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allEmails, directionFilter, statusFilter, searchQuery]);

  // Counts
  const unreadCount = useMemo(() => {
    return allEmails.filter(e => e.direction === 'incoming' && e.status === 'unread').length;
  }, [allEmails]);

  const incomingCount = useMemo(() => {
    return allEmails.filter(e => e.direction === 'incoming').length;
  }, [allEmails]);

  const outgoingCount = useMemo(() => {
    return allEmails.filter(e => e.direction === 'outgoing').length;
  }, [allEmails]);

  // Handle open reply modal
  const openReplyModal = (email) => {
    setReplyModalEmail(email);
    setComposeAttachments([]);
    setComposeTo(email.senderEmail || '');
    setComposeSubject(email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject}`);
    setComposeBody(
      `Dear ${email.senderName || 'Collector'},\n\nThank you for reaching out regarding "${email.artworkTitle || 'Shalona Fine Art'}".\n\n\n\nWarm regards,\nShalona\nArtist Atelier · Richterswil, Switzerland\ninfo@shalonasart.ch · https://shalonasart.ch`
    );
  };

  // Handle compose new
  const openComposeNew = () => {
    setReplyModalEmail(null);
    setComposeAttachments([]);
    setComposeTo('');
    setComposeSubject('Inquiry Regarding Shalona Fine Art Atelier');
    setComposeBody(
      `Hello,\n\nThank you for your interest in Shalona's original artworks.\n\n\n\nWith warm regards,\nShalona\nFine Art Atelier · Richterswil, Switzerland\ninfo@shalonasart.ch`
    );
    setIsComposeOpen(true);
  };

  // Dispatch email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      alert('Please fill out recipient email, subject, and message body.');
      return;
    }

    setIsSending(true);
    try {
      await sendOutgoingStudioEmail({
        recipient: composeTo.trim(),
        subject: composeSubject.trim(),
        body: composeBody.trim(),
        inReplyToId: replyModalEmail ? replyModalEmail.id : null,
        attachments: composeAttachments,
      });

      showToast(`Email dispatched to ${composeTo} from info@shalonasart.ch`);
      setIsComposeOpen(false);
      setReplyModalEmail(null);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setComposeAttachments([]);
      await fetchEmailsFromSupabase();
    } catch (err) {
      alert(`Failed to send email: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await supabase.from('emails').update({ status: nextStatus }).eq('id', id);
    } catch (err) {
      console.warn('Supabase status update error:', err);
    }
    updateStudioEmailStatus(id, nextStatus);
    setDbEmails(prev => prev.map(e => e.id === id ? { ...e, status: nextStatus } : e));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(prev => ({ ...prev, status: nextStatus }));
    }
    setStoreVersion(v => v + 1);
  };

  const handleDeleteEmail = async (id) => {
    if (window.confirm('Permanently delete this email from the database?')) {
      try {
        await supabase.from('emails').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
      setDbEmails(prev => prev.filter(e => e.id !== id));
      setSelectedEmail(null);
      setStoreVersion(v => v + 1);
      showToast('Message deleted.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1817] text-[#FAF8F3] px-5 py-3.5 rounded-xl shadow-2xl border border-[#A88B57]/40 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#A88B57]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="bg-[#FAF8F3] border border-[#E5E2D9] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1817] text-[#FAF8F3] text-xs font-mono uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-[#A88B57]" />
              <span>Studio Mailroom · info@shalonasart.ch</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1817]">
              Studio Inquiries & Correspondence
            </h2>
            <p className="text-sm font-sans text-[#7A7770] leading-relaxed">
              Official communications hub for <span className="font-semibold text-[#1A1817]">info@shalonasart.ch</span> backed by Supabase & Resend. Collector acquisition inquiries submitted through the website appear here instantly and can be replied to directly.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={openComposeNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] active:scale-98 text-white text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#A88B57]" />
              <span>Compose Email</span>
            </button>

            <button
              onClick={fetchEmailsFromSupabase}
              className="p-3 rounded-xl border border-[#DCD9D0] bg-white hover:bg-[#FAF8F3] text-[#7A7770] hover:text-[#1A1817] transition-all cursor-pointer"
              title="Refresh Mailbox"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingEmails ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#E5E2D9]">
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9]">
            <div className="text-[10px] font-mono uppercase text-[#7A7770]">Unread Inquiries</div>
            <div className="font-serif text-2xl text-[#1A1817] font-medium mt-1">
              {unreadCount}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9]">
            <div className="text-[10px] font-mono uppercase text-[#7A7770]">Total Received</div>
            <div className="font-serif text-2xl text-[#1A1817] font-medium mt-1">
              {incomingCount}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9]">
            <div className="text-[10px] font-mono uppercase text-[#7A7770]">Sent Outbox</div>
            <div className="font-serif text-2xl text-[#1A1817] font-medium mt-1">
              {outgoingCount}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9]">
            <div className="text-[10px] font-mono uppercase text-[#7A7770]">Atelier Address</div>
            <div className="text-xs font-mono text-[#A88B57] font-medium mt-2 truncate" title="info@shalonasart.ch">
              info@shalonasart.ch
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5E2D9]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A7770] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collector name, email, artwork title, or message..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#DCD9D0] bg-[#FAF8F3] text-xs font-sans text-[#2A2A2A] focus:outline-none focus:border-[#A88B57] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#DCD9D0] bg-white text-xs font-sans text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
          >
            <option value="all">All Directions</option>
            <option value="incoming">Received (Inbound)</option>
            <option value="outgoing">Sent (Outbound)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#DCD9D0] bg-white text-xs font-sans text-[#2A2A2A] focus:outline-none focus:border-[#A88B57]"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread Only</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* SPLIT VIEW: INBOX LIST + MESSAGE READER */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EMAIL THREADS LIST */}
        <div className={`${selectedEmail ? 'hidden lg:block lg:col-span-5' : 'col-span-12'} bg-white rounded-2xl border border-[#E5E2D9] overflow-hidden shadow-sm`}>
          <div className="p-4 border-b border-[#E5E2D9] bg-[#FAF8F3] flex items-center justify-between text-xs font-sans font-medium text-[#7A7770]">
            <span>Messages ({filteredEmails.length})</span>
            <span>Sorted by newest</span>
          </div>

          <div className="divide-y divide-[#E5E2D9] max-h-[720px] overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="p-12 text-center text-[#7A7770] space-y-2">
                <Inbox className="w-8 h-8 text-[#DCD9D0] mx-auto" />
                <p className="text-xs font-sans">No messages found matching your search filter.</p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isUnread = email.direction === 'incoming' && email.status === 'unread';

                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      if (email.direction === 'incoming' && email.status === 'unread') {
                        handleUpdateStatus(email.id, 'read');
                      }
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FAF8F3] border-l-4 border-l-[#A88B57]'
                        : isUnread
                        ? 'bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-[#A88B57]/50'
                        : 'hover:bg-[#FAF8F3]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {email.direction === 'incoming' ? (
                          <span className="p-1 rounded bg-amber-100/70 text-[#A88B57]">
                            <ArrowDownLeft className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="p-1 rounded bg-emerald-100/70 text-emerald-700">
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        )}
                        <span className={`text-xs font-sans truncate max-w-[170px] ${isUnread ? 'font-bold text-[#1A1817]' : 'font-medium text-[#2A2A2A]'}`}>
                          {email.direction === 'incoming' ? (email.senderName || email.senderEmail) : `To: ${email.recipient}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#A88B57]" />
                        )}
                        <span className="text-[10px] font-mono text-[#7A7770]">
                          {email.created_at ? new Date(email.created_at).toLocaleDateString('de-CH') : ''}
                        </span>
                      </div>
                    </div>

                    <p className={`text-xs font-serif line-clamp-1 mb-1 ${isUnread ? 'font-semibold text-[#1A1817]' : 'text-[#2A2A2A]'}`}>
                      {email.subject}
                    </p>

                    <p className="text-[11px] font-sans text-[#7A7770] line-clamp-2 leading-relaxed">
                      {email.body}
                    </p>

                    {/* Attachment & Artwork Pills in List */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {email.attachments && email.attachments.length > 0 && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/90 text-[10px] font-sans font-semibold text-amber-900 shadow-xs">
                          <Paperclip className="w-3 h-3 text-[#A88B57]" />
                          <span>{email.attachments.length} attached file{email.attachments.length > 1 ? 's' : ''}</span>
                        </div>
                      )}

                      {email.artworkTitle && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] text-[9px] font-sans font-medium text-[#A88B57]">
                          <Palette className="w-2.5 h-2.5" />
                          <span className="truncate max-w-[180px]">{email.artworkTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FULL EMAIL READER VIEW */}
        {selectedEmail ? (
          <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-[#E5E2D9] p-5 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            {/* Mobile Back Button */}
            <div className="lg:hidden pb-1">
              <button
                onClick={() => setSelectedEmail(null)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF8F3] active:bg-[#EAE6DE] rounded-xl border border-[#DCD9D0] text-[#1A1817] text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#A88B57]" />
                <span>← Back to All Messages</span>
              </button>
            </div>

            {/* Header */}
            <div className="border-b border-[#E5E2D9] pb-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#A88B57]">
                    {selectedEmail.direction === 'incoming' ? 'Incoming Inquiry to info@shalonasart.ch' : 'Outgoing Studio Message'}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1A1817]">
                    {selectedEmail.subject}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedEmail(null)}
                  className="hidden lg:block p-1.5 rounded-lg text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] cursor-pointer"
                  title="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sender & Recipient Meta */}
              <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E5E2D9] text-xs font-sans space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong className="text-[#1A1817]">From:</strong>{' '}
                    <span className="text-[#2A2A2A]">{selectedEmail.sender || selectedEmail.senderEmail}</span>
                  </div>
                  <div className="text-[#7A7770] font-mono text-[11px]">
                    {selectedEmail.created_at ? new Date(selectedEmail.created_at).toLocaleString('de-CH') : ''}
                  </div>
                </div>

                <div>
                  <strong className="text-[#1A1817]">To:</strong>{' '}
                  <span className="text-[#2A2A2A]">{selectedEmail.recipient}</span>
                </div>

                {selectedEmail.phone && (
                  <div className="flex items-center gap-1.5 text-[#2A2A2A]">
                    <Phone className="w-3.5 h-3.5 text-[#A88B57]" />
                    <span><strong>Phone:</strong> {selectedEmail.phone}</span>
                  </div>
                )}

                {selectedEmail.location && (
                  <div className="flex items-center gap-1.5 text-[#2A2A2A]">
                    <MapPin className="w-3.5 h-3.5 text-[#A88B57]" />
                    <span><strong>Location:</strong> {selectedEmail.location}</span>
                  </div>
                )}

                {selectedEmail.artworkTitle && (
                  <div className="flex items-center gap-1.5 text-[#A88B57] font-medium pt-1">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Artwork: "{selectedEmail.artworkTitle}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="text-sm font-sans text-[#1A1817] leading-relaxed whitespace-pre-wrap font-normal p-1">
              {selectedEmail.body}
            </div>

            {/* Attached Files from Collector / Inbound */}
            {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#1A1817]">
                    <Paperclip className="w-4 h-4 text-[#A88B57]" />
                    <span>Attached Files ({selectedEmail.attachments.length})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7A7770]">Stored securely in Supabase</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {selectedEmail.attachments.map((att, idx) => {
                    const isImg = att.contentType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(att.filename || '');
                    const fileUrl = att.downloadUrl || att.url;
                    return (
                      <div
                        key={att.id || idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-50 border border-[#DCD9D0] shadow-xs transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {isImg && fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAF8F3] border border-[#DCD9D0] shrink-0 hover:opacity-80 transition-opacity"
                              title="Click to view full image"
                            >
                              <img
                                src={fileUrl}
                                alt={att.filename}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#ECE6DC] flex items-center justify-center shrink-0 text-[#A88B57]">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <a
                              href={fileUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-sans font-semibold text-[#1A1817] hover:text-[#A88B57] truncate block"
                              title={att.filename}
                            >
                              {att.filename || 'Attachment'}
                            </a>
                            {att.size ? (
                              <p className="text-[10px] text-[#7A7770] font-mono mt-0.5">
                                {att.size > 1024 * 1024
                                  ? `${(att.size / (1024 * 1024)).toFixed(1)} MB`
                                  : `${Math.round(att.size / 1024)} KB`}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {fileUrl && (
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] border border-transparent hover:border-[#DCD9D0] transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                              href={fileUrl}
                              download={att.filename || 'attachment'}
                              className="p-2 rounded-lg bg-[#FAF8F3] hover:bg-[#1A1817] text-[#7A7770] hover:text-white border border-[#DCD9D0] transition-colors"
                              title="Download to computer"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="pt-6 border-t border-[#E5E2D9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {selectedEmail.direction === 'incoming' && (
                  <button
                    onClick={() => openReplyModal(selectedEmail)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] active:scale-98 text-white text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                  >
                    <Reply className="w-4 h-4 text-[#A88B57]" />
                    <span>Reply from info@shalonasart.ch</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = selectedEmail.status === 'unread' ? 'read' : 'unread';
                      handleUpdateStatus(selectedEmail.id, next);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] transition-all text-center cursor-pointer"
                  >
                    Mark as {selectedEmail.status === 'unread' ? 'Read' : 'Unread'}
                  </button>

                  <button
                    onClick={() => {
                      const next = selectedEmail.status === 'archived' ? 'read' : 'archived';
                      handleUpdateStatus(selectedEmail.id, next);
                      showToast(`Message marked as ${next}.`);
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] transition-all cursor-pointer"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                    className="px-3.5 py-2.5 rounded-xl border border-red-200 text-xs font-sans text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    title="Delete message from database"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#7A7770] font-sans text-center sm:text-right pt-2 sm:pt-0">
                Studio Archive ID: <span className="font-mono">{selectedEmail.id.slice ? selectedEmail.id.slice(0, 8) : selectedEmail.id}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex lg:col-span-7 bg-[#FAF8F3]/60 rounded-2xl border border-dashed border-[#DCD9D0] min-h-[400px] items-center justify-center text-center p-8 text-[#7A7770]">
            <div className="space-y-3 max-w-sm">
              <Mail className="w-10 h-10 text-[#A88B57] mx-auto opacity-60" />
              <h4 className="font-serif text-lg text-[#1A1817]">Select a conversation to read</h4>
              <p className="text-xs font-sans leading-relaxed">
                Click any message on the left to read full collector inquiries and respond directly from <span className="font-semibold text-[#1A1817]">info@shalonasart.ch</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: COMPOSE NEW EMAIL */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E2D9] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#1A1817]">
                  Compose New Studio Email
                </h3>
                <p className="text-xs font-mono text-[#A88B57] mt-0.5">
                  Sending from: info@shalonasart.ch
                </p>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#7A7770] mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  required
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="collector@gallery.ch"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD9D0] bg-[#FAF8F3] text-sm text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#7A7770] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject of the email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD9D0] bg-[#FAF8F3] text-sm text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#7A7770] mb-1">
                  Message Body *
                </label>
                <textarea
                  rows={8}
                  required
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD9D0] bg-[#FAF8F3] text-sm text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white font-sans leading-relaxed"
                />
              </div>

              {/* Attachments Section in Compose */}
              <div className="pt-2 border-t border-[#E5E2D9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#7A7770]">
                    Attached Files ({composeAttachments.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => composeFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCD9D0] hover:border-[#A88B57] bg-[#FAF8F3] hover:bg-white text-xs font-sans text-[#2A2A2A] transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-[#A88B57]" />
                    <span>Attach Files</span>
                  </button>
                  <input
                    type="file"
                    ref={composeFileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                  />
                </div>

                {composeAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {composeAttachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#DCD9D0] text-xs font-sans text-[#1A1817]"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#A88B57] shrink-0" />
                        <span className="max-w-[180px] truncate font-medium">{att.filename}</span>
                        <span className="text-[10px] text-[#7A7770] font-mono">
                          {att.size ? `${Math.round(att.size / 1024)} KB` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-0.5 text-[#7A7770] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove attachment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#7A7770] hover:bg-[#FAF8F3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] text-white text-xs font-sans font-medium uppercase tracking-wider disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#A88B57]" />
                      <span>Dispatch Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLY TO EMAIL */}
      {replyModalEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E2D9] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#1A1817]">
                  Reply to {replyModalEmail.senderName || replyModalEmail.senderEmail}
                </h3>
                <p className="text-xs font-mono text-[#A88B57] mt-0.5">
                  Replying from: info@shalonasart.ch
                </p>
              </div>
              <button
                onClick={() => setReplyModalEmail(null)}
                className="p-1 rounded-lg text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#7A7770] mb-1">
                  Recipient
                </label>
                <input
                  type="email"
                  disabled
                  value={composeTo}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD9D0] bg-gray-100 text-sm text-[#7A7770]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#7A7770] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD9D0] bg-[#FAF8F3] text-sm text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#7A7770] mb-1">
                  Your Studio Response *
                </label>
                <textarea
                  rows={9}
                  required
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD9D0] bg-[#FAF8F3] text-sm text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white font-sans leading-relaxed"
                />
              </div>

              {/* Attachments Section in Reply */}
              <div className="pt-2 border-t border-[#E5E2D9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#7A7770]">
                    Attached Files ({composeAttachments.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => replyFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCD9D0] hover:border-[#A88B57] bg-[#FAF8F3] hover:bg-white text-xs font-sans text-[#2A2A2A] transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-[#A88B57]" />
                    <span>Attach Files</span>
                  </button>
                  <input
                    type="file"
                    ref={replyFileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                  />
                </div>

                {composeAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {composeAttachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#DCD9D0] text-xs font-sans text-[#1A1817]"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#A88B57] shrink-0" />
                        <span className="max-w-[180px] truncate font-medium">{att.filename}</span>
                        <span className="text-[10px] text-[#7A7770] font-mono">
                          {att.size ? `${Math.round(att.size / 1024)} KB` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-0.5 text-[#7A7770] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove attachment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setReplyModalEmail(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#7A7770] hover:bg-[#FAF8F3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] text-white text-xs font-sans font-medium uppercase tracking-wider disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Reply...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#A88B57]" />
                      <span>Send Studio Reply</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
