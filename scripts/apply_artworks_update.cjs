const fs = require("fs");

const extracted = require("./extracted_all.json");

const curated = {
  "stillness-3": {
    philosophy: "Continuing the exploration of Stillness—where the soul rests beyond thought and form.",
    year: "2023",
    size: "80 × 100 cm"
  },
  "many-worlds": {
    philosophy: "An exploration of alternate dimensions, where vibrant energy and possibilities intertwine.",
    year: "2023",
    size: "80 × 80 cm"
  },
  "waterfall-and-tree-small-version": {
    philosophy: "A gentle study of nature's living flow and ancient roots intertwining.",
    year: "2025",
    size: "50 × 70 cm"
  },
  "soul-presentation": {
    philosophy: "An intimate unveiling of the inner spirit through light, raw texture and truth.",
    year: "2024",
    size: "80 × 100 cm"
  },
  "cacoon": {
    philosophy: "A sacred space of metamorphosis and quiet protection before the awakening.",
    year: "2024",
    size: "80 × 120 cm"
  },
  "prancer": {
    philosophy: "Playful grace and unbounded spirit dancing through raw texture and color.",
    year: "2024",
    size: "100 × 100 cm"
  },
  "the-message": {
    philosophy: "An unspoken word carried across realms of intuitive consciousness.",
    year: "2024",
    size: "80 × 120 cm"
  },
  "susi": {
    philosophy: "A portrait of warmth, affection and timeless personal connection.",
    year: "2024",
    size: "100 × 70 cm"
  },
  "my-own-world": {
    philosophy: "A sanctuary of quiet dreams and layered reflections known only to the heart.",
    year: "2024",
    size: "80 × 100 cm"
  },
  "avatar": {
    philosophy: "An embodiment of archetypal presence bridging earthly emotion and cosmic stillness.",
    year: "2024",
    size: "80 × 100 cm"
  },
  "free-as-a-bird-2": {
    philosophy: "Uncaged spirit releasing into open air—lightness without boundary.",
    year: "2024",
    size: "80 × 100 cm"
  },
  "soft-and-sweet": {
    philosophy: "An evolving dialogue between tender hues and unfolding quietness.",
    year: "2025",
    size: "70 × 90 cm"
  },
  "silent-strength": {
    philosophy: "Works in progress: building inner resilience through meditative layers.",
    year: "2025",
    size: "80 × 100 cm"
  },
  "relaxed-confidence": {
    philosophy: "An unforced awakening in progress, letting intuition guide every gesture.",
    year: "2025",
    size: "80 × 100 cm"
  },
  "vulnerability": {
    philosophy: "Honoring the raw openness of creation before the surface settles.",
    year: "2025",
    size: "80 × 100 cm"
  },
  "dont-speak": {
    philosophy: "A quiet space where silent thoughts are still finding their voice.",
    year: "2025",
    size: "80 × 100 cm"
  },
  "explosive-breakthrough": {
    philosophy: "An unfolding surge of untamed color and raw creative energy.",
    year: "2025",
    size: "100 × 100 cm"
  },
  "untitled-2": {
    philosophy: "An intuitive visual study exploring the tension between chaos and calm.",
    year: "2025",
    size: "80 × 100 cm"
  },
  "untitled": {
    philosophy: "Raw canvas exploration in an open, undefined state.",
    year: "2025",
    size: "80 × 100 cm"
  },
  "free-as-a-bird": {
    philosophy: "Early stage study capturing the instinctive urge for flight and liberation.",
    year: "2025",
    size: "80 × 100 cm"
  }
};

const categoryOverrides = {
  "abandoned-thoughts": "Abstract",
  "she-remains": "Figurative Abstracts",
  "my-own-world": "Figurative Abstracts",
  "where-the-light-pauses": "Abstract",
  "feminine-buddha": "Figurative Abstracts",
  "echoes-in-pink": "Abstract",
  "birth-of-zen": "Abstract",
  "natures-princess": "Expressions"
};

async function run() {
  const m = await import("../src/data/artworks.js");
  const arts = m.artworks;

  const updatedArts = arts.map(art => {
    const slug = art.slug;
    let phil = "";
    let year = art.year;
    let dims = art.dimensions;
    let med = art.medium;
    let cat = categoryOverrides[slug] || art.category;

    if (extracted[slug]) {
      const ext = extracted[slug];
      if (ext.philosophy) phil = ext.philosophy;
      if (ext.year) year = ext.year;
      if (ext.size) dims = ext.size;
    }

    if (!phil && curated[slug]) {
      phil = curated[slug].philosophy;
      if (curated[slug].year) year = curated[slug].year;
      if (curated[slug].size) dims = curated[slug].size;
    }

    if (!phil) {
      phil = "Original intuitive exploration of form, texture, and silence by Shalona.";
    }

    return {
      ...art,
      category: cat,
      dimensions: dims,
      year: year,
      philosophy: phil,
      caption: phil,
      artist: "Shalona"
    };
  });

  const fileContent = `export const artworks = ${JSON.stringify(updatedArts, null, 2)};\n`;
  fs.writeFileSync("./src/data/artworks.js", fileContent, "utf8");
  console.log(`Successfully updated ${updatedArts.length} artworks in src/data/artworks.js`);
}

run().catch(console.error);
