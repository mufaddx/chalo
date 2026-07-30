import type { Agency, Destination, Tour, TourCategory } from "@/types";

// Real, verified travel photos (checked to actually load) mapped by
// destination keyword, so every seed used below resolves to a genuine
// photo of that place instead of an arbitrary random stock image.
const DESTINATION_PHOTOS: Record<string, string> = {
  ladakh: "https://images.unsplash.com/photo-1619837374214-f5b9eb80876d",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
  kerala: "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8",
  rajasthan: "https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3",
  bali: "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
  santorini: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
  swiss: "https://images.unsplash.com/photo-1586752488885-6ce47fdfd874",
  alps: "https://images.unsplash.com/photo-1586752488885-6ce47fdfd874",
  vietnam: "https://images.unsplash.com/photo-1748102289186-f27325fbdc7b",
};

const VISA_PHOTO = "https://images.unsplash.com/photo-1586441133374-ed1cb4007a47";
const GENERIC_TRAVEL_PHOTO = "https://images.unsplash.com/photo-1543797414-a0c3ad076f7c";

// Agency logo/cover seeds are abbreviations (hae/sun/bwt/mer/rrt), not
// destination names, so they're mapped to whichever destination that
// agency is themed around; Meridian is a general international agency
// with no fixed destination, so it gets a generic travel photo instead.
const AGENCY_PHOTOS: Record<string, string> = {
  hae: DESTINATION_PHOTOS.ladakh,
  sun: DESTINATION_PHOTOS.goa,
  bwt: DESTINATION_PHOTOS.kerala,
  rrt: DESTINATION_PHOTOS.rajasthan,
  mer: GENERIC_TRAVEL_PHOTO,
};

function photoFor(seed: string): string {
  const lower = seed.toLowerCase();

  if (lower.includes("visa")) return VISA_PHOTO;

  for (const [key, url] of Object.entries(DESTINATION_PHOTOS)) {
    if (lower.includes(key)) return url;
  }

  if (lower.startsWith("logo-") || lower.startsWith("cover-")) {
    const code = lower.split("-")[1];
    if (code && AGENCY_PHOTOS[code]) return AGENCY_PHOTOS[code];
  }

  return GENERIC_TRAVEL_PHOTO;
}

const img = (seed: string, w = 1200, h = 800) =>
  `${photoFor(seed)}?fm=jpg&q=75&w=${w}&h=${h}&fit=crop&auto=format`;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories: { label: TourCategory | string; icon: string; slug: string }[] = [
  { label: "Domestic", icon: "MapPin", slug: "domestic" },
  { label: "International", icon: "Globe2", slug: "international" },
  { label: "Adventure", icon: "MountainSnow", slug: "adventure" },
  { label: "Family", icon: "Users", slug: "family" },
  { label: "Solo", icon: "UserRound", slug: "solo" },
  { label: "Honeymoon", icon: "Heart", slug: "honeymoon" },
  { label: "Luxury", icon: "Gem", slug: "luxury" },
  { label: "Budget", icon: "Wallet", slug: "budget" },
  { label: "Wildlife", icon: "PawPrint", slug: "wildlife" },
  { label: "Hill Station", icon: "Trees", slug: "hill-station" },
  { label: "Beach", icon: "Waves", slug: "beach" },
  { label: "Weekend Trips", icon: "CalendarDays", slug: "weekend" },
  { label: "Cruise", icon: "Ship", slug: "cruise" },
  { label: "Road Trip", icon: "Car", slug: "road-trip" },
];

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------
export const destinations: Destination[] = [
  { name: "Ladakh", country: "India", image: img("ladakh-01"), tourCount: 42, coordinates: "34.15°N, 77.58°E" },
  { name: "Goa", country: "India", image: img("goa-02"), tourCount: 68, coordinates: "15.29°N, 74.12°E" },
  { name: "Kerala Backwaters", country: "India", image: img("kerala-03"), tourCount: 51, coordinates: "9.49°N, 76.33°E" },
  { name: "Bali", country: "Indonesia", image: img("bali-04"), tourCount: 37, coordinates: "8.34°S, 115.09°E" },
  { name: "Santorini", country: "Greece", image: img("santorini-05"), tourCount: 19, coordinates: "36.39°N, 25.46°E" },
  { name: "Swiss Alps", country: "Switzerland", image: img("alps-06"), tourCount: 24, coordinates: "46.55°N, 7.98°E" },
  { name: "Rajasthan", country: "India", image: img("rajasthan-07"), tourCount: 63, coordinates: "26.91°N, 75.79°E" },
  { name: "Vietnam", country: "Vietnam", image: img("vietnam-08"), tourCount: 28, coordinates: "14.06°N, 108.28°E" },
];

