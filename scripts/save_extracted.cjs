const fs = require("fs");
const path = require("path");

const cacheDir = "./public_html/wp-content/cache/wpo-cache/shalonasart.ch/arts";
const files = fs.readdirSync(cacheDir);

const data = {};

files.forEach(slug => {
  const htmlPath = path.join(cacheDir, slug, "index.html");
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf8");
    
    function getValAfterHeading(name) {
      const idx = html.indexOf(`>${name}</h2>`);
      if (idx === -1) return "";
      const sub = html.substring(idx, idx + 600);
      const match = sub.match(/<h2 class="elementor-heading-title[^"]*">\s*([\s\S]*?)\s*<\/h2>/i);
      if (match) {
        return match[1].replace(/<[^>]+>/g, "").trim();
      }
      return "";
    }

    const size = getValAfterHeading("Size");
    const medium = getValAfterHeading("Medium");
    
    let year = "";
    const yrIdx = html.indexOf(">Year</h2>");
    if (yrIdx !== -1) {
      const yrArea = html.substring(Math.max(0, yrIdx - 400), Math.min(html.length, yrIdx + 400));
      const yrMatch = yrArea.match(/<h2 class="elementor-heading-title[^"]*">\s*(\d{4})\s*<\/h2>/i);
      if (yrMatch) {
        year = yrMatch[1];
      }
    }

    let philosophy = "";
    const philIndex = html.indexOf("PHILOSOPHY");
    if (philIndex !== -1) {
      const sub = html.substring(philIndex, philIndex + 1500);
      const textMatch = sub.match(/elementor-widget-text-editor"[^>]*>([\s\S]*?)<\/div>/i);
      if (textMatch) {
        philosophy = textMatch[1]
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&#8217;/g, "'")
          .replace(/&#8211;/g, "–")
          .replace(/&#8212;/g, "—")
          .replace(/&#8230;/g, "...")
          .replace(/&quot;/g, '"')
          .replace(/&nbsp;/g, " ")
          .replace(/\r?\n\s*/g, " ")
          .trim();
      }
    }

    data[slug] = { size, medium, year, philosophy };
  }
});

fs.writeFileSync("./scripts/extracted_all.json", JSON.stringify(data, null, 2));
console.log("Saved extracted_all.json with entries:", Object.keys(data).length);
