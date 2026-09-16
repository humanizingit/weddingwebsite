// ─────────────────────────────────────────────────────────────────────────────
// EDIT THIS FILE to update the entire website — names, dates, venues, events,
// travel details, FAQs, gallery images, and your Formspree RSVP form ID.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  couple: {
    partner1: "Alisha",
    partner2: "Neel",
    lastName: "Patel",
    hashtag: "#AlishaWedsNeel",
  },

  // Wedding day (IST). Used for the countdown and displayed dates.
  weddingDateISO: "2027-01-29T09:00:00+05:30",
  weddingDateDisplay: "January 29, 2027",
  location: "South Gujarat, India",

  // RSVP submissions post to /api/rsvp (Cloudflare Worker → Supabase + Resend).
  // See worker/index.ts and the README for setup.
  email: "patel.neel76@gmail.com",
};

export type WeddingEvent = {
  name: string;
  gujaratiName?: string;
  /** Whose celebration this is — bride's side, groom's side, or everyone together */
  side: "Alisha" | "Neel" | "Together";
  date: string;
  time: string;
  /** Machine-readable times (IST) — used for the "Add to Calendar" .ics download */
  startISO: string;
  endISO: string;
  /** Town / village where this event takes place (shown on the home page) */
  location: string;
  venue: string;
  attire: string;
  description: string;
  tradition: string;
};

// Set to true to show the full four-day timeline (mehndi, pithi, sangeet,
// grah shanti). While false, only the wedding ceremony is shown site-wide.
export const showFullTimeline = false;

