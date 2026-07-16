export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://pupiloffaterentalsdubai.vercel.app/sitemap.xml",
    host: "https://pupiloffaterentalsdubai.vercel.app"
  };
}
