import Script from "next/script";
import "../final.css";

const siteUrl = "https://pupiloffaterentalsdubai.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "POF Rental | Dubai Luxury Car Rental",
    template: "%s | POF Rental"
  },
  description: "POF Rental is a Dubai luxury car rental concierge for supercars, prestige SUVs, chauffeur-ready vehicles, airport delivery, and long-term fleet plans.",
  alternates: { canonical: "/" },
  icons: { icon: "/media/logo.png", shortcut: "/media/logo.png" },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "/",
    siteName: "POF Rental",
    title: "POF Rental | Dubai Luxury Car Rental",
    description: "Private Dubai mobility, from supercar arrivals to prestige SUVs, chauffeur service, and long-term fleet plans.",
    images: [{ url: "/media/arrival-lamborghini-web.webp", width: 1600, height: 1067, alt: "POF Rental Lamborghini arrival in Dubai" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "POF Rental | Dubai Luxury Car Rental",
    description: "Private Dubai mobility, prepared around your arrival.",
    images: ["/media/arrival-lamborghini-web.webp"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#17191c" }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="light" lang="en">
      <body className="interface-redesign cinematic-redesign minimal-premium">
        {children}
        <Script src="/vendor/gsap.min.js?v=3.15.0" strategy="beforeInteractive" />
        <Script src="/vendor/ScrollTrigger.min.js?v=3.15.0" strategy="beforeInteractive" />
        <Script src="/vendor/lenis.min.js?v=1.3.25" strategy="beforeInteractive" />
        <Script src="/app.js?v=20260715-hybrid-v26" strategy="afterInteractive" />
      </body>
    </html>
  );
}