const allEvents: WeddingEvent[] = [
  {
    name: "Mehndi",
    gujaratiName: "મહેંદી",
    side: "Alisha",
    date: "Tuesday, January 26, 2027",
    time: "3:00 PM onwards",
    startISO: "2027-01-26T15:00:00+05:30",
    endISO: "2027-01-26T19:00:00+05:30",
    location: "Koli Bhatana, Kamrej",
    venue: "Koli Bhatana, Kamrej — venue to be announced",
    attire: "Colorful festive Indian wear — think greens, pinks & florals",
    description:
      "An afternoon of intricate henna, music, and mithai with Alisha and the women of both families as the celebrations officially begin.",
    tradition:
      "Mehndi (henna) is applied to the bride's hands and feet in beautiful patterns — a symbol of joy, beauty, and deep love. Guests are invited to get henna too!",
  },
  {
    name: "Pithi",
    gujaratiName: "પીઠી (Haldi)",
    side: "Alisha",
    date: "Wednesday, January 27, 2027",
    time: "9:00 AM",
    startISO: "2027-01-27T09:00:00+05:30",
    endISO: "2027-01-27T11:00:00+05:30",
    location: "Koli Bhatana, Kamrej",
    venue: "Alisha's family home, Koli Bhatana — details to follow",
    attire: "Casual yellows — wear something you don't mind getting turmeric on!",
    description:
      "A playful morning ceremony where Alisha is blessed (and thoroughly covered) with turmeric paste by her family.",
    tradition:
      "In Gujarati tradition, close family applies pithi — a paste of turmeric, sandalwood, and rosewater — to bless the bride with glowing skin and good fortune before the wedding.",
  },
  {
    name: "Pithi",
    gujaratiName: "પીઠી (Haldi)",
    side: "Neel",
    date: "Wednesday, January 27, 2027",
    time: "9:00 AM",
    startISO: "2027-01-27T09:00:00+05:30",
    endISO: "2027-01-27T11:00:00+05:30",
    location: "Jespor, Gujarat",
    venue: "Neel's family home, Jespor — details to follow",
    attire: "Casual yellows — wear something you don't mind getting turmeric on!",
    description:
      "A playful morning ceremony where Neel is blessed (and thoroughly covered) with turmeric paste by his family.",
    tradition:
      "In Gujarati tradition, close family applies pithi — a paste of turmeric, sandalwood, and rosewater — to bless the groom with glowing skin and good fortune before the wedding.",
  },
  {
    name: "Sangeet",
    gujaratiName: "સંગીત",
    side: "Alisha",
    date: "Wednesday, January 27, 2027",
    time: "7:00 PM onwards",
    startISO: "2027-01-27T19:00:00+05:30",
    endISO: "2027-01-27T23:00:00+05:30",
    location: "Koli Bhatana, Kamrej",
    venue: "Koli Bhatana, Kamrej — venue to be announced",
    attire: "Chaniya choli or festive Indian wear — dress to twirl",
    description:
      "Alisha's side hosts a high-energy night of garba and raas circles, dandiya, and family performances in her honor.",
    tradition:
      "The sangeet is a night of music and dance celebrating the bride. Garba, Gujarat's beloved folk dance, is performed in rhythmic circles — don't know the steps? You'll learn in five minutes; the circle welcomes everyone.",
  },
  {
    name: "Sangeet",
    gujaratiName: "સંગીત",
    side: "Neel",
    date: "Wednesday, January 27, 2027",
    time: "7:00 PM onwards",
    startISO: "2027-01-27T19:00:00+05:30",
    endISO: "2027-01-27T23:00:00+05:30",
    location: "Jespor, Gujarat",
    venue: "Jespor, Gujarat — venue to be announced",
    attire: "Kediyu / chaniya choli or festive Indian wear — dress to twirl",
    description:
      "Neel's side hosts its own night of garba, raas, dandiya, and performances to send the groom off in style.",
    tradition:
      "The sangeet is a night of music and dance celebrating the groom. Garba, Gujarat's beloved folk dance, is performed in rhythmic circles — don't know the steps? You'll learn in five minutes; the circle welcomes everyone.",
  },
  {
    name: "Grah Shanti",
    gujaratiName: "ગ્રહ શાંતિ",
    side: "Alisha",
    date: "Thursday, January 28, 2027",
    time: "10:00 AM",
    startISO: "2027-01-28T10:00:00+05:30",
    endISO: "2027-01-28T12:00:00+05:30",
    location: "Koli Bhatana, Kamrej",
    venue: "Alisha's family home, Koli Bhatana — details to follow",
    attire: "Traditional Indian wear",
    description:
      "A sacred prayer ceremony at Alisha's home with close family, seeking blessings for the marriage ahead.",
    tradition:
      "The Grah Shanti pooja invokes the blessings of the nine planets (navagraha) to remove obstacles and bring peace, harmony, and prosperity to the couple's new life. It marks the sacred start of the wedding rites in the family home.",
  },
  {
    name: "Grah Shanti",
    gujaratiName: "ગ્રહ શાંતિ",
    side: "Neel",
    date: "Thursday, January 28, 2027",
    time: "10:00 AM",
    startISO: "2027-01-28T10:00:00+05:30",
    endISO: "2027-01-28T12:00:00+05:30",
    location: "Jespor, Gujarat",
    venue: "Neel's family home, Jespor — details to follow",
    attire: "Traditional Indian wear",
    description:
      "A sacred prayer ceremony at Neel's home with close family, seeking blessings for the marriage ahead.",
    tradition:
      "The Grah Shanti pooja invokes the blessings of the nine planets (navagraha) to remove obstacles and bring peace, harmony, and prosperity to the couple's new life. It marks the sacred start of the wedding rites in the family home.",
  },
  {
    name: "Wedding Ceremony",
    gujaratiName: "લગ્ન",
    side: "Together",
    date: "Friday, January 29, 2027",
    time: "Baraat at 9:00 AM · Ceremony to follow",
    startISO: "2027-01-29T09:00:00+05:30",
    endISO: "2027-01-29T14:00:00+05:30",
    location: "South Gujarat, India",
    venue: "South Gujarat — venue to be announced",
    attire: "Formal Indian attire in jewel tones (please avoid white & black)",
    description:
      "The main event — Neel arrives in a joyous baraat procession, and Alisha & Neel exchange garlands and take their pheras around the sacred fire.",
    tradition:
      "The ceremony begins with the baraat (the groom's dancing procession), followed by the jaimala (exchange of garlands) and the pheras — seven circles around the sacred fire, each representing a vow the couple makes to one another.",
  },
];

