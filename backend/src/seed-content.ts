/**
 * Lightweight CMS seed used by bootstrap (safe to re-call only when empty).
 * Full seed remains available via: npm run db:seed
 */
import type { PrismaClient } from "@prisma/client";

const img = (id: string, w = 1600, h = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export async function seedContent(prisma: PrismaClient) {
  const services = [
    {
      title: "Exhibition Management",
      slug: "exhibition-management",
      tagline: "End-to-end exhibition excellence",
      description:
        "From concept to closing night, Project S7 orchestrates seamless exhibition programmes that captivate audiences and deliver measurable brand impact.",
      overview: "Full lifecycle exhibition management for expos, trade shows, and brand showcases.",
      image: img("photo-1540575467063-178a50c2df87"),
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
      image: img("photo-1558618666-fcd25c85cd64"),
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
      image: img("photo-1503387762-592deb58ef4e"),
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
      image: img("photo-1552664730-d307ca884978"),
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
      image: img("photo-1511632765486-a01980e01a18"),
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
      image: img("photo-1470229722913-7c0e2dbbafd3"),
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
      image: img("photo-1561070791-2526d30994b5"),
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
      image: img("photo-1486406146926-c627a92ad1ab"),
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
      image: img("photo-1633356122544-f134324a6cee"),
      icon: "Rocket",
      order: 9,
      featured: false,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
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

  const industryCount = await prisma.industry.count();
  if (industryCount === 0) {
    const industries = [
      { title: "Government", slug: "government", description: "National pavilions and protocol-sensitive programmes.", image: img("photo-1486406146926-c627a92ad1ab"), order: 1 },
      { title: "Corporate", slug: "corporate", description: "Brand experiences, summits, and product launches.", image: img("photo-1497366216548-37526070297c"), order: 2 },
      { title: "Healthcare", slug: "healthcare", description: "Scientific congresses and clinical brand environments.", image: img("photo-1576091160399-112ba8d25d1d"), order: 3 },
      { title: "Technology", slug: "technology", description: "Demo theatres and innovation lab experiences.", image: img("photo-1518770660439-4636190af475"), order: 4 },
      { title: "Automotive", slug: "automotive", description: "Vehicle launches and sculptural stand architecture.", image: img("photo-1492144534655-ae79c964c9d7"), order: 5 },
      { title: "Retail", slug: "retail", description: "Pop-up and experiential retail formats.", image: img("photo-1441986300917-64674bd600d8"), order: 6 },
      { title: "Education", slug: "education", description: "Institutional expos and campus forums.", image: img("photo-1523050854058-8df90110c9f1"), order: 7 },
      { title: "International", slug: "international", description: "Cross-border trade exhibitions and roadshows.", image: img("photo-1436491865332-7a61a109cc05"), order: 8 },
    ];
    for (const i of industries) {
      await prisma.industry.upsert({ where: { slug: i.slug }, update: i, create: i });
    }
  }

  const portfolioCount = await prisma.portfolio.count();
  if (portfolioCount === 0) {
    await prisma.portfolio.create({
      data: {
        title: "National Infrastructure Expo Pavilion",
        slug: "national-infrastructure-expo",
        category: "Exhibitions",
        client: "Government Client",
        location: "Riyadh",
        year: "2025",
        description:
          "A monumental pavilion experience integrating interactive product stories and broadcast-ready stages.",
        coverImage: img("photo-1540575467063-178a50c2df87", 1800, 1200),
        tags: ["Pavilion", "Government"],
        featured: true,
        order: 1,
      },
    });
  }
}
