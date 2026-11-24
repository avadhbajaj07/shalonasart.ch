const fs = require("fs");
const path = require("path");

const artworksPath = "./src/data/artworks.js";
let code = fs.readFileSync(artworksPath, "utf8");

// Load extracted philosophies and specs
const listPhil = require("./list_all_phil.cjs");
// Read extracted specs
const specs = JSON.parse(fs.readFileSync("./scripts/extract_specs.json", "utf8", (err, data) => data || "{}") || "{}");

// We can define the comprehensive mapping:
const curatedPhilosophies = {
  "stillness-3": "Continuing the exploration of Stillness—where the soul rests beyond thought and form.",
  "many-worlds": "An exploration of alternate dimensions, where vibrant energy and possibilities intertwine.",
  "waterfall-and-tree-small-version": "A gentle study of nature's living flow and ancient roots intertwining.",
  "soul-presentation": "An intimate unveiling of the inner spirit through light, raw texture and truth.",
  "cacoon": "A sacred space of metamorphosis and quiet protection before the awakening.",
  "prancer": "Playful grace and unbounded spirit dancing through raw texture and color.",
  "the-message": "An unspoken word carried across realms of intuitive consciousness.",
  "susi": "A portrait of warmth, affection and timeless personal connection.",
  "my-own-world": "A sanctuary of quiet dreams and layered reflections known only to the heart.",
  "avatar": "An embodiment of archetypal presence bridging earthly emotion and cosmic stillness.",
  "free-as-a-bird-2": "Uncaged spirit releasing into open air—lightness without boundary.",
  "soft-and-sweet": "An evolving dialogue between tender hues and unfolding quietness.",
  "silent-strength": "Works in progress: building inner resilience through meditative layers.",
  "relaxed-confidence": "An unforced awakening in progress, letting intuition guide every gesture.",
  "vulnerability": "Honoring the raw openness of creation before the surface settles.",
  "dont-speak": "A quiet space where silent thoughts are still finding their voice.",
  "explosive-breakthrough": "An unfolding surge of untamed color and raw creative energy.",
  "untitled-2": "An intuitive visual study exploring the tension between chaos and calm.",
  "untitled": "Raw canvas exploration in an open, undefined state.",
  "free-as-a-bird": "Early stage study capturing the instinctive urge for flight and liberation."
};

// Category overrides to ensure only the 4 official categories
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
