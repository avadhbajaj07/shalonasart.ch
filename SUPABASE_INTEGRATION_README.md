# Shalona Fine Art Atelier — Supabase & Admin Integration

This document outlines the architecture, environment variables, migration procedures, DNS setup, and a complete 1-page guide for Shalona to manage her artworks and emails.

---

## 1. Environment Variables Configuration

Set these variables in your local `.env.local` file and in the **Vercel Project Settings** (`Settings -> Environment Variables`):

```bash
# --- Supabase Database & Auth ---
NEXT_PUBLIC_SUPABASE_URL=https://mhiyjqcwdbqpmplghewi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4tV2fBv9dgzSHv7sjdzYWw_jnIQxJDa
VITE_SUPABASE_URL=https://mhiyjqcwdbqpmplghewi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_4tV2fBv9dgzSHv7sjdzYWw_jnIQxJDa
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:[YOUR-DATABASE-PASSWORD]@db.mhiyjqcwdbqpmplghewi.supabase.co:5432/postgres

# --- Studio Email & Communication (info@shalonasart.ch) ---
RESEND_API_KEY=re_your_api_key_here
EMAIL_DOMAIN=shalonasart.ch
ADMIN_EMAIL=info@shalonasart.ch
STUDIO_INBOX_EMAIL=info@shalonasart.ch
RESEND_FROM_EMAIL=Shalona Studio <info@shalonasart.ch>
```

---

## 2. Database Migrations & Artwork Sync

### Database Tables Created in Supabase:
- `artworks`: Holds all 51 artworks, title, slug, descriptions, dimensions, medium, year, status, sort_order, is_published, and public Supabase Storage image URLs.
- `artwork_images`: Supports additional high-res detail photos for each artwork.
- `emails`: Stores all inbound inquiries from collectors and outbound replies sent from `info@shalonasart.ch`.
- Storage Bucket `artworks`: Houses compressed original images and thumbnails with public read access and authenticated write protection.

### Running Migrations:
```bash
# Run SQL migration against PostgreSQL
psql "postgresql://postgres:[YOUR-DATABASE-PASSWORD]@db.mhiyjqcwdbqpmplghewi.supabase.co:5432/postgres" -f supabase/migrations/20261126_init_artworks_and_emails.sql

# Sync all 51 artworks and upload physical images to Supabase Storage
node scripts/migrate-artworks.js

# Ensure the admin user exists in Supabase Auth
node scripts/create-admin-user.js

# Verify CRUD and email system
node scripts/test-supabase-email-and-crud.js
```

---

## 3. DNS Records for Domain Verification (`shalonasart.ch`)

To send emails directly from `info@shalonasart.ch` with high inbox deliverability via Resend:

1. Log into your domain registrar / DNS provider for `shalonasart.ch`.
2. Add the following records:

| Type | Host / Name | Value / Destination | Priority / TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `resend._domainkey` | *Paste DKIM key from Resend dashboard* | Default |
| **TXT** | `@` or `shalonasart.ch` | `v=spf1 include:amazonses.com ~all` | Default |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@shalonasart.ch;` | Default |

> **Inbound Email Note:**
> - If `info@shalonasart.ch` is hosted with an existing Swiss email provider (e.g., Infomaniak or Hostpoint), keep your current MX records so normal mailbox access on mobile phone Mail apps continues to work. All inquiries through the website contact form are automatically recorded in the Supabase `emails` table and forwarded to your inbox.
> - If using Resend Inbound directly, point your MX records to the Resend Inbound endpoint and configure the webhook URL: `https://shalonasart.ch/api/email-inbound`.

---

## 4. One-Page Client Guide: "How to Use Your Studio Admin Panel"

Welcome to your private Studio Admin Panel! You can access it anytime from your phone, iPad, or computer:

### 1. Logging In
- Go to: **[https://shalonasart.ch/admin](https://shalonasart.ch/admin)**
- Email: `info@shalonasart.ch`
- Password: `Shalona@Studio#2026!`

### 2. Studio Email & Collector Inquiries (`Studio Email` Tab)
- **Check Messages**: When collectors submit inquiries on your website, they appear instantly in your **Studio Mailroom**.
- **Read & Reply**: Tap any message to view the collector's name, email, phone number, and message. Tap the black **"Reply from info@shalonasart.ch"** button to compose and send your reply directly.
- **Compose New**: Tap **"Compose Email"** at the top to send an official studio message to any gallery or collector.
- **Status Badges**: You can mark messages as **Read**, **Unread**, or **Archive** them.

### 3. Managing Artworks (`Artworks Inventory` Tab)
- **View All 51 Artworks**: Browse your complete catalogue with titles, categories, dimensions, and live preview thumbnails.
- **Publish / Hide Toggle**: Click the eye icon next to any artwork to instantly switch between **Live on Website** and **Hidden (Draft)**.
- **Reorder Artworks**: Click the **↑** (Up) or **↓** (Down) arrows to change the display sequence of paintings on the homepage and gallery.
- **Edit Details**: Tap the pencil icon (`Edit`) to update titles, medium, dimensions, prices, or upload a new photo.
- **Delete an Artwork**: Tap the trash icon to permanently remove an artwork from your catalogue and database.

### 4. Adding a New Artwork (`+ Add Artwork` Tab)
1. Tap **"+ Add Artwork"**.
2. Tap **"Upload Artwork Photo"** to select or take a photo with your smartphone camera. The system automatically optimizes and compresses the photo for high-speed loading.
3. Fill in the **Title**, **Category** (e.g. *Abstract*, *Figurative Abstracts*, or *Unfinished Works*), **Dimensions**, **Medium**, and your **Philosophy / Story**.
4. Tap **"Publish Artwork Live to Website"**. Your new artwork is immediately saved to the permanent Supabase database and published to the live website!
