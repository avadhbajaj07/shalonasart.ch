# Original Content Audit & Comparison Report
**Generated:** 2026-11-25T19:29:50.898Z  
**Original Source:** `data_dump/arts.json` (57 artworks), `data_dump/pages.json` (8 pages), `data_dump/media.json` (63 assets)  
**Current Website:** `src/data/artworks.js`, `src/data/artist.js`, `src/data/journals.js`  

---

## 1. Executive Summary & Statistics

| Metric | Count | Status / Resolution |
| :--- | :---: | :--- |
| **Total Original Artworks in Dump** | **57** | Source-of-truth baseline |
| **Current Artworks in React Code** | **51** | Pruned to authentic pieces |
| **Matching Artwork Titles** | **51** | Strictly verified against original dump |
| **Changed or Varied Titles** | **0** | Identified for restoration |
| **Missing from Current Site** | **6** | Detailed below |
| **Invented Philosophies / Descriptions** | **47** | **FLAGGED FOR REVIEW** (Original site had no individual artwork text) |
| **Authentic Unfinished Works with Notes** | **4** | 100% matched to original Unfinished Works page |

> [!IMPORTANT]
> **Strict Content Rule Enforced:**
> In the original WordPress site (`data_dump/arts.json`), the `content` and `excerpt` fields for all gallery artworks were **completely empty**. Previous AI rebuilds invented synthetic descriptions (e.g. *"Waves of emotional brilliancy to the unknown and known"*). 
> All invented text has been flagged **`NEEDS_REVIEW`** and will **never** be silently filled with generated text.

---

## 2. Site Content & Philosophy Audit (Pages Source-of-Truth)

| Section / Key | Original Source Text (`data_dump/pages.json`) | Status | Verification Note |
| :--- | :--- | :---: | :--- |
| **Home Hero** (`hero_quote`) | “Stillness is never empty—it is full of unseen movement.” — Shalona... | `MATCHING` | Authentic quote strictly verified from original home page. |
| **Home Hero** (`hero_tagline`) | colour • energy • silence • movement... | `MATCHING` | Authentic subtitle from original WordPress home header. |
| **Home Intro** (`home_intro`) | Where the Visible Meets the Unseen: I am an intuitive mixed-media artist creating from the quiet space where memory, emo... | `MATCHING` | Restored authentic statement. |
| **Artist Biography** (`biography_body`) | The Artist Shalona – Mixed Media Artist in Richterswil, Switzerland. Exploring memory, emotion, and unseen energy throug... | `VERIFIED_ORIGINAL_AVAILABLE` | Complete multi-paragraph authentic text extracted from WordPress biography page (ID: 26). |
| **Creative Process** (`creative_process`) | My creative process combines intuition, experimentation, and thoughtful observation. I begin by exploring my own photogr... | `VERIFIED_ORIGINAL_AVAILABLE` | Authentic text from WordPress biography page. |
| **Art as Reflection** (`reflection_philosophy`) | I do not seek to give answers. Instead, I create opportunities for reflection. Through my art, I invite viewers to conne... | `VERIFIED_ORIGINAL_AVAILABLE` | Authentic text from WordPress biography page. |

---

## 3. Artwork-by-Artwork Audit Table

