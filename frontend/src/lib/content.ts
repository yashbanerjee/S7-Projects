/**
 * Client-supplied photography from the Project S7 company profile.
 * Files live in /public/images so they can be replaced without touching components.
 */
export const images = {
  hero: "/images/hero.jpg",
  heroAlt: "/images/stage.jpg",
  about: "/images/about.jpg",
  aboutWide: "/images/expo-hall.jpg",
  process: "/images/services/project-management.jpg",
  cta: "/images/cta.jpg",
  contact: "/images/services/project-management-3.jpg",
  careers: "/images/services/project-management.jpg",
  culture: "/images/services/speaker-vip.jpg",
  leadership: "/images/services/project-management-2.jpg",
  networking: "/images/services/speaker-vip.jpg",
  stage: "/images/stage.jpg",
  booth: "/images/services/stand-design.jpg",
  build: "/images/about-build.jpg",
  hospitality: "/images/services/speaker-vip.jpg",
  awards: "/images/stage.jpg",
  expo: "/images/expo-hall.jpg",
  architecture: "/images/hero.jpg",
  team: "/images/services/project-management.jpg",
  lighting: "/images/stage.jpg",
  conference: "/images/services/project-management.jpg",
  gala: "/images/services/speaker-vip.jpg",
  celebration: "/images/stage.jpg",
  dinner: "/images/services/speaker-vip.jpg",
  lightsCrowd: "/images/stage.jpg",
  briefing: "/images/services/project-management-3.jpg",
  panel: "/images/services/project-management-2.jpg",
  launch: "/images/services/stand-design-2.jpg",
  skyline: "/images/hero.jpg",
  automotive: "/images/about-build.jpg",
  retail: "/images/services/stand-design-2.jpg",
  education: "/images/expo-hall.jpg",
  healthcare: "/images/services/exhibition-management.jpg",
  technology: "/images/services/stand-design.jpg",
  keynoteHall: "/images/about.jpg",
  tradeMachinery: "/images/services/stand-build-2.jpg",
  designStudio: "/images/services/stand-design-3.jpg",
  brandCraft: "/images/services/stand-design-2.jpg",
  dealClose: "/images/services/project-management-2.jpg",
  programmeBoard: "/images/services/project-management.jpg",
  hostCrew: "/images/services/speaker-vip.jpg",
  productionCrowd: "/images/stage.jpg",
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

export const serviceImages: Record<string, string> = {
  "exhibition-management": "/images/services/exhibition-management.jpg",
  "exhibition-stand-design": "/images/services/stand-design.jpg",
  "exhibition-stand-build": "/images/services/stand-build.jpg",
  "project-management": "/images/services/project-management.jpg",
  "speaker-management": "/images/services/speaker-vip.jpg",
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
  "exhibition-management": [
    "/images/services/exhibition-management.jpg",
    "/images/services/exhibition-management-2.jpg",
    "/images/services/exhibition-management-3.jpg",
  ],
  "exhibition-stand-design": [
    "/images/services/stand-design.jpg",
    "/images/services/stand-design-2.jpg",
    "/images/services/stand-design-3.jpg",
  ],
  "exhibition-stand-build": [
    "/images/services/stand-build.jpg",
    "/images/services/stand-build-2.jpg",
    "/images/services/stand-build-3.jpg",
  ],
  "project-management": [
    "/images/services/project-management.jpg",
    "/images/services/project-management-2.jpg",
    "/images/services/project-management-3.jpg",
  ],
  "speaker-management": [
    "/images/services/speaker-vip.jpg",
    "/images/services/speaker-vip-2.jpg",
    "/images/services/speaker-vip-3.jpg",
  ],
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
    title: "Project Management & Consultancy",
    slug: "project-management",
    description:
      "We provide strategic oversight and hands-on project management for events, exhibitions and complex projects. From initial planning to supplier coordination and on-site delivery, we ensure every element is aligned, efficiently managed and delivered to the highest standard.",
    image: images.conference,
    features: [
      "Project Planning & Scheduling",
      "Procurement & Supplier Management",
      "Technical & Operational Coordination",
      "Risk Management & Compliance",
      "Stakeholder & Client Management",
      "On-Site Project Delivery",
      "Project Reporting & Close-Out",
    ],
  },
  {
    title: "Speaker Management & VIP Services",
    slug: "speaker-management",
    description:
      "We provide comprehensive speaker and VIP coordination for conferences, summits and corporate events. From travel arrangements and speaker briefings to on-site coordination and green room management, we ensure a seamless and professional experience for every speaker, guest and VIP.",
    image: serviceImages["speaker-management"],
    features: [
      "Speaker Liaison & Communication",
      "Speaker Travel & Accommodation Coordination",
      "Speaker Scheduling & Briefings",
      "Presentation & Session Coordination",
      "Green Room Management",
      "Stage & Speaker Movement Coordination",
      "VIP Guest Management & Protocol",
      "Airport Transfers & Ground Transportation",
      "Speaker Registration & Accreditation",
    ],
  },
];

/** Placeholder — real projects added when approved for public release */
export const fallbackPortfolio: Array<{
  title: string;
  slug: string;
  category: string;
  client?: string;
  location?: string;
  year?: string;
  description: string;
  coverImage: string;
  tags?: string[];
  featured?: boolean;
}> = [];

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
