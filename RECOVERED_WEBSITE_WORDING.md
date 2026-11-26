# Shalona's Art Atelier — Recovered Original Wording & Creative Process Texts

This document compiles all original text passages identified during the investigation regarding **Shalona's creative process**, **artistic techniques**, **how textures are created**, and **references to Lake Zurich (Zürichsee)**.

---

## 1. Primary Match: The Creative Process, Textures & Lake Zurich

> **Key Finding:** This passage directly matches the client's query (*"textures through... mentioning Lake Zurich and all this stuff"*). It explains Shalona's dimensional physical surfaces, materials, and intuitive approach.

### Exact Text:
```text
Shalona works in complex mixed media on Belgian linen. Her process integrates personal photographic transfer layers, sculpted gesso, raw mineral earth pigments, acrylic emulsions, fine graphite, and Lake Zurich water washes, creating dimensional physical surfaces.

Her guiding conviction is that “Stillness is never empty—it is full of unseen movement.” Rather than executing rigid advance sketches, each piece unfolds intuitively through stillness, emotional resonance, and the spontaneous language of color and texture.
```

- **File Location:** `src/components/FAQSection.jsx` (Lines 10–16)
- **Also Found In:** `public/llms.txt` and `AEO-GEO-STRATEGY.md`
- **Status:** Present in codebase; currently live on the Contact Page (`/contact`) within the accordion, but omitted from the Biography page.
- **Commit History:** Introduced in `f64914c` (*"feat: complete master SEO, AEO, GEO, analytics & admin dashboard implementation"*), dated Nov 24, 2026.

---

## 2. Primary Match: The Studio Atmosphere & Biography ("The Lake Zurich Light")

> **Key Finding:** This passage directly addresses the client's remark: *"I just saw my biography, but there was some description you had written of how I do my work in there that was so incredibly fantastic. Um, whatever that was, I would love to have that back if you took it out."*

### Exact Text:
```text
The Lake Zurich Light

In Richterswil, on the quiet shores of Lake Zurich, mornings unfold in stillness. The shifting light across the water enters the studio, illuminating raw linen canvases, vials of organic minerals, and photographic prints waiting to be dissolved and reborn into paint.
```

- **File Location:** `src/components/Biography.jsx` (Lines 112–116)
- **Status:** In the codebase inside `Biography.jsx`. However, `App.jsx` routes `/biography` to `src/pages/BiographyPage.jsx`, where this paragraph was decoupled and replaced with *"In Stillness, Art Awakes"*.
- **Commit History:** Introduced in `f6aa63a` (*"feat: complete Shalona fine art website redesign & portfolio"*), dated Nov 24, 2026.

---

## 3. Historical Biography & Materials Statement (Replaced in Git)

> **Key Finding:** In commit `f26bc8d` (Nov 26, 01:08:06), this custom text was replaced by the raw text from the WordPress database dump (`data_dump/pages.json`). The original version contained specific descriptions of textured gesso, Belgian linen, and Lake Zurich that were stripped during the replacement.

### Exact Text (Original Version):
```text
Lead Statement:
"I am Shalona, an intuitive mixed media artist based in Richterswil on Lake Zurich, Switzerland."

Journey & Materials:
"I am an intuitive artist who worked with a few mentors — that's about it. My journey begins where words fall silent. Rather than following a fixed plan, I let materials interact naturally: photography, pigments, ink, and textured gesso. Every artwork develops its own character, inviting viewers to connect with their personal truths."

Core Pillar 2 — Materials & Mentorship:
"Shaped by guidance from a few valued mentors, combining original photographic emulsion, raw earth pigments, acrylics, and oil glazes on canvas and Belgian linen."
```

- **File Location:** `src/data/artist.js` (Prior to commit `f26bc8d`)
- **Status:** Replaced in Git history on Thu Nov 26 01:08:06 2026.
- **Commit Reference:** `f26bc8de1d09234415d763fcb9b21d48676248e7`

---

## 4. The Dissolving Texture & Lake Water Prose

> **Key Finding:** This poetic prose elaborates on the exact physical interaction between lake water washes, photographic prints, and raw textures.