| ID | Original Title (`arts.json`) | Original Category | Original Image | Current Status | Current Philosophy / Issues |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `1879` | **Breaking Waves** | Abstract | `/wp-content/uploads/2026/11/IMG_1085-scaled.jpg` | `MATCHING` | Invented philosophy detected: "Waves of emotional brilliancy to the unknown and known" (not present in original dump); Unverified dimensions: "120cm x 80cm" (needs client confirmation) |
| `1876` | **Birth of Lotus** | Abstract | `/wp-content/uploads/2026/09/IMG_0228-scaled.jpeg` | `MATCHING` | Invented philosophy detected: "An earthy reference to nature" (not present in original dump); Unverified dimensions: "42cm x 30cm" (needs client confirmation) |
| `1875` | **Watery Dreams** | Abstract | `/wp-content/uploads/2026/09/IMG_0224-scaled.jpeg` | `MATCHING` | Invented philosophy detected: "A dreamy calming water colour in Blues" (not present in original dump); Unverified dimensions: "42cm x 30cm" (needs client confirmation) |
| `1873` | **Feeling Bubbly** | Abstract | `/wp-content/uploads/2026/09/IMG_0704-scaled.jpeg` | `MATCHING` | Invented philosophy detected: "An explosive,colorful happy piece" (not present in original dump); Unverified dimensions: "42cm x 30" (needs client confirmation) |
| `1871` | **Abandoned Thoughts** | Expressions | `/wp-content/uploads/2026/09/IMG_0700-scaled.jpeg` | `MATCHING` | Invented philosophy detected: "A quiet reflective painting with scattered thoughts" (not present in original dump); Unverified dimensions: "100cm x 100cm" (needs client confirmation) |
| `1852` | **Solitude** | Figurative Abstracts | `/wp-content/uploads/2026/04/img_4649.jpg` | `MATCHING` | Invented philosophy detected: "a quiet woman of strength" (not present in original dump); Unverified dimensions: "80 x 120cm" (needs client confirmation) |
| `1847` | **Raqsa** | Figurative Abstracts | `/wp-content/uploads/2026/04/img_4609.jpg` | `MATCHING` | Invented philosophy detected: "Expression of feminine protective power breaking patriarchal rules and creating a positive fresh energy" (not present in original dump); Unverified dimensions: "80 x 120cm" (needs client confirmation) |
| `1844` | **Cacoon** | Figurative Abstracts | `/wp-content/uploads/2026/04/img_4601.jpg` | `MATCHING` | Invented philosophy detected: "A sacred space of metamorphosis and quiet protection before the awakening." (not present in original dump); Unverified dimensions: "80 × 120 cm" (needs client confirmation) |
| `1843` | **Prancer** | Figurative Abstracts | `/wp-content/uploads/2026/03/img_4551.jpg` | `MATCHING` | Invented philosophy detected: "Playful grace and unbounded spirit dancing through raw texture and color." (not present in original dump); Unverified dimensions: "100 × 100 cm" (needs client confirmation) |
| `1784` | **SOFT AND SWEET** | Abstract | `/wp-content/uploads/2026/03/img_4470.jpg` | `MISSING` | Artwork exists in original WordPress export but is missing from current live site. |
| `1782` | **SILENT STRENGTH** | Abstract | `N/A` | `MISSING` | Artwork exists in original WordPress export but is missing from current live site. |
| `1780` | **relaxed confidence** | Abstract | `/wp-content/uploads/2026/03/img_4470.jpg` | `MISSING` | Artwork exists in original WordPress export but is missing from current live site. |
| `1773` | **Vulnerability** | Abstract | `N/A` | `MISSING` | Artwork exists in original WordPress export but is missing from current live site. |
| `1769` | **Explosive Joy** | Figurative Abstracts | `/wp-content/uploads/2026/03/img_4179.jpg` | `MATCHING` | Invented philosophy detected: "an explosive, joyful and energetic play of blues, expressing the power of the feminine." (not present in original dump); Unverified dimensions: "80 x 100cm" (needs client confirmation) |
| `1763` | **Free as a Bird** | Figurative Abstracts | `/wp-content/uploads/2026/03/img_4145.jpg` | `MISSING` | Artwork exists in original WordPress export but is missing from current live site. |
| `1760` | **Don’t Speak** | Abstract | `/wp-content/uploads/2026/03/img_4156.jpg` | `MATCHING` | Authentic Match |
| `1759` | **Explosive breakthrough** | Abstract | `N/A` | `MATCHING` | Authentic Match |
| `1736` | **untitled** | Abstract | `N/A` | `MISSING` | Artwork exists in original WordPress export but is missing from current live site. |
| `1735` | **Untitled** | Abstract | `/wp-content/uploads/2026/02/img_4110.jpg` | `MATCHING` | Authentic Match |
| `1734` | **Free as a Bird** | Abstract | `N/A` | `MATCHING` | Authentic Match |
| `1720` | **Poetic Nature** | Expressions | `/wp-content/uploads/2026/02/389b4755-c48e-4a3a-ae0f-9069f5d3e46d.jpg` | `MATCHING` | Invented philosophy detected: "An expression of natures beauty and tranquility" (not present in original dump); Unverified dimensions: "60 x 80cm" (needs client confirmation) |
| `1718` | **She Remains** | Expressions | `/wp-content/uploads/2026/02/img_2599.jpg` | `MATCHING` | Invented philosophy detected: "Indigenous, colourful and simply beautiful, not totally revealed" (not present in original dump); Unverified dimensions: "40 x 80cm" (needs client confirmation) |
| `1717` | **Many Worlds** | Abstract | `/wp-content/uploads/2026/02/img_4067-1.jpg` | `MATCHING` | Invented philosophy detected: "Vibrant parallel worlds, so many possibilities to explore..have we only touched the serface" (not present in original dump); Unverified dimensions: "80 x 80" (needs client confirmation) |
| `1716` | **Soul Presentation** | Figurative Abstracts | `N/A` | `MATCHING` | Invented philosophy detected: "An intimate unveiling of the inner spirit through light, raw texture and truth." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1714` | **The Rose** | Abstract | `/wp-content/uploads/2026/02/img_1017.jpg` | `MATCHING` | Invented philosophy detected: "Three dimension enduring Rose...she will leave, but she will be back" (not present in original dump); Unverified dimensions: "50 x 70cm" (needs client confirmation) |
| `1713` | **The Last American** | Expressions | `/wp-content/uploads/2026/02/img_4098-1.jpg` | `MATCHING` | Invented philosophy detected: "Beauty, Strength and Silence of the original American" (not present in original dump); Unverified dimensions: "50 x 70cm" (needs client confirmation) |
| `1712` | **Susi** | Figurative Abstracts | `/wp-content/uploads/2026/02/img_0957.jpg` | `MATCHING` | Invented philosophy detected: "A portrait of warmth, affection and timeless personal connection." (not present in original dump); Unverified dimensions: "100 × 70 cm" (needs client confirmation) |
| `1683` | **Waterfall and Tree small version** | Abstract | `N/A` | `MATCHING` | Invented philosophy detected: "A gentle study of nature's living flow and ancient roots intertwining." (not present in original dump); Unverified dimensions: "50 × 70 cm" (needs client confirmation) |
| `1677` | **Explosive Spring 2** | Abstract | `/wp-content/uploads/2026/02/img_4069.jpg` | `MATCHING` | Invented philosophy detected: "A continuation of original explosive spring" (not present in original dump); Unverified dimensions: "60 x 80cm" (needs client confirmation) |
| `1675` | **Explosive Spring** | Abstract | `/wp-content/uploads/2026/02/img_4068.jpg` | `MATCHING` | Invented philosophy detected: "A chaotic moment when nature explodes with vibrancy, color and Power...A piece that makes you feel alive!" (not present in original dump); Unverified dimensions: "70 x 70cm" (needs client confirmation) |
| `1666` | **Many Worlds 2** | Abstract | `/wp-content/uploads/2026/02/img_4073.jpg` | `MATCHING` | Invented philosophy detected: "Belonging to the series Many Worlds, this is a vibrant, dynamic painting representing other perspectives" (not present in original dump); Unverified dimensions: "80 x 80cm" (needs client confirmation) |
| `1664` | **Many worlds** | Abstract | `N/A` | `MATCHING` | Invented philosophy detected: "An exploration of alternate dimensions, where vibrant energy and possibilities intertwine." (not present in original dump); Unverified dimensions: "80 × 80 cm" (needs client confirmation) |
| `1650` | **Parallel Worlds** | Abstract | `/wp-content/uploads/2026/02/img_4070.jpg` | `MATCHING` | Invented philosophy detected: "Do we know what other worlds exist? what would it be like to jump through!!!!!!!!!" (not present in original dump); Unverified dimensions: "70x 70cm" (needs client confirmation) |
| `1646` | **Goddess** | Figurative Abstracts | `/wp-content/uploads/2026/02/img-20260221-wa00703249739477377347948.jpg` | `MATCHING` | Invented philosophy detected: "A quiet blend of emotion and color, this piece captures a fleeting moment between chaos and calm. Soft textures and bold strokes come together to express inner movement and silent strength. Inspired by nature and human connection, this artwork reflects harmony in contrast." (not present in original dump); Unverified dimensions: "80 x 100cm" (needs client confirmation) |
| `1478` | **Waterfall meets the Tree** | Abstract | `/wp-content/uploads/2026/02/shalonasartist1.jpeg` | `MATCHING` | Invented philosophy detected: "Soft horizons awaken in silence, where memory and hope gently meet— and something new begins to breathe." (not present in original dump); Unverified dimensions: "80 x 100 cm" (needs client confirmation) |
| `1474` | **Color Me Free** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasartist2.jpeg` | `MATCHING` | Invented philosophy detected: "In every shade she releases, the soul loosens its chains— becoming nothing but light and movement." (not present in original dump); Unverified dimensions: "60 x 80 cm" (needs client confirmation) |
| `1467` | **My Story** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart0s2.jpeg` | `MATCHING` | Invented philosophy detected: "Written in silence, carried in quiet eyes— a life speaking without words." (not present in original dump); Unverified dimensions: "60 x 80 cm" (needs client confirmation) |
| `1465` | **Exploding Joy** | Figurative Abstracts | `/wp-content/uploads/2026/03/img_4160.jpg` | `MATCHING` | Invented philosophy detected: "In the freedom of movement, the heart forgets its weight— and remembers how to fly." (not present in original dump); Unverified dimensions: "80 x 120 cm" (needs client confirmation) |
| `1374` | **Just a Glimpse** | Expressions | `/wp-content/uploads/2026/02/shalona.jpeg` | `MATCHING` | Invented philosophy detected: "Between hiding and revealing, truth appears for a moment— soft, fragile, and real." (not present in original dump); Unverified dimensions: "60 × 80 cm" (needs client confirmation) |
| `1372` | **Angel** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalona-art.jpeg` | `MATCHING` | Invented philosophy detected: "A figure of wings, A quiet presence— felt where tenderness and compassion remains." (not present in original dump); Unverified dimensions: "80 x 100cm" (needs client confirmation) |
| `1370` | **Power of Zen** | Abstract | `/wp-content/uploads/2026/02/shalonas-art.jpeg` | `MATCHING` | Invented philosophy detected: "In perfect stillness, strength needs no movement— it simply is." (not present in original dump); Unverified dimensions: "100 × 100 cm" (needs client confirmation) |
| `1369` | **My Own World** | Expressions | `/wp-content/uploads/2026/02/shalonasart014.jpeg` | `MATCHING` | Invented philosophy detected: "A sanctuary of quiet dreams and layered reflections known only to the heart." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1368` | **Breaking Out** | Expressions | `/wp-content/uploads/2026/02/shalonasart015.jpeg` | `MATCHING` | Invented philosophy detected: "From shattered pieces, a truer self rises— free, fearless, and whole." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1367` | **Gazing** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart09.jpeg` | `MATCHING` | Invented philosophy detected: "In stillness, she listens to what the heart whispers. Sometimes, looking far away is the only way to find yourself." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1225` | **Where the Light Pauses** | Expressions | `/wp-content/uploads/2026/02/shalonasart010.jpeg` | `MATCHING` | Invented philosophy detected: "In the space between shadow and glow, a quiet truth waits— soft, steady, and unseen." (not present in original dump); Unverified dimensions: "40 × 80 cm" (needs client confirmation) |
| `1224` | **Avatar** | Expressions | `/wp-content/uploads/2026/02/shalonasart012.jpeg` | `MATCHING` | Invented philosophy detected: "An embodiment of archetypal presence bridging earthly emotion and cosmic stillness." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1223` | **Siddhhartha** | Expressions | `/wp-content/uploads/2026/02/shalonasart016.jpeg` | `MATCHING` | Invented philosophy detected: "In stillness, awakening begins. Nothing to seek, nothing to hold— only the quiet truth of being." (not present in original dump); Unverified dimensions: "100 × 100 cm" (needs client confirmation) |
| `1222` | **Moments of Looking Back** | Expressions | `/wp-content/uploads/2026/02/shalonasart013.jpeg` | `MATCHING` | Invented philosophy detected: "The past does not call to hold us— only to remind us how far the heart has traveled." (not present in original dump); Unverified dimensions: "80 × 60 cm" (needs client confirmation) |
| `1221` | **Stillness #3** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart011.jpeg` | `MATCHING` | Invented philosophy detected: "Continuing the exploration of Stillness—where the soul rests beyond thought and form." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1220` | **Feminine Buddha** | Expressions | `/wp-content/uploads/2026/02/shalonasart08.jpeg` | `MATCHING` | Invented philosophy detected: "Within silence, her strength becomes gentle light. Peace is not distant—it is already resting inside." (not present in original dump); Unverified dimensions: "100 × 100 cm" (needs client confirmation) |
| `1219` | **Birth of Zen** | Abstract | `/wp-content/uploads/2026/02/shalonasart07.jpeg` | `MATCHING` | Invented philosophy detected: "From a single breath of silence, calm begins to take form— simple, endless, whole." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1218` | **Stillness #2** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart04.jpeg` | `MATCHING` | Invented philosophy detected: "In the quiet, the self returns to its true shape. Nothing is missing—only waiting to be felt." (not present in original dump); Unverified dimensions: "80 × 60 cm" (needs client confirmation) |
| `1217` | **The message** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart03.jpeg` | `MATCHING` | Invented philosophy detected: "An unspoken word carried across realms of intuitive consciousness." (not present in original dump); Unverified dimensions: "80 × 120 cm" (needs client confirmation) |
| `1215` | **Stillness #1** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart02.jpeg` | `MATCHING` | Invented philosophy detected: "Amid fragments and noise, the soul finds a quiet center— whole, even in pieces." (not present in original dump); Unverified dimensions: "100 × 160 cm" (needs client confirmation) |
| `1148` | **Cosmic Worlds** | Abstract | `/wp-content/uploads/2026/02/shalonasart06.jpeg` | `MATCHING` | Invented philosophy detected: "Forms drift between matter and dream. What seems distant is quietly connected— the universe turning within itself." (not present in original dump); Unverified dimensions: "80 × 80 cm" (needs client confirmation) |
| `1147` | **Echoes in Pink** | Expressions | `/wp-content/uploads/2026/02/shalonasart05.jpeg` | `MATCHING` | Invented philosophy detected: "Echoes in Pink, An intuitive Piece with emotions in Pink yet strong" (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |
| `1146` | **Through Worlds** | Figurative Abstracts | `/wp-content/uploads/2026/02/shalonasart01.jpeg` | `MATCHING` | Invented philosophy detected: "Softness and Vulnerability mixed with shades and layers of emotions.  These complex emotional states are within all of us.  To honestly look them requires courage, patience and self love, but the reward is well worth it....one is left with a state of true serenity and strength that cannot be threatened." (not present in original dump); Unverified dimensions: "80 × 100 cm" (needs client confirmation) |

---

## 4. Source of Truth Restoration Action Plan

1. **Restore Exact Original Titles**:
   - Revert any title discrepancies directly to `originalArts[i].title.rendered`.
2. **Remove All Invented Artwork Descriptions**:
   - Set description to `null` or leave for client review. Mark status as `needs_review`.
3. **Preserve Authentic Unfinished Notes**:
   - The 4 Unfinished Works keep their exact authentic 2026 notes from page 1084.
4. **Enforce Database Source of Truth**:
   - Store all items in `src/data/source_of_truth.json` with `verification_status`, `source`, and `is_locked` flags.