// ---------------------------------------------------------------------------
// Agencies
// ---------------------------------------------------------------------------
export const agencies: Agency[] = [
  {
    slug: "highaltitude-expeditions",
    name: "High Altitude Expeditions",
    logo: img("logo-hae", 200, 200),
    cover: img("cover-hae", 1600, 500),
    verified: true,
    yearsExperience: 14,
    totalTours: 46,
    completedTours: 3120,
    rating: 4.8,
    reviewCount: 612,
    city: "Leh, Ladakh",
    about:
      "High Altitude Expeditions has run small-group treks and road trips across the Himalayas since 2011. Every guide is a certified mountaineer, and every group is capped at 12 travellers so no one gets left staring at the back of someone's rucksack.",
    phone: "+91 98765 43210",
    email: "hello@highaltitudeexpeditions.in",
    website: "highaltitudeexpeditions.in",
  },
  {
    slug: "sunseeker-holidays",
    name: "Sunseeker Holidays",
    logo: img("logo-sun", 200, 200),
    cover: img("cover-sun", 1600, 500),
    verified: true,
    yearsExperience: 9,
    totalTours: 61,
    completedTours: 5480,
    rating: 4.6,
    reviewCount: 894,
    city: "Panjim, Goa",
    about:
      "Sunseeker runs beach-first getaways across Goa and coastal Karnataka. Their villas and boutique stays are hand-inspected twice a year, and they were among the first agencies on the platform to offer free cancellation as standard.",
    phone: "+91 98220 11223",
    email: "care@sunseekerholidays.com",
    website: "sunseekerholidays.com",
  },
  {
    slug: "backwater-trails",
    name: "Backwater Trails",
    logo: img("logo-bwt", 200, 200),
    cover: img("cover-bwt", 1600, 500),
    verified: true,
    yearsExperience: 11,
    totalTours: 33,
    completedTours: 2870,
    rating: 4.9,
    reviewCount: 501,
    city: "Alleppey, Kerala",
    about:
      "A family-run operator that has owned and maintained its own houseboat fleet since 2014. Backwater Trails is the highest-rated agency on the platform for Kerala, largely because they never overbook a boat past its licensed capacity.",
    phone: "+91 94470 55678",
    email: "reservations@backwatertrails.in",
    website: "backwatertrails.in",
  },
  {
    slug: "meridian-getaways",
    name: "Meridian Getaways",
    logo: img("logo-mer", 200, 200),
    cover: img("cover-mer", 1600, 500),
    verified: true,
    yearsExperience: 17,
    totalTours: 84,
    completedTours: 9110,
    rating: 4.7,
    reviewCount: 1443,
    city: "Mumbai, Maharashtra",
    about:
      "Meridian is a full-service international outbound agency with local partner offices in 22 countries. They specialise in visa-inclusive packages, so the price you see is very close to the price you pay at checkout.",
    phone: "+91 22 4011 8899",
    email: "support@meridiangetaways.com",
    website: "meridiangetaways.com",
  },
  {
    slug: "royal-rajasthan-tours",
    name: "Royal Rajasthan Tours",
    logo: img("logo-rrt", 200, 200),
    cover: img("cover-rrt", 1600, 500),
    verified: true,
    yearsExperience: 22,
    totalTours: 58,
    completedTours: 7650,
    rating: 4.8,
    reviewCount: 1102,
    city: "Jaipur, Rajasthan",
    about:
      "Royal Rajasthan Tours has been putting together heritage-hotel circuits since 2002, with direct relationships with palace properties that most agencies can only book through a reseller.",
    phone: "+91 141 402 5567",
    email: "bookings@royalrajasthantours.com",
    website: "royalrajasthantours.com",
  },
];

