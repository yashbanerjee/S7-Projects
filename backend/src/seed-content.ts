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
  /** Busy indoor trade-show hall */
  expo: px(35138560),
  /** Exhibition floor networking lounge */
  expoLounge: px(860227),
  /** Blue-lit auditorium keynote */
  keynote: px(2774556),
  conference: px(1181406),
  boardroom: px(1181395),
  deal: px(3184291),
  /** Styled modern brand booth interior */
  booth: px(31311125),
  stage: px(2263436),
  lights: px(2747446),
  festival: px(1540406),
  speaker: px(3321793),
  network: px(2422290),
  seminar: px(7648047),
  workshop: px(2608517),
  /** Volvo outdoor exhibition pavilion */
  production: px(12712474),
  tradeInstall: px(36522033),
  gala: px(2306281),
  celebration: px(3171837),
  dining: px(587741),
  launch: px(1763075),
  awards: px(713149),
  show: px(167636),
  designStudio: px(4348401),
  brandCraft: px(4348374),
  technology: px(19012064),
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
      gallery: [S.expo, S.expoLounge, S.keynote],
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
      gallery: [S.booth, S.production, S.designStudio],
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
      gallery: [S.production, S.tradeInstall, S.expo],
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
      image: S.conference,
      gallery: [S.conference, S.boardroom, S.deal],
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
      gallery: [S.network, S.workshop, S.seminar],
      icon: "Users",
      order: 5,
      featured: true,
    },
  ];

  const removedSlugs = [
    "event-production",
    "creative-branding",
    "capabilities",
    "future-services",
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        image: s.image,
        gallery: s.gallery,
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

  await prisma.service.deleteMany({
    where: { slug: { in: removedSlugs } },
  });

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

  // Portfolio showcase populated via admin when projects are approved for release.
}
