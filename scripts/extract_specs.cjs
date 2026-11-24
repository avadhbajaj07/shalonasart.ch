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
    
    // Look for Year
    let year = "";
    const yrIdx = html.indexOf(">Year</h2>");
    if (yrIdx !== -1) {
      const yrArea = html.substring(Math.max(0, yrIdx - 400), Math.min(html.length, yrIdx + 400));
      const yrMatch = yrArea.match(/<h2 class="elementor-heading-title[^"]*">\s*(\d{4})\s*<\/h2>/i);
      if (yrMatch) {
        year = yrMatch[1];
      }
    }

    data[slug] = { size, medium, year };
  }
});

console.log(JSON.stringify(data, null, 2));
