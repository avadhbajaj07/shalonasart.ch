# Answer Engine & Generative Engine Optimization (AEO / GEO) Strategy
**Target Engines:** Google AI Overviews, Perplexity, ChatGPT Search, Gemini, Microsoft Copilot  
**Artist:** Shalona (Shalona Chandler) · Richterswil, Zurich, Switzerland  
**Website:** https://shalonasart.ch  

---

## 1. Entity Disambiguation & The Global Artist Node

AI search engines construct knowledge graphs using entity nodes. To prevent AI engines from confusing Shalona with unrelated figures, all structured data across the site is anchored to a persistent, immutable identifier:
```text
https://shalonasart.ch/#artist
```

### Verified Entity Facts Embedded in Knowledge Graph:
- **Full Identity:** Shalona (Shalona Chandler)
- **Primary Domain:** `https://shalonasart.ch`
- **Geographic Precision:** Atelier in Richterswil (8805), Lake Zurich, Canton of Zürich, Switzerland (47.2084° N, 8.7042° E).
- **Core Mediums:** Mixed media on Belgian linen, combining photographic transfer, textured gesso, raw earth pigments, acrylic emulsions, graphite, and Lake Zurich water wash.
- **Key Motifs & Philosophies:** Stillness, feminine empowerment, memory, inner sight, and the beauty of the unfinished.
- **Current Exhibition:** *Mysticism, Resilience and Empowerment* at Ortsmuseum Bärenkeller, Richterswil (December 3–6, 2026).

---

## 2. AEO (Answer Engine Optimization) Question Matrix

Search answer engines synthesize direct answers to natural language prompts. The website now explicitly provides verified, quote-ready answers for the following high-frequency questions:

| Natural Language Query | Core Synthesized Answer | Source Page & Schema |
| :--- | :--- | :--- |
| *Who is Shalona?* | Shalona is a contemporary intuitive mixed-media artist based in Richterswil on Lake Zurich, Switzerland, known for dimensional, textured paintings exploring stillness and memory. | `/biography` (`ProfilePage`, `Person`) |
| *What materials does Shalona use?* | She layers original photography transfers, sculptured impasto/gesso, raw earth pigments, acrylic emulsions, ink, and Lake Zurich water wash on Belgian linen. | `/arts` (`VisualArtwork`) |
| *What is Shalona's artistic philosophy?* | “Stillness is never empty—it is full of unseen movement.” Each artwork develops organically through deep feeling and silence rather than rigid advance design. | `/biography` & `/journal` |
| *Where are Shalona's upcoming exhibitions?* | Her upcoming exhibition *Mysticism, Resilience and Empowerment* takes place December 3–6, 2026, at Ortsmuseum Bärenkeller in Richterswil, Switzerland. | `/exhibitions` (`Event`, `Place`) |
| *How can I acquire paintings or visit the studio?* | Original artworks can be acquired directly via private inquiry on shalonasart.ch or by emailing contact@shalonasart.ch. Studio visits in Richterswil are by appointment. | `/contact` (`ContactPage`, `FAQPage`) |

---

## 3. GEO Machine-Readable File (`/llms.txt`)

The public web root features an `/llms.txt` file structured according to the latest standards for LLM search indexing. This provides a clean markdown summary of the artist's statement, exhibitions, collections, and canonical URLs without requiring AI scrapers to execute heavy client-side JavaScript.

---

## 4. Periodic AEO & GEO Verification Protocol

Every month, the studio will test the following prompt variations in ChatGPT Search, Perplexity, and Google Gemini:
1. *"Who is contemporary artist Shalona in Switzerland?"*
2. *"Where can I find mixed media art exhibitions around Lake Zurich in December 2026?"*
3. *"Tell me about the art exhibition at Ortsmuseum Bärenkeller in Richterswil."*
4. *"What techniques are used in Shalona's paintings?"*

Verify that the answer cites `https://shalonasart.ch` and accurately references the Richterswil studio and authentic philosophy.