export const events: WeddingEvent[] = showFullTimeline
  ? allEvents
  : allEvents.filter((ev) => ev.side === "Together");

export const story = {
  intro:
    "Every love story is beautiful, but ours is our favorite. Here's how two paths became one.",
  milestones: [
    {
      title: "Arranged to Date",
      date: "where it all began",
      image: "/images/first-photo.webp",
      text: "Ours started the old-fashioned way — with the people who love us most playing matchmaker. Neel's mom asked Alisha's aunt who Alisha was, and whether she might be looking to get set up. The answer was yes — and one introduction later, an arrangement turned into date after date, entirely our own.",
    },
    {
      title: "The Road Trips",
      date: "miles & miles of us",
      image: "/images/roadtrip.webp",
      text: "Windows down, playlists up. Some couples have a song — we have whole highways. From spontaneous weekend drives to long hauls with chai stops along the way, the road became our favorite place to talk, laugh, and dream up everything that came next.",
    },
    {
      title: "The Coconut Ceremony",
      date: "December 2025",
      image: "/images/coconut-ceremony.webp",
      text: "In December, our families came together for our coconut ceremony — the cherished Gujarati tradition where the bride's family welcomes the groom with a shreefal (coconut), officially sealing the match. With blessings from both sides, Alisha & Neel became official — and the countdown to Gujarat began.",
    },
    {
      title: "The Engagement Party",
      date: "stateside send-off",
      image: "/images/engagement.webp",
      text: "Before the packing and the passports, we threw an engagement party to celebrate with our family here in the US — part pre-wedding bash, part send-off. Toasts, dancing, and both families in one room: the perfect warm-up for everything waiting for us in India.",
    },
  ],
};

// The two family villages — shown as embedded maps on the Travel page
export const villages = [
  {
    who: "Alisha",
    name: "Koli Bhatana",
    region: "Kamrej, Gujarat, India",
    mapQuery: "Koli Bhatana, Kamrej, Gujarat, India",
  },
  {
    who: "Neel",
    name: "Jespor",
    region: "Gujarat, India",
    mapQuery: "Jespor, Gujarat, India",
  },
];

export const travel = {
  gettingThere: {
    title: "Getting There",
    airportCode: "BOM",
    airportName: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
    text: "We recommend flying into Mumbai (BOM) — the easiest international gateway, with direct flights from most major cities worldwide. From there it's a scenic ~4–5 hour drive up the coast to South Gujarat, and we've got the driving covered (see Airport Transfers below).",
    alternates:
      "Flying a different route? Surat (STV, domestic) and Ahmedabad (AMD) also work — just note that the group vans run from Mumbai.",
  },
  // Add flights as they're booked, e.g.:
  // { route: "JFK → BOM", airline: "Air India 119", date: "Jan 23, 2027", note: "The New York crew" },
  flights: {
    title: "Group Flights",
    text: "To make the journey easy (and a lot more fun), we'll publish a list of the flights family and friends are booking — so you can travel with familiar faces and share the vans on arrival.",
    list: [] as { route: string; airline: string; date: string; note?: string }[],
    comingSoon: "Flight list coming soon — check back once bookings begin!",
  },
  transfers: {
    title: "Airport Transfers",
    text: "Sprinter vans will run from Mumbai airport to the hotels for every arrival window — no need to arrange your own car. We'll collect everyone's flight details closer to the date, and we'll have a seat (and snacks) waiting for you.",
  },
  // Add hotels as they're confirmed, e.g.:
  // { name: "Hotel Name", area: "10 min from the venue", note: "Rooms blocked under 'Patel Wedding'", url: "https://..." },
  hotels: {
    title: "Where to Stay",
    text: "We've hand-picked a list of lovely hotels, all comfortable and close to the functions. Hotel names, room blocks, and booking codes will be shared along with the formal invitation.",
    list: [] as { name: string; area: string; note: string; url?: string }[],
    comingSoon: "Hotel list coming soon — every option will be near the celebrations.",
  },
  visa: {
    title: "Visa & Documents",
    text: "Most non-Indian passport holders need a visa to visit India. The e-Tourist Visa is quick and fully online — apply at the official portal (indianvisaonline.gov.in) at least 4–6 weeks before travel. Make sure your passport is valid for 6+ months beyond your travel dates. Guests of Indian origin may be eligible for an OCI card instead.",
  },
  weather: {
    title: "Weather in January",
    text: "Late January is the loveliest time of year in South Gujarat — dry and sunny with highs around 30°C (86°F) and pleasantly cool evenings around 15°C (59°F). Perfect for outdoor celebrations; bring a light layer for nighttime events.",
  },
  tips: [
    "Book flights early — late January is peak wedding & travel season in India.",
    "Carry some Indian Rupees; cards are widely accepted in cities but cash helps at local markets.",
    "An Indian SIM or international roaming plan makes coordination easy.",
    "Drink bottled or filtered water, and come hungry — Gujarati food is legendary.",
    "Outfits for every event can be bought or tailored quickly in India — leave room in your suitcase!",
  ],
};