// ---------------------------------------------------------------------------
// Tours
// ---------------------------------------------------------------------------
export const tours: Tour[] = [
  {
    slug: "ladakh-monasteries-and-passes",
    title: "Ladakh: Monasteries & High Mountain Passes",
    destination: "Ladakh",
    country: "India",
    image: img("tour-ladakh-1"),
    gallery: [img("tour-ladakh-1"), img("tour-ladakh-2"), img("tour-ladakh-3"), img("tour-ladakh-4"), img("tour-ladakh-5")],
    agency: agencies[0],
    category: ["Adventure", "Domestic"],
    price: 34999,
    originalPrice: 42999,
    duration: "6N / 7D",
    nights: 6,
    days: 7,
    transport: ["Flight", "Cab"],
    hotelRating: 3,
    mealsIncluded: true,
    freeCancellation: true,
    instantConfirmation: false,
    rating: 4.8,
    reviewCount: 214,
    seatsLeft: 4,
    nextDepartures: ["12 Aug 2026", "19 Aug 2026", "02 Sep 2026"],
    featured: true,
    trending: true,
    highlights: [
      "Cross Khardung La, one of the world's highest motorable passes",
      "Overnight stay beside Pangong Tso",
      "Guided monastery circuit: Thiksey, Hemis and Diskit",
      "Small group, capped at 12 travellers",
    ],
    inclusions: [
      "6 nights accommodation (hotel + 1 night camp)",
      "Daily breakfast and dinner",
      "Private oxygen cylinder on board",
      "Inner line permits for restricted areas",
      "All transfers in a private Innova/Xylo",
    ],
    exclusions: ["Airfare to Leh", "Lunches", "Personal expenses", "Travel insurance"],
    thingsToCarry: ["Warm layered clothing", "Sunscreen SPF 50+", "Personal medication", "Power bank"],
    itinerary: [
      { day: 1, title: "Arrive in Leh, acclimatisation", description: "Land in Leh and spend the day at low altitude to acclimatise. Short evening walk to the main market.", meals: ["Dinner"], stay: "Hotel in Leh" },
      { day: 2, title: "Leh local monasteries", description: "Visit Shanti Stupa, Hemis and Thiksey monasteries. Easy day to continue acclimatising.", meals: ["Breakfast", "Dinner"], stay: "Hotel in Leh" },
      { day: 3, title: "Leh to Nubra Valley via Khardung La", description: "Cross Khardung La (17,982 ft) and descend into the Nubra Valley. Evening camel safari on the sand dunes at Hunder.", meals: ["Breakfast", "Dinner"], stay: "Camp in Nubra" },
      { day: 4, title: "Nubra to Pangong Tso", description: "Drive via Shyok route to Pangong Lake. Free evening to watch the lake change colour at sunset.", meals: ["Breakfast", "Dinner"], stay: "Camp at Pangong" },
      { day: 5, title: "Pangong to Leh", description: "Return to Leh via Chang La. Rest evening in the market.", meals: ["Breakfast", "Dinner"], stay: "Hotel in Leh" },
      { day: 6, title: "Buffer / Magnetic Hill & Sangam", description: "Visit Magnetic Hill, the Sangam of Indus and Zanskar rivers, and Hall of Fame museum.", meals: ["Breakfast", "Dinner"], stay: "Hotel in Leh" },
      { day: 7, title: "Departure", description: "Transfer to Leh airport for your onward flight.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Ankit Verma", rating: 5, date: "14 Jun 2026", text: "The guide knew exactly when to push on and when to let us rest at altitude. Never felt unsafe, even on the Khardung La crossing.", images: [img("rev-ladakh-1", 400, 300)] },
      { id: "r2", author: "Priya Nair", rating: 4, date: "02 Jun 2026", text: "Pangong campsite was cold but the sleeping bags provided were genuinely warm. Would have liked one more buffer day.", agencyReply: "Thanks Priya — we've since added an optional extra night at Pangong for exactly this reason." },
    ],
  },
  {
    slug: "goa-beach-and-heritage-escape",
    title: "Goa Beach & Portuguese Heritage Escape",
    destination: "Goa",
    country: "India",
    image: img("tour-goa-1"),
    gallery: [img("tour-goa-1"), img("tour-goa-2"), img("tour-goa-3"), img("tour-goa-4")],
    agency: agencies[1],
    category: ["Beach", "Family", "Weekend Trips"],
    price: 12499,
    originalPrice: 15999,
    duration: "3N / 4D",
    nights: 3,
    days: 4,
    transport: ["Flight", "Cab"],
    hotelRating: 4,
    mealsIncluded: true,
    freeCancellation: true,
    instantConfirmation: true,
    rating: 4.6,
    reviewCount: 388,
    seatsLeft: 11,
    nextDepartures: ["05 Aug 2026", "08 Aug 2026", "15 Aug 2026", "22 Aug 2026"],
    featured: true,
    trending: true,
    highlights: [
      "Beachfront 4-star resort in North Goa",
      "Sunset cruise on the Mandovi river",
      "Old Goa heritage walk: Basilica of Bom Jesus & Se Cathedral",
      "Free cancellation up to 48 hours before departure",
    ],
    inclusions: ["3 nights beachfront resort", "Daily breakfast", "Airport transfers", "Sunset river cruise", "Heritage walking tour"],
    exclusions: ["Airfare", "Lunch and dinner (except Day 2)", "Water sports", "Alcoholic beverages"],
    thingsToCarry: ["Light cottons", "Sunglasses", "Reef-safe sunscreen"],
    itinerary: [
      { day: 1, title: "Arrival & beach evening", description: "Check in, free evening at Candolim beach.", meals: ["Breakfast"], stay: "Beachfront resort" },
      { day: 2, title: "Old Goa heritage walk + cruise", description: "Morning heritage walk through Old Goa's UNESCO churches, evening Mandovi sunset cruise with live music.", meals: ["Breakfast", "Dinner"], stay: "Beachfront resort" },
      { day: 3, title: "Leisure day", description: "Full free day — optional water sports or spice plantation visit at your own cost.", meals: ["Breakfast"], stay: "Beachfront resort" },
      { day: 4, title: "Departure", description: "Check out and transfer to Goa airport.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Rohit Shah", rating: 5, date: "20 Jul 2026", text: "Resort was right on the beach, exactly as pictured. The river cruise was the highlight — great value for a short trip." },
      { id: "r2", author: "Neha Kapoor", rating: 4, date: "11 Jul 2026", text: "Good package overall, just wish dinner was included on more nights." },
    ],
  },
  {
    slug: "kerala-houseboat-and-hills",
    title: "Kerala Houseboat & Spice Hills",
    destination: "Kerala Backwaters",
    country: "India",
    image: img("tour-kerala-1"),
    gallery: [img("tour-kerala-1"), img("tour-kerala-2"), img("tour-kerala-3"), img("tour-kerala-4")],
    agency: agencies[2],
    category: ["Honeymoon", "Family"],
    price: 21999,
    originalPrice: 26499,
    duration: "4N / 5D",
    nights: 4,
    days: 5,
    transport: ["Flight", "Cab"],
    hotelRating: 4,
    mealsIncluded: true,
    freeCancellation: true,
    instantConfirmation: true,
    rating: 4.9,
    reviewCount: 276,
    seatsLeft: 7,
    nextDepartures: ["09 Aug 2026", "23 Aug 2026"],
    featured: true,
    highlights: [
      "Private houseboat overnight stay in Alleppey",
      "Tea garden walk in Munnar",
      "Spice plantation tour in Thekkady",
      "All meals cooked fresh on board the houseboat",
    ],
    inclusions: ["1 night private houseboat (all meals)", "3 nights hill resort", "All transfers", "Spice plantation entry"],
    exclusions: ["Airfare", "Ayurvedic spa treatments", "Boat rides at Periyar lake"],
    thingsToCarry: ["Light rain jacket", "Comfortable walking shoes", "Insect repellent"],
    itinerary: [
      { day: 1, title: "Arrive Kochi, drive to Munnar", description: "Scenic drive up through tea estates, check into hill resort.", meals: ["Dinner"], stay: "Munnar hill resort" },
      { day: 2, title: "Munnar tea gardens", description: "Visit Tea Museum, Mattupetty Dam, and Eravikulam National Park.", meals: ["Breakfast", "Dinner"], stay: "Munnar hill resort" },
      { day: 3, title: "Munnar to Thekkady", description: "Drive to Thekkady, evening spice plantation walk.", meals: ["Breakfast", "Dinner"], stay: "Thekkady resort" },
      { day: 4, title: "Thekkady to Alleppey houseboat", description: "Drive to Alleppey, board your private houseboat for an overnight backwater cruise.", meals: ["Breakfast", "Lunch", "Dinner"], stay: "Private houseboat" },
      { day: 5, title: "Disembark & departure", description: "Morning cruise back to the jetty, transfer to Kochi airport.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Sana & Imran", rating: 5, date: "30 Jun 2026", text: "The houseboat food alone was worth the trip. Crew was warm and the boat was spotless." },
      { id: "r2", author: "Devika Menon", rating: 5, date: "18 Jun 2026", text: "Booked this for our anniversary — Backwater Trails upgraded our boat's deck room without us asking." },
    ],
  },
  {
    slug: "bali-island-hopping",
    title: "Bali Island Hopping: Ubud to Nusa Penida",
    destination: "Bali",
    country: "Indonesia",
    image: img("tour-bali-1"),
    gallery: [img("tour-bali-1"), img("tour-bali-2"), img("tour-bali-3"), img("tour-bali-4")],
    agency: agencies[3],
    category: ["International", "Honeymoon", "Beach"],
    price: 68999,
    originalPrice: 79999,
    duration: "6N / 7D",
    nights: 6,
    days: 7,
    transport: ["Flight", "Cab"],
    hotelRating: 4,
    mealsIncluded: true,
    freeCancellation: false,
    instantConfirmation: true,
    rating: 4.7,
    reviewCount: 341,
    seatsLeft: 6,
    nextDepartures: ["14 Aug 2026", "28 Aug 2026"],
    trending: true,
    highlights: [
      "Rice terrace sunrise trek in Ubud",
      "Day trip to Nusa Penida's Kelingking Beach",
      "Private pool villa for two nights",
      "Visa assistance included",
    ],
    inclusions: ["6 nights (mix of resort and pool villa)", "Daily breakfast", "Nusa Penida day trip with speedboat", "Visa processing"],
    exclusions: ["International airfare", "Lunch and dinner (except welcome dinner)", "Optional water sports"],
    thingsToCarry: ["Valid passport (6 months validity)", "Swimwear", "Light trekking shoes"],
    itinerary: [
      { day: 1, title: "Arrive Denpasar, transfer to Ubud", description: "Evening at leisure, welcome dinner at a local warung.", meals: ["Dinner"], stay: "Ubud resort" },
      { day: 2, title: "Ubud rice terraces & temples", description: "Sunrise trek at Tegallalang, visit Tirta Empul water temple.", meals: ["Breakfast"], stay: "Ubud resort" },
      { day: 3, title: "Ubud to Seminyak", description: "Transfer to Seminyak, free evening at Seminyak beach.", meals: ["Breakfast"], stay: "Seminyak resort" },
      { day: 4, title: "Nusa Penida day trip", description: "Speedboat to Nusa Penida, visit Kelingking Beach and Angel's Billabong.", meals: ["Breakfast"], stay: "Seminyak resort" },
      { day: 5, title: "Transfer to Uluwatu pool villa", description: "Check into private pool villa, evening Kecak fire dance at Uluwatu temple.", meals: ["Breakfast"], stay: "Uluwatu pool villa" },
      { day: 6, title: "Leisure day at the villa", description: "Full free day by your private pool, optional spa add-ons.", meals: ["Breakfast"], stay: "Uluwatu pool villa" },
      { day: 7, title: "Departure", description: "Transfer to Denpasar airport.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Karan Mehta", rating: 5, date: "22 Jul 2026", text: "The pool villa in Uluwatu was the standout — better than what we paid double for elsewhere on a previous trip." },
      { id: "r2", author: "Ritu Sharma", rating: 4, date: "05 Jul 2026", text: "Nusa Penida day was long (12+ hours) but absolutely worth it. Pack motion sickness tablets for the speedboat." },
    ],
  },
  {
    slug: "santorini-aegean-dream",
    title: "Santorini Aegean Dream",
    destination: "Santorini",
    country: "Greece",
    image: img("tour-santorini-1"),
    gallery: [img("tour-santorini-1"), img("tour-santorini-2"), img("tour-santorini-3")],
    agency: agencies[3],
    category: ["International", "Luxury", "Honeymoon"],
    price: 145999,
    originalPrice: 168999,
    duration: "5N / 6D",
    nights: 5,
    days: 6,
    transport: ["Flight", "Cab"],
    hotelRating: 5,
    mealsIncluded: true,
    freeCancellation: false,
    instantConfirmation: false,
    rating: 4.9,
    reviewCount: 92,
    seatsLeft: 3,
    nextDepartures: ["20 Sep 2026", "04 Oct 2026"],
    featured: true,
    highlights: [
      "Caldera-view suite with private plunge pool",
      "Private catamaran sunset cruise",
      "Wine tasting at a family-run Santorini vineyard",
      "Schengen visa assistance included",
    ],
    inclusions: ["5 nights caldera-view suite", "Daily breakfast", "Private catamaran cruise", "Vineyard tour with tastings", "Visa assistance"],
    exclusions: ["International airfare", "Lunch and dinner (except cruise dinner)", "Travel insurance"],
    thingsToCarry: ["Valid passport with Schengen visa", "Comfortable walking sandals", "A nice outfit for the cruise dinner"],
    itinerary: [
      { day: 1, title: "Arrive Santorini", description: "Private transfer to your caldera-view suite in Oia.", meals: ["Dinner"], stay: "Oia caldera suite" },
      { day: 2, title: "Oia village & sunset point", description: "Explore Oia's blue-domed churches, evening at the famous sunset viewpoint.", meals: ["Breakfast"], stay: "Oia caldera suite" },
      { day: 3, title: "Private catamaran cruise", description: "Sail the caldera, swim at the volcanic hot springs, dinner on board at sunset.", meals: ["Breakfast", "Dinner"], stay: "Oia caldera suite" },
      { day: 4, title: "Vineyard & Pyrgos village", description: "Wine tasting at a family vineyard, wander the hilltop village of Pyrgos.", meals: ["Breakfast"], stay: "Oia caldera suite" },
      { day: 5, title: "Leisure day", description: "Free day — optional spa treatments or Akrotiri archaeological site visit.", meals: ["Breakfast"], stay: "Oia caldera suite" },
      { day: 6, title: "Departure", description: "Transfer to Santorini airport.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Aditi & Varun", rating: 5, date: "10 Jun 2026", text: "Booked for our honeymoon — the plunge pool suite view alone made the price worth it. Meridian's local partner was extremely responsive." },
    ],
  },
  {
    slug: "swiss-alps-scenic-rail",
    title: "Swiss Alps Scenic Rail Journey",
    destination: "Swiss Alps",
    country: "Switzerland",
    image: img("tour-swiss-1"),
    gallery: [img("tour-swiss-1"), img("tour-swiss-2"), img("tour-swiss-3")],
    agency: agencies[3],
    category: ["International", "Luxury", "Hill Station"],
    price: 189999,
    originalPrice: 214999,
    duration: "7N / 8D",
    nights: 7,
    days: 8,
    transport: ["Flight", "Train"],
    hotelRating: 4,
    mealsIncluded: true,
    freeCancellation: false,
    instantConfirmation: false,
    rating: 4.8,
    reviewCount: 128,
    seatsLeft: 9,
    nextDepartures: ["01 Sep 2026", "15 Sep 2026"],
    highlights: [
      "Glacier Express panoramic rail journey",
      "Jungfraujoch, the 'Top of Europe'",
      "Lake cruise on Lake Lucerne",
      "Swiss Travel Pass included for all trains",
    ],
    inclusions: ["7 nights 4-star hotels", "Daily breakfast", "Swiss Travel Pass", "Jungfraujoch entry", "Lake Lucerne cruise"],
    exclusions: ["International airfare", "Lunch and dinner", "Travel insurance"],
    thingsToCarry: ["Warm layered jacket", "Comfortable walking shoes", "Valid Schengen visa"],
    itinerary: [
      { day: 1, title: "Arrive Zurich", description: "Transfer to hotel, evening walk along the Limmat river.", meals: ["Dinner"], stay: "Zurich hotel" },
      { day: 2, title: "Zurich to Lucerne", description: "Scenic train to Lucerne, afternoon lake cruise.", meals: ["Breakfast"], stay: "Lucerne hotel" },
      { day: 3, title: "Mount Pilatus", description: "Cable car and cogwheel railway up Mount Pilatus.", meals: ["Breakfast"], stay: "Lucerne hotel" },
      { day: 4, title: "Lucerne to Interlaken", description: "Travel to Interlaken via scenic rail.", meals: ["Breakfast"], stay: "Interlaken hotel" },
      { day: 5, title: "Jungfraujoch", description: "Full day at the 'Top of Europe', including the ice palace and Sphinx observatory.", meals: ["Breakfast"], stay: "Interlaken hotel" },
      { day: 6, title: "Interlaken to Zermatt via Glacier Express", description: "Board the iconic Glacier Express through the Alps.", meals: ["Breakfast"], stay: "Zermatt hotel" },
      { day: 7, title: "Zermatt & the Matterhorn", description: "Gornergrat railway for close-up Matterhorn views.", meals: ["Breakfast"], stay: "Zermatt hotel" },
      { day: 8, title: "Departure", description: "Transfer to Zurich for your flight home.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Vikram Oberoi", rating: 5, date: "15 May 2026", text: "The Glacier Express day was the best travel day I've had. Every hotel was walking distance from the station, which made the logistics effortless." },
    ],
  },
  {
    slug: "royal-rajasthan-palace-circuit",
    title: "Royal Rajasthan: Palaces & Desert Forts",
    destination: "Rajasthan",
    country: "India",
    image: img("tour-rajasthan-1"),
    gallery: [img("tour-rajasthan-1"), img("tour-rajasthan-2"), img("tour-rajasthan-3"), img("tour-rajasthan-4")],
    agency: agencies[4],
    category: ["Domestic", "Luxury", "Family"],
    price: 46999,
    originalPrice: 54999,
    duration: "6N / 7D",
    nights: 6,
    days: 7,
    transport: ["Cab", "Train"],
    hotelRating: 5,
    mealsIncluded: true,
    freeCancellation: true,
    instantConfirmation: true,
    rating: 4.8,
    reviewCount: 467,
    seatsLeft: 8,
    nextDepartures: ["10 Aug 2026", "24 Aug 2026", "07 Sep 2026"],
    featured: true,
    trending: true,
    highlights: [
      "Two nights in a converted heritage palace",
      "Sunset camel safari in the Thar desert",
      "Private guided tour of Amber Fort",
      "Traditional Rajasthani thali dinner with folk performance",
    ],
    inclusions: ["6 nights heritage & 5-star hotels", "Daily breakfast and dinner", "AC private vehicle throughout", "All monument entry fees", "Camel safari"],
    exclusions: ["Airfare/train fare to Jaipur", "Lunches", "Camera fees at monuments"],
    thingsToCarry: ["Light cottons + a light shawl for evenings", "Comfortable walking shoes", "Sunglasses"],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", description: "Check into hotel, evening at leisure in the Pink City.", meals: ["Dinner"], stay: "Jaipur hotel" },
      { day: 2, title: "Jaipur city & Amber Fort", description: "Amber Fort, City Palace, Hawa Mahal and Jantar Mantar.", meals: ["Breakfast", "Dinner"], stay: "Jaipur hotel" },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive to Jodhpur, evening at Mehrangarh Fort.", meals: ["Breakfast", "Dinner"], stay: "Jodhpur heritage hotel" },
      { day: 4, title: "Jodhpur to Jaisalmer", description: "Drive to Jaisalmer, visit the Golden Fort at sunset.", meals: ["Breakfast", "Dinner"], stay: "Jaisalmer heritage hotel" },
      { day: 5, title: "Thar desert safari", description: "Morning at leisure, afternoon jeep safari and sunset camel ride in the dunes with folk dinner.", meals: ["Breakfast", "Dinner"], stay: "Desert camp" },
      { day: 6, title: "Jaisalmer to Udaipur (fly/drive)", description: "Transfer to Udaipur, evening boat ride on Lake Pichola.", meals: ["Breakfast", "Dinner"], stay: "Udaipur lakeside hotel" },
      { day: 7, title: "Departure", description: "Visit City Palace Udaipur before transfer to airport.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "The Kapadia Family", rating: 5, date: "28 Jun 2026", text: "Travelled with two grandparents and two kids — the pace was well planned so no one was ever exhausted. The heritage hotel in Jodhpur was a highlight for everyone." },
      { id: "r2", author: "Manish Agarwal", rating: 5, date: "09 Jun 2026", text: "Our driver-guide across all 6 days knew more history than most tour guides at the forts themselves." },
    ],
  },
  {
    slug: "vietnam-north-to-south",
    title: "Vietnam North to South Explorer",
    destination: "Vietnam",
    country: "Vietnam",
    image: img("tour-vietnam-1"),
    gallery: [img("tour-vietnam-1"), img("tour-vietnam-2"), img("tour-vietnam-3")],
    agency: agencies[3],
    category: ["International", "Adventure"],
    price: 58999,
    originalPrice: 67999,
    duration: "6N / 7D",
    nights: 6,
    days: 7,
    transport: ["Flight", "Cab"],
    hotelRating: 4,
    mealsIncluded: true,
    freeCancellation: true,
    instantConfirmation: true,
    rating: 4.6,
    reviewCount: 203,
    seatsLeft: 14,
    nextDepartures: ["11 Aug 2026", "25 Aug 2026", "08 Sep 2026"],
    trending: true,
    highlights: [
      "Overnight cruise on Halong Bay",
      "Street food walking tour in Hanoi's Old Quarter",
      "Cu Chi Tunnels day trip from Ho Chi Minh City",
      "Domestic flight between Hanoi and Ho Chi Minh included",
    ],
    inclusions: ["6 nights hotels + 1 night cruise cabin", "Daily breakfast", "Domestic flight Hanoi–HCMC", "Halong Bay cruise with meals", "Cu Chi Tunnels entry"],
    exclusions: ["International airfare", "Visa fee", "Lunch and dinner (except on cruise)"],
    thingsToCarry: ["Light breathable clothing", "Comfortable shoes for walking tours", "E-visa printout"],
    itinerary: [
      { day: 1, title: "Arrive Hanoi", description: "Evening street food walking tour in the Old Quarter.", meals: ["Dinner"], stay: "Hanoi hotel" },
      { day: 2, title: "Hanoi to Halong Bay", description: "Drive to Halong, board your overnight cruise, sunset on the top deck.", meals: ["Breakfast", "Lunch", "Dinner"], stay: "Halong Bay cruise cabin" },
      { day: 3, title: "Halong Bay to Hanoi, fly to Ho Chi Minh City", description: "Morning kayaking, disembark and fly south.", meals: ["Breakfast", "Lunch"], stay: "Ho Chi Minh City hotel" },
      { day: 4, title: "Cu Chi Tunnels", description: "Full day trip to the Cu Chi Tunnels and War Remnants Museum.", meals: ["Breakfast"], stay: "Ho Chi Minh City hotel" },
      { day: 5, title: "Mekong Delta", description: "Boat trip through the Mekong Delta's floating markets.", meals: ["Breakfast"], stay: "Ho Chi Minh City hotel" },
      { day: 6, title: "Leisure day", description: "Free day for shopping at Ben Thanh Market or an optional spa.", meals: ["Breakfast"], stay: "Ho Chi Minh City hotel" },
      { day: 7, title: "Departure", description: "Transfer to Tan Son Nhat airport.", meals: ["Breakfast"] },
    ],
    reviews: [
      { id: "r1", author: "Farah Sheikh", rating: 5, date: "01 Jul 2026", text: "The overnight cruise cabin was nicer than expected for the price point. Kayaking around the limestone karsts at sunrise was unforgettable." },
    ],
  },
];

