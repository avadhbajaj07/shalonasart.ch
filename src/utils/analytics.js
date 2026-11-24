/**
 * Centralized, Consent-Aware Analytics Engine for Shalona's Art
 * Supports Google Analytics 4 (GA4), Google Tag Manager (GTM), Microsoft Clarity, and custom events.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-NJGL7SQQVL';
const GTM_ID = import.meta.env.VITE_GTM_CONTAINER_ID || 'GTM-KPMQWX9C';
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || '';

let isInitialized = false;

/**
 * Initializes GA4 and GTM dynamically if environment variables or settings exist
 */
export function initAnalytics() {
  if (typeof window === 'undefined' || isInitialized) return;

  // Don't track localhost or preview builds unless explicitly enabled
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isPreview = window.location.hostname.includes('vercel.app');

  // GTM initialization
  if (GTM_ID && !isLocal && !isPreview && !window['google_tag_manager']) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', GTM_ID);
  }

  // GA4 initialization
  if (GA_ID && !isLocal && !isPreview && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, {
      send_page_view: false // Managed manually on route transitions
    });
  }

  // Microsoft Clarity initialization
  if (CLARITY_ID && !isLocal && !isPreview) {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  isInitialized = true;
}

/**
 * Dispatches a custom event to dataLayer / GA4 gtag
 * Strips any Personally Identifiable Information (PII)
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  // Sanitize out any accidental personal fields
  const { name, email, phone, message, ...safeParams } = params;

  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...safeParams
  };

  if (window.dataLayer) {
    window.dataLayer.push(eventPayload);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, safeParams);
  }

  // Log in local development for verification
  if (window.location.hostname === 'localhost') {
    console.debug(`[Analytics Track] ${eventName}:`, safeParams);
  }
}

/**
 * Track route / page view
 */
export function trackPageView(path, title) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  });
}

/**
 * High-intent art interaction tracking
 */
export function trackArtworkView(artwork) {
  if (!artwork) return;
  trackEvent('view_artwork', {
    artwork_id: artwork.id,
    artwork_title: artwork.title,
    artwork_category: artwork.category,
    artwork_year: artwork.year,
    artwork_status: artwork.status
  });
}

export function trackCollectionFilter(category) {
  trackEvent('view_collection', {
    collection_name: category
  });
}

export function trackInquiryClick(artworkTitle, source = 'modal') {
  trackEvent('artwork_enquiry_click', {
    artwork_title: artworkTitle || 'General',
    inquiry_source: source
  });
}

export function trackLeadGenerated(artworkTitle, inquiryType) {
  trackEvent('generate_lead', {
    value: 1,
    currency: 'CHF',
    artwork_title: artworkTitle || 'General',
    inquiry_type: inquiryType || 'Acquisition'
  });
}

export function trackExhibitionAction(action, details = {}) {
  trackEvent(action, {
    exhibition_name: 'Mysticism, Resilience and Empowerment',
    venue: 'Ortsmuseum Bärenkeller',
    ...details
  });
}

export function trackLanguageChange(language) {
  trackEvent('language_change', {
    language: language
  });
}
