import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import {
  getStudioEmails,
  updateStudioEmailStatus,
  sendOutgoingStudioEmail
} from '../utils/sourceOfTruthStore';

export default function AdminEmailSystem() {
  const [storeVersion, setStoreVersion] = useState(0);
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
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setStoreVersion(v => v + 1);
    window.addEventListener('shalona_emails_updated', handleUpdate);
    window.addEventListener('shalona_new_inquiry_received', handleUpdate);
    return () => {
      window.removeEventListener('shalona_emails_updated', handleUpdate);
      window.removeEventListener('shalona_new_inquiry_received', handleUpdate);
    };
  }, []);

  const allEmails = useMemo(() => getStudioEmails(), [storeVersion]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
    setComposeTo(email.senderEmail || '');
    setComposeSubject(email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject}`);
    setComposeBody(
      `Dear ${email.senderName || 'Collector'},\n\nThank you for reaching out regarding "${email.artworkTitle || 'Shalona Fine Art'}".\n\n\n\nWarm regards,\nShalona\nArtist Atelier · Richterswil, Switzerland\ninfo@shalonasart.ch · https://shalonasart.ch`
    );
  };

  // Handle compose new
  const openComposeNew = () => {
    setReplyModalEmail(null);
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
        inReplyToId: replyModalEmail ? replyModalEmail.id : null
      });

      showToast(`Email dispatched to ${composeTo} from info@shalonasart.ch`);
      setIsComposeOpen(false);
      setReplyModalEmail(null);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
    } catch (err) {
      alert(`Failed to send email: ${err.message}`);
    } finally {
      setIsSending(false);
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
              Official communications hub for <span className="font-semibold text-[#1A1817]">info@shalonasart.ch</span>. Collector acquisition inquiries submitted through the website appear here instantly and can be replied to directly.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={openComposeNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] active:scale-98 text-white text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-sm"
            >
              <Send className="w-4 h-4 text-[#A88B57]" />
              <span>Compose Email</span>
            </button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#E5E2D9]">
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9] text-center">
            <div className="text-xl font-serif text-[#1A1817] font-normal">{allEmails.length}</div>
            <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Total Messages</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9] text-center">
            <div className="text-xl font-serif text-[#A88B57] font-normal">{unreadCount}</div>
            <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Unread Inquiries</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9] text-center">
            <div className="text-xl font-serif text-[#1A1817] font-normal">{incomingCount}</div>
            <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Collector Inbound</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E2D9] text-center">
            <div className="text-xl font-serif text-[#1A1817] font-normal">{outgoingCount}</div>
            <div className="text-[11px] font-sans text-[#7A7770] uppercase tracking-wider mt-0.5">Studio Sent</div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Direction Tabs */}
        <div className="flex bg-[#FAF8F3] p-1 rounded-xl border border-[#DCD9D0] shadow-sm">
          <button
            onClick={() => setDirectionFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium uppercase tracking-wider transition-all ${
              directionFilter === 'all'
                ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                : 'text-[#7A7770] hover:text-[#1A1817]'
            }`}
          >
            All ({allEmails.length})
          </button>
          <button
            onClick={() => setDirectionFilter('incoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              directionFilter === 'incoming'
                ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                : 'text-[#7A7770] hover:text-[#1A1817]'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>Inbox ({incomingCount})</span>
          </button>
          <button
            onClick={() => setDirectionFilter('outgoing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              directionFilter === 'outgoing'
                ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                : 'text-[#7A7770] hover:text-[#1A1817]'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[#A88B57]" />
            <span>Sent ({outgoingCount})</span>
          </button>
        </div>

        {/* Status Filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#7A7770] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sender, subject, artwork..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD9D0] rounded-xl text-xs font-sans focus:outline-none focus:border-[#A88B57]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#FAF8F3] p-1 rounded-xl border border-[#DCD9D0]">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'unread', label: 'Unread' },
              { id: 'replied', label: 'Replied' },
              { id: 'archived', label: 'Archived' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-medium uppercase tracking-wider transition-all ${
                  statusFilter === f.id
                    ? 'bg-white text-[#1A1817] shadow-sm font-semibold'
                    : 'text-[#7A7770] hover:text-[#1A1817]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MESSAGES LIST & DETAIL PANE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className={`${selectedEmail ? 'hidden lg:block lg:col-span-5' : 'col-span-12'} space-y-3`}>
          {filteredEmails.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E2D9] text-[#7A7770]">
              <Inbox className="w-8 h-8 text-[#A88B57] mx-auto mb-2 opacity-60" />
              <p className="font-serif text-lg text-[#2A2A2A]">No messages found in this view.</p>
              <button
                onClick={() => { setDirectionFilter('all'); setStatusFilter('all'); setSearchQuery(''); }}
                className="mt-3 text-xs uppercase tracking-wider text-[#A88B57] underline font-sans"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  // Auto mark as read when opened
                  if (email.status === 'unread') {
                    updateStudioEmailStatus(email.id, 'read');
                    email.status = 'read';
                    setStoreVersion(v => v + 1);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                  selectedEmail?.id === email.id
                    ? 'bg-white border-[#A88B57] shadow-md ring-1 ring-[#A88B57]/30'
                    : email.status === 'unread'
                    ? 'bg-white border-[#DCD9D0] shadow-sm ring-1 ring-amber-200'
                    : 'bg-[#FAF8F3]/60 border-[#E5E2D9] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {email.direction === 'incoming' ? (
                      <span className="p-1 rounded-md bg-amber-50 text-[#A88B57]">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-stone-100 text-[#1A1817]">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-sans text-xs font-semibold text-[#1A1817] truncate max-w-[180px] sm:max-w-xs">
                      {email.senderName || email.sender || email.recipient}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {email.status === 'unread' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                        New
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#7A7770]">
                      {email.created_at ? new Date(email.created_at).toLocaleDateString('de-CH', { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>

                <div className="font-serif text-sm font-normal text-[#1A1817] mb-1 line-clamp-1">
                  {email.subject}
                </div>

                <p className="text-xs font-sans text-[#7A7770] line-clamp-2 leading-relaxed">
                  {email.body}
                </p>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  {email.artworkTitle ? (
                    <span className="text-[11px] font-sans text-[#A88B57] flex items-center gap-1 font-medium">
                      <Palette className="w-3 h-3" />
                      <span>{email.artworkTitle}</span>
                    </span>
                  ) : <span />}

                  <span className={`text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    email.status === 'unread'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : email.status === 'replied'
                      ? 'bg-emerald-100 text-emerald-900 font-medium'
                      : 'bg-gray-100 text-[#7A7770]'
                  }`}>
                    {email.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Reader Column */}
        {selectedEmail && (
          <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-[#E5E2D9] p-5 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            {/* Mobile Back Button */}
            <div className="lg:hidden pb-1">
              <button
                onClick={() => setSelectedEmail(null)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF8F3] active:bg-[#EAE6DE] rounded-xl border border-[#DCD9D0] text-[#1A1817] text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-sm"
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
                  className="hidden lg:block p-1.5 rounded-lg text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3]"
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

            {/* Actions Toolbar */}
            <div className="pt-6 border-t border-[#E5E2D9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {selectedEmail.direction === 'incoming' && (
                  <button
                    onClick={() => openReplyModal(selectedEmail)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] active:scale-98 text-white text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-sm"
                  >
                    <Reply className="w-4 h-4 text-[#A88B57]" />
                    <span>Reply from info@shalonasart.ch</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = selectedEmail.status === 'unread' ? 'read' : 'unread';
                      updateStudioEmailStatus(selectedEmail.id, next);
                      selectedEmail.status = next;
                      setStoreVersion(v => v + 1);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] transition-all text-center"
                  >
                    Mark as {selectedEmail.status === 'unread' ? 'Read' : 'Unread'}
                  </button>

                  <button
                    onClick={() => {
                      const next = selectedEmail.status === 'archived' ? 'read' : 'archived';
                      updateStudioEmailStatus(selectedEmail.id, next);
                      selectedEmail.status = next;
                      setStoreVersion(v => v + 1);
                      showToast(`Message marked as ${next}.`);
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-[#DCD9D0] text-xs font-sans text-[#7A7770] hover:text-[#1A1817] hover:bg-[#FAF8F3] transition-all"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#7A7770] font-sans text-center sm:text-right pt-2 sm:pt-0">
                Status: <strong className="capitalize text-[#1A1817]">{selectedEmail.status}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON ON MOBILE */}
      <button
        onClick={openComposeNew}
        className="sm:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#1A1817] text-white shadow-2xl border border-[#A88B57]/50 flex items-center justify-center active:scale-90 transition-all"
        title="Compose Email from info@shalonasart.ch"
      >
        <Send className="w-5 h-5 text-[#A88B57]" />
      </button>

      {/* COMPOSE / REPLY MODAL */}
      {(isComposeOpen || replyModalEmail) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl border-0 sm:border border-[#E5E2D9] max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl space-y-5 animate-scaleUp flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-[#A88B57] uppercase tracking-wider">
                  From: info@shalonasart.ch (Shalona Fine Art Atelier)
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1A1817]">
                  {replyModalEmail ? `Reply to ${replyModalEmail.senderName || 'Collector'}` : 'Compose Studio Message'}
                </h3>
              </div>
              <button
                onClick={() => { setIsComposeOpen(false); setReplyModalEmail(null); }}
                className="p-2 rounded-lg text-[#7A7770] hover:text-[#1A1817] active:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A7770] mb-1">
                  To (Recipient Email)
                </label>
                <input
                  type="email"
                  required
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="collector@example.com"
                  className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#DCD9D0] rounded-xl text-sm font-sans text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A7770] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Regarding your artwork inquiry..."
                  className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#DCD9D0] rounded-xl text-sm font-sans text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A7770] mb-1">
                  Message Body
                </label>
                <textarea
                  rows={7}
                  required
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-4 bg-[#FAF8F3] border border-[#DCD9D0] rounded-xl text-sm font-sans text-[#1A1817] focus:outline-none focus:border-[#A88B57] focus:bg-white transition-all leading-relaxed resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E2D9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-[11px] font-sans text-[#7A7770] text-center sm:text-left">
                  Sender: <strong className="text-[#1A1817]">info@shalonasart.ch</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsComposeOpen(false); setReplyModalEmail(null); }}
                    className="flex-1 sm:flex-initial px-4 py-3 rounded-xl text-xs font-sans text-[#7A7770] hover:text-[#1A1817] text-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1817] hover:bg-[#2A2A2A] active:scale-98 text-white text-xs font-sans font-medium uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#A88B57]" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