export const featuredTours = tours.filter((t) => t.featured);
export const trendingTours = tours.filter((t) => t.trending);
export const lastMinuteDeals = [...tours].sort((a, b) => b.seatsLeft - a.seatsLeft === 0 ? 0 : (a.seatsLeft < 6 ? -1 : 1)).slice(0, 4);

export function getTourBySlug(slug: string) {
  return tours.find((t) => t.slug === slug);
}

export function getAgencyBySlug(slug: string) {
  return agencies.find((a) => a.slug === slug);
}

export function getToursByAgency(slug: string) {
  return tours.filter((t) => t.agency.slug === slug);
}

export function getRelatedTours(tour: Tour, limit = 3) {
  return tours
    .filter((t) => t.slug !== tour.slug && (t.destination === tour.destination || t.category.some((c) => tour.category.includes(c))))
    .slice(0, limit);
}

export const faqs = [
  {
    q: "How does Voyagr choose which agencies to list?",
    a: "Every agency goes through document verification and a manual review of at least three completed tours before they can list publicly. You'll always see a Verified badge on agencies that have passed this check.",
  },
  {
    q: "Do I pay Voyagr or the travel agency directly?",
    a: "Payment is processed through Voyagr's checkout, then settled to the agency once your trip is confirmed. This means your booking, cancellation and refund all follow one consistent policy regardless of which agency you book with.",
  },
  {
    q: "Can I compare tours from different agencies before booking?",
    a: "Yes — use the compare option on any tour card to line up price, duration, hotel rating and inclusions side by side across agencies for the same destination.",
  },
  {
    q: "What happens if an agency cancels my confirmed booking?",
    a: "You're automatically offered a full refund or a free transfer to an equivalent tour from another verified agency at no extra cost.",
  },
  {
    q: "Is free cancellation available on every tour?",
    a: "It depends on the agency and tour — look for the Free Cancellation filter when searching. It's clearly marked on every tour card and detail page.",
  },
];

