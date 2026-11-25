# Content Verification & Client Audit Guide: Shalona's Art
**Domain:** [shalonasart.ch](https://shalonasart.ch)  
**Atelier Location:** Richterswil, Switzerland  
**Official Studio Contact:** `info@shalonasart.ch`

---

## 1. Background & Root Cause

During earlier AI-assisted site rebuilds, synthetic artwork descriptions and philosophical interpretations (such as *"Waves of emotional brilliancy to the unknown and known"*) were automatically generated. 

When comparing against the original WordPress database export (`data_dump/arts.json`), we confirmed that **all original gallery artworks had empty description and excerpt fields**. The artist purposely let the visual art speak for itself without invented narratives. The only authentic text written by Shalona lived in:
1. **The Artist Biography page** (WordPress Page ID: `26`) — *Where the Visible Meets the Unseen*, *Artistic Vision*, *Creative Process*, and *Art as a Space for Reflection*.
2. **The Unfinished Works page** (WordPress Page ID: `1084`) — Notes on 4 specific works (*Free as a Bird*, *Untitled*, *Don’t Speak*, *Explosive Breakthrough*).
3. **The Home Hero** (WordPress Page ID: `24`) — *“Stillness is never empty—it is full of unseen movement.”*

To ensure this can **never happen silently again**, we implemented a strict zero-invention protocol, an auditable Postgres/Supabase database schema, and an interactive Admin Verification screen.

---

## 2. Strict Content Rules Enforced

1. **Zero Invention:** No AI tool, script, or automated process may invent, rewrite, or paraphrase artwork titles, descriptions, philosophy, or biography text.
2. **NEEDS_REVIEW Flag:** If original content is missing, uncertain, or differs from the original export, it is marked `NEEDS_REVIEW`. It is never silently populated.
3. **Traceable Audit Log:** Every single edit is recorded in `content_revisions` with `old_value`, `new_value`, `changed_by`, and `changed_at`.
4. **Lock Protection (`is_locked`):** Any artwork or content block marked as "Locked" cannot be modified by code or AI. It can only be edited manually by the client after unlocking.
5. **Official Studio Email:** All incoming inquiries and outgoing replies route through `info@shalonasart.ch`.

---

## 3. How to Verify Content with Shalona (Step-by-Step)

### Step 1: Open the Admin Portal
1. Navigate to `/admin` on [shalonasart.ch/admin](https://shalonasart.ch/admin).
2. Enter the studio security password to authenticate.

### Step 2: Open the "Content Verification" Tab
1. Click the **Content Verification** tab in the top navigation bar (identified by the gold Shield icon).
2. You will see:
   - **Progress Counter:** "X of 57 Items Verified (Y%)" with a live progress bar.
   - **Filter Buttons:** `All`, `Needs Review`, `Unverified`, `Verified`, `Locked`.
   - **Action Buttons:** `Import WP (XML/JSON)`, `Export CSV`, and `Export JSON Backup`.

---

## 4. Advanced Custom Fields (ACF) Integration & WordPress Importer

### Root Discovery from `acf-export-2026-11-25.json`:
The original WordPress installation had an Advanced Custom Fields (ACF) field group named `arts` (`group_698f84ea9a32b`) attached to the `arts` post type:
1. `size` — Artwork Dimensions (e.g., `16 x 32`)
2. `year_created` — Creation Year / Month (e.g., `February 2023`)
3. `artwork_description` — Artwork Statement / Description
4. `medium` — Medium (e.g., `Oil Piant and Canvas`)

> [!NOTE]
> **Why `data_dump/arts.json` had empty ACF values:**
> In the ACF configuration, `"show_in_rest": 0` was set to false. By default, the WordPress REST API excludes custom fields unless `show_in_rest: 1` is explicitly enabled. Therefore, `arts.json` did not contain the postmeta.

### How to Hydrate All 57 Artworks from WordPress (One-Click):
1. **In WordPress Admin:**
   - Go to **Tools → Export** (`/wp-admin/export.php`).
   - Select the radio button for **"Arts"**.
   - Click **"Download Export File"** (saves a `.xml` file with all `<wp:postmeta>` values).
2. **In Shalona Admin (`/admin` → "Content Verification"):**
   - Click **Import WP (XML/JSON)**.
   - Select the exported `.xml` file.
   - The importer will automatically extract `size`, `year_created`, `artwork_description`, and `medium` for every piece and mark them as verified against authentic WordPress postmeta.

---

### Step 3: Review Each Artwork Side-by-Side
For each piece in the list:
- **Left Column (Source Baseline):** Shows the exact title, category, year, and original text from `data_dump/arts.json`.
- **Right Column (Live Website State):** Shows current text, medium, dimensions, and flags any AI-invented text.
- **Action Options:**
  - **Mark as Verified:** Click if Shalona confirms the title, dimensions, and description are accurate.
  - **Flag for Review:** Marks the piece as `NEEDS_REVIEW` if dimensions or details need physical measurement in the Richterswil studio.
  - **Revert to Original:** Instantly strips any synthetic description and resets the record to the exact original WordPress dump baseline.
  - **Lock Content:** Toggles `is_locked`. Once locked, the content is permanently shielded from automated alterations.

### Step 4: Verify Artist Biography & Statements
1. Switch the section toggle from **Artwork Catalogue** to **Site Philosophy & Bio**.
2. Review the 5 authentic core statements:
   - *Where the Visible Meets the Unseen* (Home Statement)
   - *About Shalona* (Biography Opening)
   - *Artistic Vision and Inspiration*
   - *My Creative Process*
   - *Art as a Space for Reflection*
3. Each block is verified against WordPress Page 26. Click **Mark as Verified** and **Lock Statement**.

### Step 5: Export Backups
1. Click **Export CSV** to download `shalonasart-artworks-catalogue-YYYY-MM-DD.csv`.
2. Click **Export JSON Backup** to save `shalonasart-source-of-truth-YYYY-MM-DD.json` containing all records and revision histories.

---

## 4. Studio Email System (`info@shalonasart.ch`)

The admin portal features an official mailroom under the **Studio Email (info@)** tab:
- **Inbox:** All collector acquisition inquiries submitted via the website contact form appear in real time with the collector's name, email, phone number, location, and referenced artwork.
- **Status Tracking:** Filter by `All`, `Unread`, `Replied`, or `Archived`.
- **Direct Reply:** Click **Reply from info@shalonasart.ch** to open a pre-formatted studio response with the atelier signature.
- **Serverless Dispatch:** Outgoing replies are dispatched via `/api/send-email` using Resend API. When `RESEND_API_KEY` is configured in Vercel, live emails are sent directly from `info@shalonasart.ch`. During local dev, simulated dispatch is automatically handled.

---

## 5. Technical Deliverables Summary

| Deliverable | File Path | Purpose |
| :--- | :--- | :--- |
| **Database Migration** | `supabase/migrations/20261125_content_source_of_truth.sql` | Postgres schema with `artworks`, `site_content`, `content_revisions`, triggers & RLS |
| **Audit Diff Script** | `scripts/diff_content.cjs` | Automated scanner comparing current code vs `data_dump/arts.json` |
| **Audit Report** | `CONTENT-AUDIT-DIFF.md` | Exact item-by-item diff report of all 57 original items |
| **Source-of-Truth Store** | `src/utils/sourceOfTruthStore.js` | Enforces zero-invention, audit logging, lock protection & CSV/JSON export |
| **Verification UI** | `src/components/AdminContentVerification.jsx` | Side-by-side comparison & verification screen in `/admin` |
| **Studio Email UI** | `src/components/AdminEmailSystem.jsx` | Full mailroom for `info@shalonasart.ch` inquiries and replies |
| **Serverless Email API** | `api/send-email.js` | Vercel endpoint for sending authenticated studio communications |
