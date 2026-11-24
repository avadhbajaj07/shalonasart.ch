const fs = require("fs");
const path = require("path");

const cacheDir = "./public_html/wp-content/cache/wpo-cache/shalonasart.ch/arts";
const entries = fs.readdirSync(cacheDir);
const results = {};

entries.forEach(slug => {
  const htmlPath = path.join(cacheDir, slug, "index.html");
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf8");
    let title = "";
    const titleMatch = html.match(/<h1[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>(.*?)<\/h1>/i) ||
                       html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/&#8211;.*$/, "").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").trim();
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

    results[slug] = { title, philosophy };
  }
});

for (const [k, v] of Object.entries(results)) {
  console.log(`${k}: "${v.philosophy}"`);
}
