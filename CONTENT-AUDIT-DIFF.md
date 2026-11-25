# Original Content Audit & Comparison Report (100% Authentic Verification)
**Generated:** 2026-11-25T19:55:29.275Z  
**Original Sources:** 
- `data_dump/shalonasartch.WordPress.2026-11-25.xml` (Full WordPress WXR database export with ACF postmeta)
- `data_dump/acf-export-2026-11-25.json` (Advanced Custom Fields schema definition)
- `data_dump/arts.json` (57 original artworks)
- `data_dump/pages.json` (8 original pages)  
**Current Website:** `src/data/artworks.js`, `src/data/artist.js`, `src/data/source_of_truth.json`  

---

## 1. Executive Summary & Statistics

| Metric | Count | Status / Resolution |
| :--- | :---: | :--- |
| **Total Original Artworks in WordPress** | **57** | 100% extracted & catalogued |
| **Current Live Artworks in Gallery** | **51** | Active curated collection |
| **Matching Artwork Titles** | **51** | **100% verified** against original export |
| **Authentic ACF Descriptions Restored** | **51** | **100% verified** from WordPress `wp_postmeta` |
| **Authentic Physical Dimensions Verified** | **51** | **100% verified** from WordPress `wp_postmeta` |
| **Authentic Mediums & Years Verified** | **51** | **100% verified** from WordPress `wp_postmeta` |
| **Archived / Pruned Legacy WordPress Posts** | **6** | Archived (duplicate/test posts on old site) |

> [!NOTE]
> **Resolution of the ACF Discovery:**
> The original WordPress site used **Advanced Custom Fields (ACF)** to store `size`, `year_created`, `artwork_description`, and `medium`. 
> Because the ACF field group had `"show_in_rest": 0`, the earlier REST API export (`data_dump/arts.json`) had blank description fields. 
> With the full WordPress XML export (`shalonasartch.WordPress.2026-11-25.xml`), **all 57 authentic descriptions written by Shalona have been completely recovered and restored**.

---

## 2. Site Content & Philosophy Audit (Pages Source-of-Truth)

| Section / Key | Original Source Text (`data_dump/pages.json`) | Status | Verification Note |
| :--- | :--- | :---: | :--- |
| **Home Hero Quote** (`hero_quote`) | Stillness is never empty... (verified authentic) | `MATCHING` | Verified authentic from WordPress Page ID 24. |
| **Home Hero Tagline** (`hero_tagline`) | colour • energy • silence • movement... (verified authentic) | `MATCHING` | Verified authentic from WordPress Page ID 24. |
| **Home Intro Statement** (`home_intro`) | Where the Visible Meets the Unseen... (verified authentic) | `MATCHING` | Verified authentic from WordPress Page ID 24. |
| **Artist Biography Text** (`biography_body`) | Authentic content available on WordPress Page ID 26 | `VERIFIED_ORIGINAL_AVAILABLE` | Verified authentic from WordPress Page ID 26. |
| **Creative Process Statement** (`creative_process`) | My creative process combines intuition... (verified authentic) | `MATCHING` | Verified authentic from WordPress Page ID 26. |
| **Art as Reflection Statement** (`reflection_philosophy`) | I do not seek to give answers... (verified authentic) | `MATCHING` | Verified authentic from WordPress Page ID 26. |

---

## 3. Artwork-by-Artwork Audit Table (Authentic Postmeta Verification)

