# 301 Permanent Redirect & URL Normalization Mapping
**Production Domain:** `https://shalonasart.ch`  
**Host Config File:** `vercel.json`  

---

## 1. Domain & Protocol Canonical Rules

1. **Protocol Canonicalization**: All non-secure `http://` traffic redirects via HTTP 301 to `https://`.
2. **Subdomain Canonicalization**: All `https://www.shalonasart.ch` traffic canonicalizes to the primary production root domain `https://shalonasart.ch/` (with canonical tag self-referencing).
3. **Trailing Slash Handling**: Consistent non-trailing slash normalization for all application routes.

---

## 2. Legacy URL to Modern SPA Route Mapping

| Legacy / Outdated URL | Target Production URL | HTTP Status | Purpose |
| :--- | :--- | :--- | :--- |
| `/my-arts` | `/arts` | 301 Permanent | Deprecated WordPress menu slug |
| `/my-arts/:path*` | `/arts/:path*` | 301 Permanent | Deep legacy artwork links |
| `/about` | `/biography` | 301 Permanent | Canonical artist biography route |
| `/arts/free-as-a-bird-2` | `/arts/free-as-a-bird` | 301 Permanent | Consolidate duplicate Free as a Bird entry |
| `/arts/untitled-2` | `/arts/untitled` | 301 Permanent | Consolidate duplicate Untitled entry |
| `/arts/soft-and-sweet` | `/unfinished-works` | 301 Permanent | Pruned WordPress test upload redirect |
| `/arts/silent-strength` | `/unfinished-works` | 301 Permanent | Pruned WordPress duplicate image upload redirect |
| `/arts/relaxed-confidence` | `/unfinished-works` | 301 Permanent | Pruned WordPress test upload redirect |
| `/arts/vulnerability` | `/unfinished-works` | 301 Permanent | Pruned WordPress duplicate image upload redirect |
| `/unfinished-works-tab` | `/arts` | 301 Permanent | Legacy unfinished works tab migration |
| `/gallery` | `/arts` | 301 Permanent | External incoming link normalization |
| `/wp-login.php` | `/admin` | 404 / 301 | Secures former WordPress login requests |

---

## 3. Staging & Preview Defense

- **Vercel Preview Hostname Check**: In `src/components/SEO.jsx`, any request whose hostname matches `*.vercel.app` automatically receives `<meta name="robots" content="noindex, nofollow" />` and Vercel header defense to prevent staging URLs from competing with `shalonasart.ch`.
