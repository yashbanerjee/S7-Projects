/**
 * Curated Pexels imagery for Project S7 -
 * Visually verified event / exhibition / stage / hospitality photography.
 * Source: https://www.pexels.com (royalty-free)
 */
const px = (id: number | string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const images = {
  /** Arena-scale production with LED wall & stage architecture */
  hero: px(2263436, 2400),
  /** Outdoor festival stage with pyrotechnic atmosphere */
  heroAlt: px(1540406, 2400),
  /** Formal banquet / reception table styling */
  about: px(2306281, 1600),
  /** Purple-lit auditorium audience */
  aboutWide: px(2774557, 2000),
  /** Creative workshop / live host presentation */
  process: px(2608517, 1800),
  /** Concert stage beams */
  cta: px(2747449, 2400),
  /** Professional seminar / conference attendees */
  contact: px(7648047, 1800),
  /** Behind-the-scenes creative gathering */
  careers: px(2608517, 1800),
  /** Champagne toast & celebration energy */
  culture: px(3171837, 1600),
  /** Intimate keynote speaker on stage */
  leadership: px(3321793, 1400),
  /** Casual hospitality networking moment */
  networking: px(2422290, 1800),
  /** Large-scale stage production */
  stage: px(2263436, 1800),
  /** Styled brand booth interior / spatial exhibit design */
  booth: px(31311125, 1800),
  /** Outdoor exhibition stand pavilion (Volvo show floor) */
  build: px(12712474, 1800),
  /** Outdoor hospitality catering display */
  hospitality: px(587741, 1800),
  /** Theatre stage curtains - awards / ceremony mood */
  awards: px(713149, 1800),
  /** Busy indoor trade-show hall with booth grid */
  expo: px(35138560, 1800),
  /** Monumental live-event structure / LED arena */
  architecture: px(2263436, 1800),
  /** People-forward event culture */
  team: px(2422290, 1800),
  /** Dramatic stage lighting wash */
  lighting: px(2747446, 1800),
  /** Conference hall / board meeting */
  conference: px(1181406, 1800),
  /** Gala dining setup */
  gala: px(2306281, 1800),
  /** Confetti toast celebration */
  celebration: px(3171837, 1600),
  /** Formal dinner atmosphere */
  dinner: px(2306281, 1800),
  /** High-energy outdoor show atmosphere */
  lightsCrowd: px(1540406, 1800),
  /** Briefing / seminar attendees */
  briefing: px(7648047, 1800),
  /** Panel / speaker forum */
  panel: px(3321793, 1800),
  /** Product-reveal / launch show energy */
  launch: px(1763075, 1800),
  /** Exhibition-floor hospitality / networking lounge */
  skyline: px(860227, 1800),
  /** Live show intensity */
  automotive: px(167636, 1800),
  /** Retail / experiential hospitality */
  retail: px(587741, 1800),
  /** Education forum audience */
  education: px(1708988, 1800),
  /** Healthcare-style professional congress */
  healthcare: px(7648047, 1800),
  /** Immersive tech / next-gen experience environment */
  technology: px(19012064, 1800),
  /** Blue-lit keynote auditorium */
  keynoteHall: px(2774556, 1800),
  /** Industrial machinery exhibit on a show floor */
  tradeMachinery: px(36522033, 1800),
  /** Designer studio — tablet + brand craft */
  designStudio: px(4348401, 1800),
  /** Creative desk with sketchbooks & brand tools */
  brandCraft: px(4348374, 1800),
  /** Stakeholder handshake / programme agreement */
  dealClose: px(3184291, 1800),
  /** Strategic presentation in a bright boardroom */
  programmeBoard: px(1181395, 1800),
  /** Host speaking to a live workshop audience */
  hostCrew: px(2608517, 1800),
  /** Concert crowd with raised hands (AV energy) */
  productionCrowd: px(2747446, 1800),
};

/** Scroll-stopping event stills used in homepage gallery */
export const eventMoments = [
  {
    src: images.expo,
    alt: "Busy modern trade-show hall with exhibition booths",
    label: "Exhibition halls",
  },
  {
    src: images.booth,
    alt: "Styled modern brand booth with seating and product display",
    label: "Stand design",
  },
  {
    src: images.stage,
    alt: "Arena-scale live show production with LED screens",
    label: "Stage production",
  },
  {
    src: images.networking,
    alt: "Guests networking at a premium corporate reception",
    label: "Hosted networking",
  },
  {
    src: images.gala,
    alt: "Elegant banquet tables ready for a gala dinner",
    label: "Gala dining",
  },
  {
    src: images.lightsCrowd,
    alt: "Crowd at a festival show under dramatic stage lights",
    label: "Show atmosphere",
  },
  {
    src: images.build,
    alt: "Outdoor branded exhibition pavilion on a show plaza",
    label: "Stand build",
  },
  {
    src: images.celebration,
    alt: "Champagne toast with confetti at a celebration",
    label: "Live celebrations",
  },
];

/** Cinematic hero background — illuminated event stage (Pexels). Replace `public/videos/hero.mp4` to swap. */
export const heroVideo = "/videos/hero.mp4";

export const serviceImages: Record<string, string> = {
  "exhibition-management": images.expo,
  "exhibition-stand-design": images.booth,
  "exhibition-stand-build": images.build,
  "project-management": images.conference,
  "event-staffing": images.networking,
  "event-production": images.stage,
  "creative-branding": images.designStudio,
  capabilities: images.skyline,
  "future-services": images.technology,
};
/** Public service card shape used on home / services listing */
export type PublicService = {
  title: string;
  slug: string;
  tagline?: string | null;
  description: string;
  image: string;
  overview?: string;
  process?: { step: string; title: string; text: string }[];
  benefits?: string[];
  features?: string[];
  gallery?: string[];
};

/**
 * Prefer curated stock images for known service slugs so the public site
 * always matches theme (API/DB may lag behind deploy).
 */
export function applyServiceStockImages<T extends PublicService>(services: T[]): T[] {
  return services.map((s) => {
    const stock = serviceImages[s.slug];
    if (!stock) return s;
    return { ...s, image: stock } as T;
  });
}

export function resolveServiceImage(slug: string, fallback?: string | null) {
  return serviceImages[slug] || fallback || images.expo;
}

/** Stable identity for stock URLs (same photo with different query strings = same). */
export function imageIdentity(url: string): string {
  if (!url) return "";
  const pexels = url.match(/\/photos\/(\d+)\//);
  if (pexels) return `pexels:${pexels[1]}`;
  const unsplash = url.match(/images\.unsplash\.com\/photo-([^?]+)/);
  if (unsplash) return `unsplash:${unsplash[1]}`;
  return url.split("?")[0];
}

/** Drop empty/duplicate URLs so galleries never render cloned tiles. */
export function uniqueImageUrls(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (!url?.trim()) continue;
    const key = imageIdentity(url);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(url.trim());
  }
  return out;
}

/** Diversified fill pool — each entry is a distinct Pexels photo id. */
export const galleryStockPool = uniqueImageUrls([
  images.expo,
  images.booth,
  images.build,
  images.stage,
  images.lighting,
  images.networking,
  images.conference,
  images.keynoteHall,
  images.designStudio,
  images.brandCraft,
  images.skyline,
  images.tradeMachinery,
  images.hostCrew,
  images.launch,
  images.gala,
  images.awards,
  images.technology,
  images.dealClose,
  images.programmeBoard,
]);

/**
 * Theme-matched gallery stills per service (3 distinct photos each).
 * Matched to what the service actually delivers — not generic office stock.
 */
export const serviceGalleries: Record<string, string[]> = {
  // Show-floor orchestration: hall, hospitality lounges, keynote audience
  "exhibition-management": [images.expo, images.skyline, images.keynoteHall],
  // Spatial design: styled booth interior, pavilion form, brand pop-up detail
  "exhibition-stand-design": [images.booth, images.build, images.designStudio],
  // Physical builds: pavilion, industrial exhibit install, trade-floor density
  "exhibition-stand-build": [images.build, images.tradeMachinery, images.expo],
  // Programme control: board meetings, briefings, stakeholder close
  "project-management": [images.conference, images.programmeBoard, images.dealClose],
  // People on the floor: hosts, workshop crew, guest networks
  "event-staffing": [images.networking, images.hostCrew, images.briefing],
  // Live technical craft: arena LED, lighting wash, festival stage
  "event-production": [images.stage, images.lighting, images.lightsCrowd],
  // Brand worlds: design studio craft, spatial brand booth, awards moments
  "creative-branding": [images.designStudio, images.brandCraft, images.booth],
  // Full delivery stack: expo floor, pavilion, live production
  capabilities: [images.skyline, images.build, images.stage],
  // Next formats: immersive tech spaces, tech expo machinery, product launch energy
  "future-services": [images.technology, images.tradeMachinery, images.launch],
};

/**
 * Build a gallery of `count` unique images.
 * Prefer custom CMS uploads; otherwise curated theme stock for the page.
 */
export function resolveGalleryImages(options: {
  gallery?: Array<string | null | undefined> | null;
  stock?: string[];
  primary?: string | null;
  count?: number;
  preferStock?: boolean;
}): string[] {
  const count = options.count ?? 3;
  const stock = uniqueImageUrls(options.stock || []);
  const fromApi = uniqueImageUrls(options.gallery || []);

  const customOnly = fromApi.filter(
    (u) => !/images\.pexels\.com|images\.unsplash\.com/i.test(u)
  );

  // Custom uploads always win; theme stock beats stale CDN for known pages.
  const preferred =
    customOnly.length > 0
      ? uniqueImageUrls([...customOnly, ...stock, options.primary])
      : options.preferStock
        ? uniqueImageUrls([...stock, options.primary, ...fromApi, ...galleryStockPool])
        : uniqueImageUrls([...fromApi, ...stock, options.primary, ...galleryStockPool]);

  const filled = uniqueImageUrls([...preferred, ...galleryStockPool]);
  return filled.slice(0, count);
}

export function resolveServiceGallery(
  slug: string,
  primary?: string | null,
  gallery?: Array<string | null | undefined> | null
): string[] {
  return resolveGalleryImages({
    gallery,
    stock: serviceGalleries[slug],
    primary: primary || serviceImages[slug],
    count: 3,
    preferStock: true,
  });
}


/** Fallback content when API is offline — mirrors seed data */
export const fallbackServices = [
  {
    title: "Exhibition Management",
    slug: "exhibition-management",
    tagline: "End-to-end exhibition excellence",
    description:
      "From concept to closing night, Project S7 orchestrates seamless exhibition programmes that captivate audiences and deliver measurable brand impact. We manage logistics, stakeholder coordination, vendor networks, and on-site execution so your team can focus on results.",
    overview:
      "Our exhibition management service covers the full lifecycle: strategy, planning, exhibitor operations, audience experience, VIP hosting, and post-event analytics. We specialise in international expos, national trade shows, and private brand showcases.",
    image: images.expo,
    process: [
      { step: "01", title: "Discovery", text: "Goals, audience, brand narrative, and success metrics." },
      { step: "02", title: "Strategy", text: "Floor strategy, experience journey, and operational plan." },
      { step: "03", title: "Execution", text: "Vendor control, onsite command, and guest excellence." },
      { step: "04", title: "Insight", text: "Debrief, analytics, content capture, and next steps." },
    ],
    benefits: [
      "Single point of accountability",
      "International vendor network",
      "Brand-safe operations",
      "Scalable from boutique to mega expos",
    ],
    features: [
      "Timeline & milestone control",
      "Exhibitor liaison",
      "VIP & protocol management",
      "Risk & contingency planning",
    ],
  },
  {
    title: "Exhibition Stand Design",
    slug: "exhibition-stand-design",
    tagline: "Architecture that stops traffic",
    description:
      "We design exhibition stands as architectural brand statements — cinematic form, intelligent flow, and materials that photograph beautifully and perform under show pressure.",
    image: images.booth,
    process: [
      { step: "01", title: "Brief", text: "Brand codes, product hierarchy, and visitor journey." },
      { step: "02", title: "Concept", text: "Mood, form language, and spatial narrative." },
      { step: "03", title: "Develop", text: "3D, materials, lighting, and technical packs." },
      { step: "04", title: "Approve", text: "Iterations with stakeholders until sign-off." },
    ],
    benefits: ["Bespoke brand architecture", "Lead-focused layouts", "Photogenic spaces", "Build-ready documentation"],
  },
  {
    title: "Exhibition Stand Build",
    slug: "exhibition-stand-build",
    tagline: "Precision craftsmanship at show pace",
    description:
      "Our build teams turn approved designs into immaculate physical environments — on time, on brand, and engineered for multi-day operations.",
    image: images.build,
  },
  {
    title: "Project Management",
    slug: "project-management",
    tagline: "Clarity under complexity",
    description:
      "Dedicated project directors who hold the entire programme together — budgets, timelines, stakeholders, and creative delivery.",
    image: images.conference,
  },
  {
    title: "Event Staffing",
    slug: "event-staffing",
    tagline: "People who elevate every interaction",
    description:
      "Trained hosts, brand ambassadors, technical crew, and VIP stewards who represent your brand with polish and warmth.",
    image: images.networking,
  },
  {
    title: "Event Production",
    slug: "event-production",
    tagline: "Stage, light, sound — cinematic delivery",
    description:
      "Full technical production for conferences, award nights, product launches, and hybrid experiences.",
    image: images.stage,
  },
  {
    title: "Creative & Branding",
    slug: "creative-branding",
    tagline: "Identity systems for live brand worlds",
    description:
      "Visual identity, spatial graphics, content systems, and campaign assets that make exhibitions unforgettable.",
    image: serviceImages["creative-branding"],
  },
  {
    title: "Capabilities",
    slug: "capabilities",
    tagline: "A full production ecosystem",
    description:
      "An integrated suite of specialist partners and internal teams covering design, build, AV, logistics, hospitality, and measurement.",
    image: serviceImages["capabilities"],
  },
  {
    title: "Future Services",
    slug: "future-services",
    tagline: "Next-generation event experiences",
    description:
      "Emerging formats: immersive XR booths, data-driven experience design, sustainable builds, and AI-assisted engagement.",
    image: serviceImages["future-services"],
  },
];

export const fallbackPortfolio = [
  {
    title: "National Infrastructure Expo Pavilion",
    slug: "national-infrastructure-expo",
    category: "Exhibitions",
    client: "Government Client",
    location: "Riyadh",
    year: "2025",
    description:
      "A monumental pavilion experience integrating interactive product stories, VIP lounges, and broadcast-ready stages for a flagship national infrastructure showcase.",
    coverImage: images.conference,
    tags: ["Pavilion", "Government", "Interactive"],
    featured: true,
  },
  {
    title: "Luxury Automotive Brand Experience",
    slug: "luxury-automotive-brand-experience",
    category: "Booths",
    client: "Global Auto Brand",
    location: "Dubai",
    year: "2025",
    description:
      "Sculptural stand design with kinetic lighting, precision vehicle staging, and invitation-only hospitality suites.",
    coverImage: images.automotive,
    tags: ["Automotive", "Hospitality"],
    featured: true,
  },
  {
    title: "Global Tech Leadership Summit",
    slug: "global-tech-leadership-summit",
    category: "Corporate",
    client: "Fortune 500 Technology",
    location: "Singapore",
    year: "2024",
    description:
      "Three-day executive summit with main stage production, breakout architecture, and seamless hybrid streaming.",
    coverImage: images.hero,
    tags: ["Summit", "Hybrid"],
    featured: true,
  },
  {
    title: "Healthcare Innovation Forum",
    slug: "healthcare-innovation-forum",
    category: "Events",
    client: "Healthcare Consortium",
    location: "London",
    year: "2024",
    description:
      "Clinical-grade exhibition environments with private consultation rooms and scientific content theatres.",
    coverImage: images.panel,
    tags: ["Healthcare"],
    featured: true,
  },
  {
    title: "Retail Flagship Pop-Up Pavilion",
    slug: "retail-flagship-popup",
    category: "Booths",
    client: "Premium Retail Brand",
    location: "Paris",
    year: "2024",
    description:
      "A temporary retail cathedral — modular architecture, layered merchandising, and influencer-ready moments.",
    coverImage: images.launch,
    tags: ["Retail"],
    featured: false,
  },
  {
    title: "Education Expo Campus",
    slug: "education-expo-campus",
    category: "Exhibitions",
    client: "Education Alliance",
    location: "Abu Dhabi",
    year: "2023",
    description:
      "Campus-style exhibition district with wayfinding, student journey narratives, and institutional lounges.",
    coverImage: images.networking,
    tags: ["Education"],
    featured: false,
  },
];

export const fallbackTestimonials = [
  {
    name: "A. Rahman",
    role: "Director of Brand Experiences",
    company: "Regional Conglomerate",
    content:
      "Project S7 delivered a pavilion that redefined how our organisation shows up on the international stage. Precision, calm under pressure, and creative excellence end to end.",
    rating: 5,
  },
  {
    name: "S. Chen",
    role: "Head of Events EMEA",
    company: "Global Technology Firm",
    content:
      "From design to live show, the team operated like an extension of our brand. The production quality was world-class and the stakeholder management impeccable.",
    rating: 5,
  },
  {
    name: "M. Al-Farsi",
    role: "Exhibition Committee Chair",
    company: "National Trade Authority",
    content:
      "They handled complexity with elegance — multi-vendor, multi-ministry requirements met without compromising the visitor experience.",
    rating: 5,
  },
  {
    name: "L. Moreau",
    role: "Marketing Director",
    company: "Luxury Automotive Brand",
    content:
      "Our stand became the most photographed destination on the floor. Design ambition matched by flawless technical delivery.",
    rating: 5,
  },
];

export const fallbackFaqs = [
  {
    question: "What does Project S7 specialise in?",
    answer:
      "Project S7 is a premium corporate events and exhibition company specialising in exhibition management, stand design and build, event production, project management, staffing, and creative branding for high-profile clients across government, corporate, and international markets.",
    category: "General",
  },
  {
    question: "Do you work internationally?",
    answer:
      "Yes. We plan and deliver programmes across the Middle East, Europe, Asia, and beyond — coordinating local fabricators, freight, customs, venue rules, and onsite teams with a single programme office.",
    category: "General",
  },
  {
    question: "How early should we engage Project S7?",
    answer:
      "For flagship exhibitions and multi-stand programmes, we recommend engaging 6–12 months in advance. Complex international builds and national pavilions benefit from earlier strategic involvement.",
    category: "Planning",
  },
  {
    question: "Can you handle design and build only?",
    answer:
      "Absolutely. Clients may engage us for individual services — design, build, production, staffing, or full turnkey management — depending on internal capabilities and partner ecosystems.",
    category: "Services",
  },
  {
    question: "How do quotes and budgets work?",
    answer:
      "Submit a quote request with scope, dates, and location. We respond with a structured proposal covering creative direction, operational plan, timeline, and transparent investment breakdown.",
    category: "Commercial",
  },
  {
    question: "Do you provide onsite show support?",
    answer:
      "Yes. Every major programme includes an onsite command presence for maintenance, visitor experience, technical show-calling, and rapid issue resolution throughout the event.",
    category: "Operations",
  },
  {
    question: "What industries do you serve?",
    answer:
      "Government, corporate, international trade, healthcare, education, technology, automotive, and retail. Each sector has dedicated experience frameworks and compliance considerations.",
    category: "Industries",
  },
  {
    question: "How do you approach sustainability?",
    answer:
      "We prioritise modular systems, reusable materials, responsible freight planning, and energy-conscious lighting where programme requirements allow — without sacrificing brand ambition.",
    category: "Sustainability",
  },
];

export const fallbackIndustries = [
  {
    title: "Government",
    slug: "government",
    description:
      "National pavilions, ministerial programmes, protocol-sensitive hosting, and public-sector showcases delivered with discretion and precision.",
    image: images.architecture,
  },
  {
    title: "Corporate",
    slug: "corporate",
    description:
      "Brand experiences, AGMs, leadership summits, product launches, and internal culture events with executive polish.",
    image: images.briefing,
  },
  {
    title: "International",
    slug: "international",
    description:
      "Cross-border trade exhibitions, multi-city roadshows, and market-entry experiences with global logistics mastery.",
    image: images.expo,
  },
  {
    title: "Healthcare",
    slug: "healthcare",
    description:
      "Scientific congresses, medical device expos, and clinical brand environments that balance rigour with hospitality.",
    image: images.healthcare,
  },
  {
    title: "Education",
    slug: "education",
    description:
      "Institutional expos, campus forums, and student-facing experiences that inspire and inform.",
    image: images.education,
  },
  {
    title: "Technology",
    slug: "technology",
    description:
      "Demo theatres, innovation labs, and product storytelling platforms for software and hardware leaders.",
    image: images.technology,
  },
  {
    title: "Automotive",
    slug: "automotive",
    description:
      "Vehicle launches, motorsport hospitality, and sculptural stand architecture for premium mobility brands.",
    image: images.automotive,
  },
  {
    title: "Retail",
    slug: "retail",
    description:
      "Pop-up cathedrals, experiential store formats, and seasonal exhibition commerce worlds.",
    image: images.retail,
  },
];

export const fallbackJobs = [
  {
    title: "Senior Project Manager – Exhibitions",
    slug: "senior-project-manager-exhibitions",
    department: "Delivery",
    location: "Hybrid / Regional Hub",
    type: "Full-time",
    description:
      "Lead multi-stakeholder exhibition programmes from award to debrief. Own timelines, budgets, client relationships, and quality standards across design and build workstreams.",
    requirements:
      "5+ years in exhibitions or complex live events. Outstanding client communication. Comfort with international logistics. Fluent English; additional languages valued.",
    benefits: "Competitive package, professional development, international project exposure, collaborative studio culture.",
  },
  {
    title: "Exhibition Designer",
    slug: "exhibition-designer",
    department: "Creative",
    location: "Studio",
    type: "Full-time",
    description:
      "Create spatial concepts, 3D visualisations, and technical packages for landmark stands and pavilions.",
    requirements:
      "Proficiency in Rhino/3ds Max/SketchUp and Adobe suite. Strong portfolio in spatial or exhibition design. Material and construction literacy.",
    benefits: "Mentorship, high-profile portfolio work, flexible studio environment.",
  },
  {
    title: "Onsite Production Lead",
    slug: "onsite-production-lead",
    department: "Production",
    location: "Travel Required",
    type: "Full-time",
    description:
      "Command live-show environments — install supervision, QA, technical coordination, and client facing presence during events.",
    requirements:
      "Hands-on production background. Calm under pressure. Willingness to travel extensively. Safety certifications preferred.",
    benefits: "Travel stipend, per diem, global event access, growth path to production direction.",
  },
];

export const aboutContent = {
  story:
    "Project S7 was founded on a singular belief: that corporate exhibitions and events deserve the same strategic rigor and visual excellence as the world’s finest brands. What began as a specialised exhibition studio has grown into a full-spectrum events partner for government institutions, global enterprises, and ambitious scale-ups.",
  storyContinued:
    "Today we design, build, and manage experiences that define markets and elevate organisations. Our teams operate with architectural sensibility, production precision, and hospitality intelligence — always measuring success by the quality of human connection created in every square metre of space.",
  mission:
    "To craft landmark event and exhibition experiences that advance brands, open markets, and set new standards for live engagement.",
  vision:
    "To be the defining luxury partner for organisations that treat their live presence as a strategic asset — across regions, industries, and formats.",
  values: [
    {
      title: "Precision",
      text: "Every detail is deliberate — from lighting temperature to handover timing. Excellence is operational, not ornamental.",
    },
    {
      title: "Integrity",
      text: "Transparent commercial practice, honest timelines, and fiduciary care for client budgets and reputations.",
    },
    {
      title: "Creativity",
      text: "Original spatial storytelling that earns attention without excess. Bold ideas, disciplined execution.",
    },
    {
      title: "Partnership",
      text: "We embed as an extension of client teams — accountable, responsive, and invested in shared success.",
    },
  ],
  timeline: [
    { year: "2018", title: "Foundations", text: "Project S7 established with a focus on premium exhibition design and project leadership." },
    { year: "2020", title: "Full-Service Evolution", text: "Expanded into production, staffing, and end-to-end exhibition management for multi-market clients." },
    { year: "2022", title: "International Delivery", text: "First pan-regional programme portfolio spanning GCC, Europe, and Asia Pacific." },
    { year: "2024", title: "Landmark Pavilions", text: "Delivered flagship national and corporate pavilions recognised for design and operational excellence." },
    { year: "2026", title: "Next Horizon", text: "Investing in sustainable systems, immersive formats, and data-informed experience design." },
  ],
  leadership: [
    { name: "Creative Direction", role: "Studio Leadership", text: "Leads spatial narrative and brand world-building across flagship programmes.", image: images.leadership },
    { name: "Programme Office", role: "Delivery Leadership", text: "Owns governance, risk, and multi-workstream clarity for complex exhibitions.", image: images.team },
    { name: "Production", role: "Technical Leadership", text: "Commands live environments, technical standards, and show-call excellence.", image: images.stage },
  ],
};

export const whyUs = [
  {
    title: "End-to-End Ownership",
    text: "Strategy, design, build, production, and people — one accountable partner from first sketch to final debrief.",
    icon: "Layers",
  },
  {
    title: "Luxury Craft Standards",
    text: "Materials, light, finish, and hospitality calibrated to executive and VIP expectations.",
    icon: "Gem",
  },
  {
    title: "International Fluency",
    text: "Venue rules, logistics corridors, and cultural protocols mastered across markets.",
    icon: "Globe2",
  },
  {
    title: "Calm Under Complexity",
    text: "Multi-stakeholder programmes delivered with clarity, composure, and zero drama for clients.",
    icon: "Shield",
  },
  {
    title: "Measurable Outcomes",
    text: "Lead pathways, content capture, and post-event insight embedded into every experience.",
    icon: "LineChart",
  },
  {
    title: "Creative Distinctiveness",
    text: "Spaces that stop traffic and photograph as premium brand assets for years.",
    icon: "Sparkles",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    text: "We align on brand ambition, commercial goals, audience, constraints, and success measures.",
  },
  {
    step: "02",
    title: "Design",
    text: "Concepts, spatial narratives, technical pathways, and operational architecture take form.",
  },
  {
    step: "03",
    title: "Develop",
    text: "Detailed design, vendor orchestration, budgets, logistics, and rehearsal planning.",
  },
  {
    step: "04",
    title: "Deliver",
    text: "Installation, live show command, hospitality excellence, and real-time adaptation.",
  },
  {
    step: "05",
    title: "Define",
    text: "Debrief, analytics, content archives, and recommendations for the next horizon.",
  },
];
