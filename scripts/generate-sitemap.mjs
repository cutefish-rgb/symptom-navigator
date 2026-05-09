import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const seoPages = readJson("data/seo-pages.json");
const bodyParts = readJson("data/bodyParts.json");
const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  process.env.DEPLOY_PRIME_URL ??
  "https://your-domain.com"
).replace(/\/$/, "");

const urls = [
  { loc: baseUrl, priority: "1.0" },
  { loc: `${baseUrl}/search`, priority: "0.5" },
  ...bodyParts.map((bodyPart) => ({
    loc: `${baseUrl}/body-part/${bodyPart.slug}`,
    priority: "0.7"
  })),
  ...seoPages.map((page) => ({
    loc: `${baseUrl}/symptom/${page.slug}`,
    priority: "0.9"
  }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "public/sitemap.xml"), sitemap);

console.log("sitemap generated:", seoPages.length);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
