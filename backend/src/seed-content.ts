/**
 * Lightweight CMS seed — upserts refresh stock Pexels imagery on boot.
 * Full seed: npm run db:seed
 * Images: https://www.pexels.com (event / exhibition focused)
 */
import type { PrismaClient } from "@prisma/client";

const px = (id: number | string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/** Event-themed stills used across CMS rows */
const S = {
  expo: px(2774556),
  conference: px(2774557),
  booth: px(5439383),
  stage: px(1540406),
  lights: px(2747449),
  speaker: px(1181406),
  network: px(3184360),
  meeting: px(3184291),
  plan: px(3184296),
  team: px(3183197),
  gala: px(2341830),
  celebration: px(3171837),
  dining: px(587741),
  build: px(3184306),
  launch: px(3184339),
  tech: px(1181533),
  architecture: px(261510),
  city: px(1029243),
  automotive: px(3321793),
  retail: px(713149),
  education: px(3184416),
  healthcare: px(3184338),
  culture: px(3184465),
  heroAlt: px(1190297),
  hall: px(7648047),
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
      image: S.build,
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
      image: S.meeting,
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
      image: S.architecture,
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
      image: S.tech,
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
      image: S.architecture,
      order: 1,
    },
    {
      title: "Corporate",
      slug: "corporate",
      description: "Brand experiences, summits, and product launches.",
      image: S.meeting,
      order: 2,
    },
    {
      title: "Healthcare",
      slug: "healthcare",
      description: "Scientific congresses and clinical brand environments.",
      image: S.healthcare,
      order: 3,
    },
    {
      title: "Technology",
      slug: "technology",
      description: "Demo theatres and innovation lab experiences.",
      image: S.tech,
      order: 4,
    },
    {
      title: "Automotive",
      slug: "automotive",
      description: "Vehicle launches and sculptural stand architecture.",
      image: S.automotive,
      order: 5,
    },
    {
      title: "Retail",
      slug: "retail",
      description: "Pop-up and experiential retail formats.",
      image: S.retail,
      order: 6,
    },
    {
      title: "Education",
      slug: "education",
      description: "Institutional expos and campus forums.",
      image: S.education,
      order: 7,
    },
    {
      title: "International",
      slug: "international",
      description: "Cross-border trade exhibitions and roadshows.",
      image: S.expo,
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
      coverImage: S.conference,
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
      coverImage: S.automotive,
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
      coverImage: S.speaker,
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
      coverImage: S.healthcare,
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
      coverImage: S.launch,
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
      coverImage: S.education,
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
