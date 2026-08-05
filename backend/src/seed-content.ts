/**
 * Lightweight CMS seed — upserts refresh stock Pexels imagery on boot.
 * All IDs visually verified for event / exhibition / production / hospitality themes.
 * Source: https://www.pexels.com
 */
import type { PrismaClient } from "@prisma/client";

const px = (id: number | string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/** Event-themed stills used across CMS rows */
const S = {
  expo: px(2774556), // blue-lit keynote audience
  conference: px(1708988), // professional conference seating
  booth: px(1540406), // stage structure / spatial event design
  stage: px(2263436), // arena production LED
  lights: px(2747449), // concert beams
  speaker: px(3321793), // on-stage keynote
  network: px(2422290), // hosted networking
  seminar: px(7648047), // engaged attendees
  workshop: px(2608517), // live host workshop
  production: px(2608519), // camera / production craft
  gala: px(2306281), // banquet tables
  celebration: px(3171837), // toast + confetti
  dining: px(587741), // catering display
  festival: px(1190297), // outdoor show atmosphere
  launch: px(1763075), // show launch energy
  awards: px(713149), // theatre curtains
  show: px(167636), // band stage silhouette
};

export async function seedContent(prisma: PrismaClient) {
  const services = [
    {
      title: "Exhibition Management",
      slug: "exhibition-management",
      tagline: "End-to-end exhibition excellence",
      description:
        "From concept to closing night, Project S7 orchestrates seamless exhibition programmes that captivate audiences and deliver measurable brand impact.",
      overview: "Full lifecycle exhibition management for expos, trade shows, and brand showcases.",
      image: S.expo,
      icon: "Layers",
      order: 1,
      featured: true,
    },
    {
      title: "Exhibition Stand Design",
      slug: "exhibition-stand-design",
      tagline: "Architecture that stops traffic",
      description:
        "We design exhibition stands as architectural brand statements — cinematic form, intelligent flow, and materials that photograph beautifully.",
      image: S.booth,
      icon: "PenTool",
      order: 2,
      featured: true,
    },
    {
      title: "Exhibition Stand Build",
      slug: "exhibition-stand-build",
      tagline: "Precision craftsmanship at show pace",
      description:
        "Our build teams turn approved designs into immaculate physical environments — on time and on brand.",
      image: S.production,
      icon: "Hammer",
      order: 3,
      featured: true,
    },
    {
      title: "Project Management",
      slug: "project-management",
      tagline: "Clarity under complexity",
      description:
        "Dedicated project directors who hold budgets, timelines, stakeholders, and creative delivery together.",
      image: S.seminar,
      icon: "Kanban",
      order: 4,
      featured: true,
    },
    {
      title: "Event Staffing",
      slug: "event-staffing",
      tagline: "People who elevate every interaction",
      description:
        "Trained hosts, brand ambassadors, technical crew, and VIP stewards with polish and warmth.",
      image: S.network,
      icon: "Users",
      order: 5,
      featured: false,
    },
    {
      title: "Event Production",
      slug: "event-production",
      tagline: "Stage, light, sound — cinematic delivery",
      description:
        "Full technical production for conferences, award nights, product launches, and hybrid experiences.",
      image: S.stage,
      icon: "Clapperboard",
      order: 6,
      featured: true,
    },
    {
      title: "Creative & Branding",
      slug: "creative-branding",
      tagline: "Identity systems for live brand worlds",
      description:
        "Visual identity, spatial graphics, and campaign assets that make exhibitions unforgettable.",
      image: S.launch,
      icon: "Sparkles",
      order: 7,
      featured: false,
    },
    {
      title: "Capabilities",
      slug: "capabilities",
      tagline: "A full production ecosystem",
      description:
        "An integrated suite covering design, build, AV, logistics, hospitality, and measurement.",
      image: S.lights,
      icon: "Orbit",
      order: 8,
      featured: false,
    },
    {
      title: "Future Services",
      slug: "future-services",
      tagline: "Next-generation event experiences",
      description:
        "Immersive XR, data-driven experience design, sustainable builds, and AI-assisted engagement.",
      image: S.speaker,
      icon: "Rocket",
      order: 9,
      featured: false,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        image: s.image,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        overview: s.overview,
        icon: s.icon,
        order: s.order,
        featured: s.featured,
      },
      create: s,
    });
  }

  const existingFaqs = await prisma.fAQ.count();
  if (existingFaqs === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "What does Project S7 specialise in?",
          answer:
            "Project S7 is a premium corporate events and exhibition company specialising in exhibition management, stand design & build, event production, and project management.",
          category: "General",
          order: 1,
        },
        {
          question: "Do you work internationally?",
          answer:
            "Yes. We plan and deliver programmes across the Middle East, Europe, Asia, and beyond.",
          category: "General",
          order: 2,
        },
        {
          question: "How do quotes and budgets work?",
          answer:
            "Submit a quote request with scope, dates, and location. We respond with a structured proposal and transparent investment breakdown.",
          category: "Commercial",
          order: 3,
        },
      ],
    });
  }

  const industries = [
    {
      title: "Government",
      slug: "government",
      description: "National pavilions and protocol-sensitive programmes.",
      image: S.conference,
      order: 1,
    },
    {
      title: "Corporate",
      slug: "corporate",
      description: "Brand experiences, summits, and product launches.",
      image: S.seminar,
      order: 2,
    },
    {
      title: "Healthcare",
      slug: "healthcare",
      description: "Scientific congresses and clinical brand environments.",
      image: S.speaker,
      order: 3,
    },
    {
      title: "Technology",
      slug: "technology",
      description: "Demo theatres and innovation lab experiences.",
      image: S.stage,
      order: 4,
    },
    {
      title: "Automotive",
      slug: "automotive",
      description: "Vehicle launches and sculptural stand architecture.",
      image: S.show,
      order: 5,
    },
    {
      title: "Retail",
      slug: "retail",
      description: "Pop-up and experiential retail formats.",
      image: S.dining,
      order: 6,
    },
    {
      title: "Education",
      slug: "education",
      description: "Institutional expos and campus forums.",
      image: S.workshop,
      order: 7,
    },
    {
      title: "International",
      slug: "international",
      description: "Cross-border trade exhibitions and roadshows.",
      image: S.festival,
      order: 8,
    },
  ];
  for (const i of industries) {
    await prisma.industry.upsert({
      where: { slug: i.slug },
      update: { image: i.image, description: i.description, title: i.title, order: i.order },
      create: i,
    });
  }

  const portfolioItems = [
    {
      title: "National Infrastructure Expo Pavilion",
      slug: "national-infrastructure-expo",
      category: "Exhibitions",
      client: "Government Client",
      location: "Riyadh",
      year: "2025",
      description:
        "A monumental pavilion experience integrating interactive product stories and broadcast-ready stages.",
      coverImage: S.expo,
      tags: ["Pavilion", "Government"],
      featured: true,
      order: 1,
    },
    {
      title: "Luxury Automotive Brand Experience",
      slug: "luxury-automotive-brand-experience",
      category: "Booths",
      client: "Global Auto Brand",
      location: "Dubai",
      year: "2025",
      description:
        "Sculptural stand design with kinetic lighting and invitation-only hospitality suites.",
      coverImage: S.booth,
      tags: ["Automotive", "Hospitality"],
      featured: true,
      order: 2,
    },
    {
      title: "Global Tech Leadership Summit",
      slug: "global-tech-leadership-summit",
      category: "Corporate",
      client: "Fortune 500 Technology",
      location: "Singapore",
      year: "2024",
      description:
        "Three-day executive summit with main stage production and seamless hybrid streaming.",
      coverImage: S.stage,
      tags: ["Summit", "Hybrid"],
      featured: true,
      order: 3,
    },
    {
      title: "Healthcare Innovation Forum",
      slug: "healthcare-innovation-forum",
      category: "Events",
      client: "Healthcare Consortium",
      location: "London",
      year: "2024",
      description:
        "Scientific content theatres with private consultation suites and brand hospitality.",
      coverImage: S.speaker,
      tags: ["Healthcare"],
      featured: true,
      order: 4,
    },
    {
      title: "Retail Flagship Pop-Up Pavilion",
      slug: "retail-flagship-popup",
      category: "Booths",
      client: "Premium Retail Brand",
      location: "Paris",
      year: "2024",
      description:
        "A temporary retail cathedral — modular architecture and influencer-ready moments.",
      coverImage: S.gala,
      tags: ["Retail"],
      featured: true,
      order: 5,
    },
    {
      title: "Education Expo Campus",
      slug: "education-expo-campus",
      category: "Exhibitions",
      client: "Education Alliance",
      location: "Abu Dhabi",
      year: "2023",
      description:
        "Campus-style exhibition district with student journey narratives and institutional lounges.",
      coverImage: S.workshop,
      tags: ["Education"],
      featured: true,
      order: 6,
    },
  ];

  for (const p of portfolioItems) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: {
        coverImage: p.coverImage,
        description: p.description,
        featured: p.featured,
        order: p.order,
        category: p.category,
        title: p.title,
      },
      create: {
        ...p,
        gallery: [p.coverImage, S.stage, S.gala, S.network],
      },
    });
  }
}