export const blogPosts = [
  {
    slug: "best-time-to-visit-ladakh",
    title: "The Best Time to Visit Ladakh (And When to Avoid It)",
    excerpt: "Roads open in stages, not all at once — get the month wrong and half the passes are still under snow.",
    image: img("blog-ladakh"),
    category: "Destination Guide",
    readTime: "6 min read",
  },
  {
    slug: "goa-vs-gokarna",
    title: "Goa vs Gokarna: Which Beach Trip Actually Fits You",
    excerpt: "One has infrastructure and nightlife, the other has quiet and cliffs. Here's how to actually choose.",
    image: img("blog-goa"),
    category: "Travel Tips",
    readTime: "4 min read",
  },
  {
    slug: "vietnam-e-visa-guide",
    title: "Vietnam E-Visa: A No-Nonsense Application Guide",
    excerpt: "What the checklist doesn't tell you about processing times and the one document people forget.",
    image: img("blog-visa"),
    category: "Visa Articles",
    readTime: "5 min read",
  },
];

export const testimonials = [
  { author: "Ishaan Bhatt", location: "Bengaluru", rating: 5, text: "Compared four Ladakh operators side by side and could actually see why one cost more — better vehicles, smaller group. Ended up glad I paid extra." },
  { author: "Meera Pillai", location: "Chennai", rating: 5, text: "First time booking a tour online instead of through a local agent, and the transparency won me over. No hidden 'fuel surcharge' at the end." },
  { author: "Arjun Desai", location: "Pune", rating: 4, text: "Booking a Kerala houseboat used to mean forty WhatsApp messages with an agent. This took fifteen minutes." },
];
