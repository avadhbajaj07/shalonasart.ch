# Google Analytics 4, Tag Manager & Webmaster Verification Setup
**Website:** https://shalonasart.ch  
**Architecture:** Consent-Ready, Privacy-Preserving GA4 / GTM Pipeline  

---

## 1. Overview of Analytics Integration

The application has been outfitted with a centralized analytics layer (`src/utils/analytics.js`) that safely hooks into Google Analytics 4, Google Tag Manager, and Microsoft Clarity.

To protect client privacy and comply with Swiss nFADP & GDPR guidelines:
- No Personally Identifiable Information (name, email, phone number, personal message) is ever dispatched to analytics servers.
- Localhost and development preview traffic are automatically filtered out.
- Single Page Application route transitions trigger automated `page_view` events.

---

## 2. Configuration via Environment Variables

To activate tracking, add the following variables in **Vercel Dashboard → Settings → Environment Variables**:

| Variable Name | Description | Example / Format |
| :--- | :--- | :--- |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 Data Stream Measurement ID | `G-XXXXXXXXXX` |
| `VITE_GTM_CONTAINER_ID` | Google Tag Manager Container ID | `GTM-XXXXXXX` |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity Project ID | `xxxxxxxxxx` |
| `VITE_GSC_VERIFICATION` | Google Search Console HTML Tag Verification code | `abcdef123456...` |
| `VITE_BING_VERIFICATION` | Bing Webmaster Tools verification code | `1234567890ABCDEF...` |

---

## 3. High-Intent Business Events Catalog

These events are automatically pushed to `window.dataLayer` and `window.gtag`:

| Event Name | Trigger Condition | Parameters Dispatched | Recommended GA4 Marking |
| :--- | :--- | :--- | :--- |
| `generate_lead` | User submits artwork acquisition or contact inquiry | `artwork_title`, `inquiry_type`, `value: 1`, `currency: 'CHF'` | **Key Event (Conversion)** |
| `artwork_enquiry_click` | User clicks "Acquisition Inquiry" or "Inspect" | `artwork_title`, `inquiry_source` | Recommended Event |
| `view_artwork` | User views artwork details or opens high-res zoom | `artwork_id`, `artwork_title`, `artwork_category`, `artwork_year` | General Engagement |
| `view_collection` | User switches category tab in the gallery | `collection_name` | General Engagement |
| `language_change` | User toggles language (EN, DE, FR, IT) | `language` | General Engagement |
| `view_exhibition` | User inspects Ortsmuseum Bärenkeller exhibition guide | `exhibition_name`, `venue` | General Engagement |
| `page_view` | User navigates to any internal route | `page_path`, `page_title`, `page_location` | Core Event |

---

## 4. Google Search Console & Bing Webmaster Verification

1. **Google Search Console**:
   - Add property `https://shalonasart.ch`.
   - Submit Sitemap: `https://shalonasart.ch/sitemap.xml`.
   - Submit Image Sitemap: `https://shalonasart.ch/sitemap-images.xml`.
2. **Bing Webmaster Tools**:
   - Import verification directly from Google Search Console or use DNS TXT record.