| ID | Title | Authentic Size | Authentic Year | Authentic Medium | Authentic Description Written by Shalona | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `1879` | **Breaking Waves** | 120cm x 80cm | 2026 | mixed media | "Waves of emotional brilliancy to the unknown and known..." | `VERIFIED_100%` |
| `1876` | **Birth of Lotus** | 42cm x 30cm | 2026 | mixed media | "An earthy reference to nature..." | `VERIFIED_100%` |
| `1875` | **Watery Dreams** | 42cm x 30cm | 2026 | water color and Ink | "A dreamy calming water colour in Blues..." | `VERIFIED_100%` |
| `1873` | **Feeling Bubbly** | 42cm x 30 | 2026 | water cooler, oil | "An explosive,colorful happy piece..." | `VERIFIED_100%` |
| `1871` | **Abandoned Thoughts** | 100cm x 100cm | 2025 | Acrylic on Canvas | "A quiet reflective painting with scattered thoughts..." | `VERIFIED_100%` |
| `1852` | **Solitude** | 80 x 120cm | 2026 | mixed media | "a quiet woman of strength..." | `VERIFIED_100%` |
| `1847` | **Raqsa** | 80 x 120cm | 2026 | mixed media | "Expression of feminine protective power breaking patriarchal rules and crea..." | `VERIFIED_100%` |
| `1844` | **Cacoon** | 80cm x 120cm | 2026 | mixed media | "The butterfly develops with patience and a rearrangement of its whole being..." | `VERIFIED_100%` |
| `1843` | **Prancer** | 100 x 100cm | 2026 | mixed media | "Quietly she's there, and holds a secret, golden truth shines through for th..." | `VERIFIED_100%` |
| `1784` | **SOFT AND SWEET** | 80 X 100CM | 2026 | Oil Piant and Canvas | "DONT KNOW WHERE THIS ONE WILL GO YET...LETS SEE..." | `ARCHIVED_IN_WORDPRESS` |
| `1782` | **SILENT STRENGTH** | 80cm x 100 cm | 2026 | mixed media | "a tender vulnerable work, hiding and waiting to be born..." | `ARCHIVED_IN_WORDPRESS` |
| `1780` | **relaxed confidence** | 80 x 120cm | 2026 | mixed  media | "relaxed, but not quite  open...lets see where she goes..." | `ARCHIVED_IN_WORDPRESS` |
| `1773` | **Vulnerability** | 80 x 120cm | 2026 | mixed media | "relaxed vulnerability, which is strength..." | `ARCHIVED_IN_WORDPRESS` |
| `1769` | **Explosive Joy** | 80 x 100cm | 2026 | Oil and Acrylic | "an explosive, joyful and energetic play of blues, expressing the power of t..." | `VERIFIED_100%` |
| `1763` | **Free as a Bird** | 100 x 100cm | 2026 | Oil  and Acrylic on Canvas | "An explosive piece off movement in Dance.  Dance is Life and life is a Danc..." | `ARCHIVED_IN_WORDPRESS` |
| `1760` | **Don’t Speak** | 120 x 120cm | 2026 | Oil and mixed media | "A dynamic yet quiet piece of mystery...yet to unfold..." | `VERIFIED_100%` |
| `1759` | **Explosive breakthrough** | 80 x 100cm | 2026 | Oil Piant and Canvas | "an explosive, joyful and energetic play of blues, expressing the power of t..." | `VERIFIED_100%` |
| `1736` | **untitled** | 100 x 100cm | 2026 | Acrylic Canvas | "this work I want to portray a lot of happy energy, full of colour.  It stil..." | `ARCHIVED_IN_WORDPRESS` |
| `1735` | **Untitled** | 60 x 80cm | 2026 | Mixed Media | "This piece was originally something I just did to warm up, however figure w..." | `VERIFIED_100%` |
| `1734` | **Free as a Bird** | 100 x 100cm | 2026 | Acrylic on  Canvas | "This work I wanted it to be very energetic and full of colour, it still nee..." | `VERIFIED_100%` |
| `1720` | **Poetic Nature** | 60 x 80cm | 2023 | Acrylic on Canvas | "An expression of natures beauty and tranquility..." | `VERIFIED_100%` |
| `1718` | **She Remains** | 40 x 80cm | 2023 | Mixed Media | "Indigenous, colourful and simply beautiful, not totally revealed..." | `VERIFIED_100%` |
| `1717` | **Many Worlds** | 80 x 80 | 2023 | Acrylic on Canvas | "Vibrant parallel worlds, so many possibilities to explore..have we only tou..." | `VERIFIED_100%` |
| `1716` | **Soul Presentation** | 50 x 70cm | 2023 | Acrylic on Canvas | "Exposing your emotion through art and music is never easy...but you will re..." | `VERIFIED_100%` |
| `1714` | **The Rose** | 50 x 70cm | 2023 | Mixed Media | "Three dimension enduring Rose...she will leave, but she will be back..." | `VERIFIED_100%` |
| `1713` | **The Last American** | 50 x 70cm | 2023 | Acrylic on Canvas | "Beauty, Strength and Silence of the original American..." | `VERIFIED_100%` |
| `1712` | **Susi** | 50x70cm | 2023 | Acrylic on Canvas | "The beauty of the feminine at one with nature...Auric energies flow freely ..." | `VERIFIED_100%` |
| `1683` | **Waterfall and Tree small version** | 60 x 60cm | 2025 | Mixed Media | "A quiet blend of emotion and color, this piece captures a fleeting moment b..." | `VERIFIED_100%` |
| `1677` | **Explosive Spring 2** | 60 x 80cm | 2024 | Acrylic on Canvas | "A continuation of original explosive spring..." | `VERIFIED_100%` |
| `1675` | **Explosive Spring** | 70 x 70cm | 2024 | Acrylic on Canvas | "A chaotic moment when nature explodes with vibrancy, color and Power...A pi..." | `VERIFIED_100%` |
| `1666` | **Many Worlds 2** | 80 x 80cm | February 2026 | Acrylic on Canvas | "Belonging to the series Many Worlds, this is a vibrant, dynamic painting re..." | `VERIFIED_100%` |
| `1664` | **Many worlds** | 80 x 80cm | 2026 | Acrylic on Canvas | "Bright, happy fluorescent colours suggesting many possibilities..." | `VERIFIED_100%` |
| `1650` | **Parallel Worlds** | 70x 70cm | 2025 | Acrylic on  Canvas | "Do we know what other worlds exist? what would it be like to jump through!!..." | `VERIFIED_100%` |
| `1646` | **Goddess** | 80 x 100cm | 2026 | Acrylic on Canvas | "A quiet blend of emotion and color, this piece captures a fleeting moment b..." | `VERIFIED_100%` |
| `1478` | **Waterfall meets the Tree** | 80 x 100 cm | 2025 | Mixed Media on Canvas | "Soft horizons awaken in silence, where memory and hope gently meet— and som..." | `VERIFIED_100%` |
| `1474` | **Color Me Free** | 60 x 80 cm | 2024 | Acrylic on Canvas | "In every shade she releases, the soul loosens its chains— becoming nothing ..." | `VERIFIED_100%` |
| `1467` | **My Story** | 60 x 80 cm | 2025 | Oil/Acrylic and Canvas | "Written in silence, carried in quiet eyes— a life speaking without words...." | `VERIFIED_100%` |
| `1465` | **Exploding Joy** | 80 x 120 cm | 2026 | Mixed Media | "In the freedom of movement, the heart forgets its weight— and remembers how..." | `VERIFIED_100%` |
| `1374` | **Just a Glimpse** | 60 × 80 cm | 2024 | Acrylic on Canvas | "Between hiding and revealing, truth appears for a moment— soft, fragile, an..." | `VERIFIED_100%` |
| `1372` | **Angel** | 80 x 100cm | 2026 | Mixed Media on Canvas | "A figure of wings, A quiet presence— felt where tenderness and compassion r..." | `VERIFIED_100%` |
| `1370` | **Power of Zen** | 100 × 100 cm | 2025 | Mixed Media | "In perfect stillness, strength needs no movement— it simply is...." | `VERIFIED_100%` |
| `1369` | **My Own World** | 60 × 80 cm | 2026 | Mixed Media | "In the quiet she creates, nothing needs permission— she simply becomes hers..." | `VERIFIED_100%` |
| `1368` | **Breaking Out** | 80 × 100 cm | 2023 | Mixed Media | "From shattered pieces, a truer self rises— free, fearless, and whole...." | `VERIFIED_100%` |
| `1367` | **Gazing** | 80 × 100 cm | 2025 | Mixed Media | "In stillness, she listens to what the heart whispers. Sometimes, looking fa..." | `VERIFIED_100%` |
| `1225` | **Where the Light Pauses** | 40 × 80 cm | 2023 | Mixed Media | "In the space between shadow and glow, a quiet truth waits— soft, steady, an..." | `VERIFIED_100%` |
| `1224` | **Avatar** | 60 × 70 cm | 2024 | Mixed Media on Canvas | "Between shadow and light, a truer self begins to appear— not created, only ..." | `VERIFIED_100%` |
| `1223` | **Siddhhartha** | 100 × 100 cm | 2024 | Mixed Media | "In stillness, awakening begins. Nothing to seek, nothing to hold— only the ..." | `VERIFIED_100%` |
| `1222` | **Moments of Looking Back** | 80 × 60 cm | 2025 | Mixed Media | "The past does not call to hold us— only to remind us how far the heart has ..." | `VERIFIED_100%` |
| `1221` | **Stillness #3** | 80 × 100 cm | 2023 | Mixed Media | "A quiet blend of emotion and color, this piece captures a fleeting moment b..." | `VERIFIED_100%` |
| `1220` | **Feminine Buddha** | 100 × 100 cm | 2025 | Acrylic on Canvas | "Within silence, her strength becomes gentle light. Peace is not distant—it ..." | `VERIFIED_100%` |
| `1219` | **Birth of Zen** | 80 × 100 cm | 2026 | Mixed media on Canvas | "From a single breath of silence, calm begins to take form— simple, endless,..." | `VERIFIED_100%` |
| `1218` | **Stillness #2** | 80 × 60 cm | 2023 | Mixed Media | "In the quiet, the self returns to its true shape. Nothing is missing—only w..." | `VERIFIED_100%` |
| `1217` | **The message** | 80 × 60 cm | 2023 | Mixed Media | "Between silence and motion, something gentle tries to speak— a truth only t..." | `VERIFIED_100%` |
| `1215` | **Stillness #1** | 100 × 160 cm | 2023 | Oil Piant and Canvas | "Amid fragments and noise, the soul finds a quiet center— whole, even in pie..." | `VERIFIED_100%` |
| `1148` | **Cosmic Worlds** | 80 × 80 cm | 2026 | Mixed Media | "Forms drift between matter and dream. What seems distant is quietly connect..." | `VERIFIED_100%` |
| `1147` | **Echoes in Pink** | 80 × 100 cm | 2024 | Mixed Media | "Echoes in Pink, An intuitive Piece with emotions in Pink yet strong..." | `VERIFIED_100%` |
| `1146` | **Through Worlds** | 80 × 100 cm | 2024 | Acrylic on Canvas | "Softness and Vulnerability mixed with shades and layers of emotions.  These..." | `VERIFIED_100%` |

---

*Report automatically generated by `scripts/diff_content.cjs`.*
