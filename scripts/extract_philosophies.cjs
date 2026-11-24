const fs = require("fs");
const path = require("path");

const cacheDir = "./public_html/wp-content/cache/wpo-cache/shalonasart.ch/arts";
if (!fs.existsSync(cacheDir)) {
  console.log("No cache dir found");
  process.exit(1);
}

const entries = fs.readdirSync(cacheDir);
const results = {};

entries.forEach(slug => {
  const htmlPath = path.join(cacheDir, slug, "index.html");
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf8");
    
    // Extract title
    let title = "";
    const titleMatch = html.match(/<h1[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>(.*?)<\/h1>/i) ||
                       html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/&#8211;.*$/, "").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").trim();
    }

    // Extract PHILOSOPHY
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
          .replace(/&quot;/g, '"')
          .replace(/&nbsp;/g, " ")
          .trim();
      }
    }

    // Extract image url
    const imgMatches = html.match(/https?:\/\/[^"'\s]+\/wp-content\/uploads\/[^"'\s]+?\.(?:jpg|jpeg|png|webp)/gi);

    results[slug] = {
      title,
      philosophy,
      images: imgMatches ? Array.from(new Set(imgMatches.filter(i => !i.includes("logo") && !i.includes("elementor") && !i.includes("avatar")))) : []
    };
  }
});

console.log(JSON.stringify(results, null, 2));
