import LandingPage from "../components/LandingPage";

export const revalidate = 3600;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  name: "POF Rental",
  url: "https://pupiloffaterentalsdubai.vercel.app/",
  image: "https://pupiloffaterentalsdubai.vercel.app/media/arrival-lamborghini-web.webp",
  email: "info@pofrental.com",
  telephone: "+971549957255",
  areaServed: { "@type": "City", name: "Dubai" },
  description: "Luxury car rental concierge for supercars, prestige SUVs, airport delivery, chauffeur service, and long-term fleet plans in Dubai.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "reservations",
    telephone: "+971549957255",
    availableLanguage: ["English"]
  }
};

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />
      <LandingPage />
    </>
  );
}