export const gallery = [
  { src: "/images/hero.webp", alt: "Alisha & Neel — a walk in the park" },
  { src: "/images/engagement.webp", alt: "Alisha & Neel — the engagement" },
  { src: "/images/coconut-ceremony.webp", alt: "Alisha & Neel — coconut ceremony" },
  { src: "/images/first-photo.webp", alt: "Alisha & Neel — our first photo together" },
  { src: "/images/roadtrip.webp", alt: "Alisha & Neel — on the road" },
];

export const registry = {
  intro:
    "Your presence in India — across oceans and time zones — is truly the greatest gift we could ask for. For loved ones who have asked, we've put together a few options below.",
  note: "In keeping with tradition, please no boxed gifts at the events — your blessings are more than enough.",
  // Add your registry / fund links here, e.g.:
  // { name: "Our Registry", description: "A few things for our first home together.", url: "https://www.zola.com/registry/..." },
  links: [
    {
      name: "Gift Registry",
      description: "A small collection of things for our first home together.",
      url: "",
    },
    {
      name: "Honeymoon Fund",
      description: "Help us make memories on the adventure that comes after “I do.”",
      url: "",
    },
  ] as { name: string; description: string; url: string }[],
};

export const faqs = [
  {
    q: "When should I RSVP by?",
    a: "Please RSVP by October 1, 2026 so we can finalize arrangements with our vendors and hotels. You can update your response any time by reaching out to us directly.",
  },
  {
    q: "What should I wear to each event?",
    a: "Each event page lists suggested attire — broadly: colorful festive wear for the Mehndi, yellows for the Pithi, twirl-ready garba outfits for the Sangeet night, formal Indian attire in jewel tones for the wedding, and black-tie-optional or Indo-western for the reception. Don't have Indian outfits? Don't stress — you can shop wonderfully (and affordably) once you arrive, or wear formal Western attire.",
  },
  {
    q: "I've never attended an Indian wedding. What should I expect?",
    a: "Joy, color, music, and a lot of food! Events span multiple days and each has its own meaning — we've added short explainers on the Events page. Come ready to dance, and don't be shy about asking anyone in the family what's happening; we love sharing our traditions.",
  },
  {
    q: "Do I need a visa to travel to India?",
    a: "Most non-Indian passport holders do — the e-Tourist Visa is a simple online application. See the Travel page for details, and apply at least 4–6 weeks ahead.",
  },
  {
    q: "Are children invited?",
    a: "We love your little ones! Details about children at each event will be included with the formal invitation.",
  },
  {
    q: "Will transportation be provided?",
    a: "Yes — sprinter vans will pick guests up at Mumbai airport and bring you to the hotels, and shuttles will run between the hotels and all wedding events. We'll collect flight details from everyone closer to the date so we can plan your pickup.",
  },
  {
    q: "What about gifts?",
    a: "Your presence in India is truly the greatest gift. For those who have asked, we've put a few options on the Registry page — and in keeping with tradition, please no boxed gifts at the events.",
  },
  {
    q: "What's the best way to reach you with questions?",
    a: "Email us anytime — we're happy to help with travel planning, outfit questions, or anything else. You'll find the address in the site footer.",
  },
];
