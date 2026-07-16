export const contactNumber = "971549957255";
export const contactPhone = "+971549957255";
export const wa = (message) => `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;

export const navItems = [
  ["Concierge", "#concierge"],
  ["Fleet", "#fleet"],
  ["Plans", "#plans"],
  ["HeliDubai", "#helidubai"],
  ["Offers", "#offers"],
  ["Questions", "#faq"]
];

export const fleet = [
  {
    brand: "Porsche",
    model: "911 GT3 RS",
    tone: "Track precision",
    price: "AED 1,899/day",
    features: ["518 HP", "0-100 in 3.2s"],
    stats: ["518 HP", "3.2s", "AED 1,899/day"],
    image: "/media/fleet-porsche-pof.jpg",
    message: "Hello POF Rental, I want to reserve the Porsche 911 GT3 RS in Dubai."
  },
  {
    brand: "Ferrari",
    model: "Purosangue",
    tone: "V12 grand arrival",
    price: "AED 3,399/day",
    features: ["725 HP", "4-seat cabin"],
    stats: ["725 HP", "4 seats", "AED 3,399/day"],
    image: "/media/fleet-purosangue-pof.webp",
    message: "Hello POF Rental, I want to reserve the Ferrari Purosangue in Dubai."
  },
  {
    brand: "Ferrari",
    model: "12 Cilindri",
    tone: "Front-engine theatre",
    price: "AED 3,399/day",
    features: ["830 HP", "0-100 in 2.9s"],
    stats: ["830 HP", "2.9s", "AED 3,399/day"],
    image: "/media/gallery-ferrari12-pof.jpg",
    message: "Hello POF Rental, I want to reserve the Ferrari 12 Cilindri in Dubai."
  },
  {
    brand: "Range Rover",
    model: "Autobiography",
    tone: "Executive calm",
    price: "AED 2,200/day",
    features: ["523 HP", "VIP cabin"],
    stats: ["523 HP", "VIP cabin", "AED 2,200/day"],
    image: "/media/fleet-range-web.webp",
    message: "Hello POF Rental, I want to reserve the Range Rover Autobiography in Dubai."
  },
  {
    brand: "Mercedes-AMG",
    model: "G63",
    tone: "Dubai icon",
    price: "Custom daily rate",
    features: ["577 HP", "850 Nm"],
    stats: ["577 HP", "850Nm", "24/7 delivery"],
    image: "/media/fleet-g63-web.webp",
    message: "Hello POF Rental, I want to reserve the Mercedes-AMG G63 in Dubai."
  }
];

export const galleryRows = [
  {
    label: "Signature performance",
    direction: "rtl",
    items: [
      { ...fleet[0], image: "/media/4.webp" },
      { ...fleet[1], image: "/media/2.webp" },
      { ...fleet[2], image: "/media/fleet-ferrari12-pof-alt.jpg" },
      {
        brand: "POF Edit",
        model: "Grand Touring",
        image: "/media/01 2.webp",
        tone: "Long-line comfort for Dubai routes",
        price: "From AED 1,899/day",
        features: ["Daily access", "Hotel delivery"],
        message: "Hello POF Rental, I want a grand touring rental recommendation in Dubai."
      }
    ]
  },
  {
    label: "Grand touring and utility",
    direction: "ltr",
    items: [
      { ...fleet[3], image: "/media/range-rover-autobiography.webp" },
      { ...fleet[4], image: "/media/10.webp" },
      {
        brand: "Range Rover",
        model: "Executive SUV",
        image: "/media/gallery-range-pof.jpg",
        tone: "Rear-cabin comfort with composed road presence",
        price: "AED 2,200/day",
        features: ["VIP cabin", "523 HP"],
        message: "Hello POF Rental, I want to reserve an executive Range Rover in Dubai."
      }
    ]
  },
  {
    label: "Dubai arrival edit",
    direction: "rtl",
    items: [
      {
        brand: "POF Concierge",
        model: "Evening Delivery",
        image: "/media/01.webp",
        tone: "Prepared after-dark handover",
        price: "Rate by vehicle",
        features: ["24/7 support", "Dubai delivery"],
        message: "Hello POF Rental, I need an evening vehicle delivery in Dubai."
      },
      {
        brand: "POF Concierge",
        model: "City Arrival",
        image: "/media/2 3.webp",
        tone: "A clean arrival for hotel, office, or residence",
        price: "From AED 1,899/day",
        features: ["Flexible timing", "Prepared handover"],
        message: "Hello POF Rental, I want to arrange a luxury car arrival in Dubai."
      },
      {
        brand: "POF Concierge",
        model: "VIP Handover",
        image: "/media/4 3.webp",
        tone: "Private driveway delivery with concierge support",
        price: "Custom itinerary",
        features: ["Private delivery", "Concierge support"],
        message: "Hello POF Rental, I want to arrange a VIP vehicle handover in Dubai."
      }
    ]
  }
];

export const routeSteps = [
  ["01", "Brief", "Tell us the mood, date, duration, and delivery point."],
  ["02", "Match", "We shortlist the car, rate, and handover plan."],
  ["03", "Arrive", "Your vehicle reaches DXB, hotel, residence, or office prepared."]
];

export const plans = [
  ["Weekly", "From AED 2,500/week", "Short trips, business stays, and temporary vehicle placement."],
  ["Monthly", "From AED 8,500/month", "Premium access for residents, founders, and long-stay guests."],
  ["Long-term", "From AED 6,000/month", "Corporate-ready fleet access with clear extensions."]
];

export const faqs = [
  ["What cars can I rent?", "POF Rental offers supercars, sports cars, prestige SUVs, VIP chauffeur vehicles, and Chinese luxury EV or hybrid models."],
  ["Do you deliver to DXB?", "Yes. We support Dubai International Airport delivery, hotel delivery, residence drop-off, and concierge handover."],
  ["Can I rent monthly?", "Yes. Weekly, monthly, and long-term plans are available depending on the vehicle, season, and delivery location."],
  ["Are prices transparent?", "Pricing is confirmed before booking, with clear terms, no hidden fees, and no-deposit options on selected models."],
  ["Do you offer chauffeur service?", "Yes. Chauffeur options are available for executives, VIP guests, events, and private itineraries."]
];