### Exact Text:
```text
Chapter I — Where Words Fall Silent:
Some mornings in the studio on Lake Zurich, I do not pick up a brush for hours. I sit in the unhurried grey light as it moves across raw gesso. I listen to whatever is underneath the silence.

Starting is not a rational decree—it is a surrender. The mineral pigment arrives before the intention; the feeling precedes the contour. And then the hand responds, setting into motion an encounter that was never planned.

Chapter II — Colour as Memory and Geology:
When I work with lake water washes and photographic transfers, the image begins to break down. The chemical certainty of the photograph dissolves, leaving only a ghost of texture that mingles with raw mineral stone.

To paint is to witness a material lose its boundaries until it begins to speak as atmosphere.
```

- **File Location:** `public/smoke-dissolve.html` (Lines 371–399)
- **Status:** Present in the standalone static presentation file.
- **Commit History:** Introduced in `f6aa63a`, dated Nov 24, 2026.

---

## 5. Homepage Artist Introduction Statement

### Exact Text (English):
```text
a place where memory, emotion, and unseen energy start to move through colour, texture, and form.

I am an intuitive mixed-media artist creating from the quiet space between the visible and the unseen. Now based in Richterswil, Switzerland, my work blends personal photography, unconventional materials, layered textures, and expressive color to explore resilience, transformation, fragility, and hidden strength within the human experience.

Each painting grows through feeling rather than plan, guided by stillness, memory, and the subtle language of color and energy. Rather than offering fixed meanings, my art invites reflection—opening a space where imagination and personal truth can meet, and where every viewer discovers a story of their own.
```

### Exact Text (German Translation):
```text
ein Ort, an dem Erinnerung, Emotion und ungesehene Energie sich durch Farbe, Textur und Form entfalten.

Ich bin eine intuitive Mixed-Media-Künstlerin, die aus dem stillen Raum zwischen dem Sichtbaren und dem Gefühlten schöpft. In Richterswil am Zürichsee verbinde ich Fotografie, unkonventionelle Materialien, geschichtete Texturen und expressive Farben.

Jedes Gemälde wächst aus dem Gefühl statt aus einem starren Plan, geleitet von Stille, Erinnerung und der Sprache von Farbe und Energie. Meine Kunst lädt zur Reflexion ein – ein Raum für persönliche Wahrheit.
```

- **File Location:** `src/context/LanguageContext.jsx` (Lines 26–30 & Lines 84–88)
- **Component:** `src/components/ArtistIntroSection.jsx` (Lines 47–65)
- **Status:** Currently live on the Homepage (`/`) directly below the hero carousel.

---

## 6. Artistic Timeline & Milestone Mediums

### Exact Text:
```text
The Richterswil Atelier & Lake Zurich Studio
Establishment of the dedicated Richterswil atelier on Lake Zurich. Development of the 'Unfinished, Yet Alive' series exploring the threshold where intuitive gestures pause to let the painting breathe.
Key Medium: Oil, Raw Pigments, Lake Water Emulsion

Figurative Abstracts & The Stillness Series
Creation of signature works including 'Stillness #1', 'Stillness #2', 'Stillness #3', and 'Breaking Waves'. Integration of personal photographic emulsions with heavy gesso and raw ochre pigments.
Key Medium: Mixed media, photographic transfer, oil & textured gesso on linen
```

- **File Location:** `src/pages/TimelinePage.jsx` (Lines 10–24)
- **Status:** Currently live on `/timeline`.

---

## 7. Reference: Original WordPress Database Baseline

For historical comparison, here is the text as stored in the original WordPress export (`data_dump/pages.json`, Page ID: 26). Notice that the original WordPress export only stated "Richterswil, Switzerland"; all mentions of "Lake Zurich", "Belgian linen", and specific texture formulations were original wording authored during the redesign:

```text
About Shalona
I am Shalona, a mixed media artist based in Richterswil, Switzerland. My art combines original photography, unconventional materials, and expressive layers of color. Through this creative process, I explore the space between what we see and what we feel.

I create from the quiet space between what is visible and what is felt.
My creative journey begins where words fall silent. Here, memories, emotions, and unseen energy find expression through color, texture, and imagery.

Rather than following a fixed plan, I allow each artwork to develop naturally. I experiment with different materials, observe their interactions, and follow my intuition. As a result, each piece develops its own character and emotional depth.

For me, art represents more than a visual image. It creates a connection between the mystical and the human.
```
