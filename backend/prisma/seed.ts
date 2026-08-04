import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string, w = 1600, h = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@projects7.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@S7Secure2026";
  const name = process.env.ADMIN_NAME || "Project S7 Admin";

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  const services = [
    {
      title: "Exhibition Management",
      slug: "exhibition-management",
      tagline: "End-to-end exhibition excellence",
      description:
        "From concept to closing night, Project S7 orchestrates seamless exhibition programmes that captivate audiences and deliver measurable brand impact. We manage logistics, stakeholder coordination, vendor networks, and on-site execution so your team can focus on results.",
      overview:
        "Our exhibition management service covers the full lifecycle: strategy, planning, exhibitorm operations, audience experience, VIP hosting, and post-event analytics. We specialise in international expos, national trade shows, and private brand showcases.",
      image: img("photo-1540575467063-178a50c2df87"),
      gallery: [
        img("photo-1511578314322-379afb476865"),
        img("photo-1505373877841-8d25f7d46678"),
        img("photo-1492684223066-81342ee5ff30"),
      ],
      icon: "Layers",
      order: 1,
      featured: true,
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
      overview:
        "Concept development, 3D visualisation, materials specification, and technical drawings. Every design balances amenity spaces, product storytelling, lead capture, and hospitality.",
      image: img("photo-1558618666-fcd25c85cd64"),
      gallery: [
        img("photo-1497366216548-37526070297c"),
        img("photo-1497366811353-6870744d04b2"),
        img("photo-1486406146926-c627a92ad1ab"),
      ],
      icon: "PenTool",
      order: 2,
      featured: true,
      process: [
        { step: "01", title: "Brief", text: "Brand codes, product hierarchy, and visitor journey." },
        { step: "02", title: "Concept", text: "Mood, form language, and spatial narrative." },
        { step: "03", title: "Develop", text: "3D, materials, lighting, and technical packs." },
        { step: "04", title: "Approve", text: "Iterations with stakeholders until sign-off." },
      ],
      benefits: ["Bespoke brand architecture", "Lead-focused layouts", "Photogenic spaces", "Build-ready documentation"],
      features: ["Concept boards", "3D renders", "Material libraries", "Lighting design"],
    },
    {
      title: "Exhibition Stand Build",
      slug: "exhibition-stand-build",
      tagline: "Precision craftsmanship at show pace",
      description:
        "Our build teams turn approved designs into immaculate physical environments — on time, on brand, and engineered for multi-day operations.",
      overview:
        "Fabrication, logistics, installation, live show support, and deconstruction. We coordinate unions, venues, and schedules across domestic and international markets.",
      image: img("photo-1503387762-592deb58ef4e"),
      gallery: [
        img("photo-1504307651254-35680f356dfd"),
        img("photo-1581094794329-c8112a89af12"),
        img("photo-1598488035139-bdbb2231ce04"),
      ],
      icon: "Hammer",
      order: 3,
      featured: true,
      process: [
        { step: "01", title: "Fabricate", text: "Workshop quality control and modular assembly." },
        { step: "02", title: "Logistics", text: "Freight, customs, and venue access planning." },
        { step: "03", title: "Install", text: "Night build crews with strict QA checkpoints." },
        { step: "04", title: "Support", text: "Live show maintenance and graceful teardown." },
      ],
      benefits: ["Reliable live-show delivery", "International build capability", "Strict finishing standards", "Full liability coverage"],
      features: ["Modular systems", "Custom joinery", "AV integration", "Onsite supervision"],
    },
    {
      title: "Project Management",
      slug: "project-management",
      tagline: "Clarity under complexity",
      description:
        "Dedicated project directors who hold the entire programme together — budgets, timelines, stakeholders, and creative delivery.",
      overview:
        "Governance frameworks, risk registers, cost control, and transparent reporting. Ideal for multi-city roadshows, multi-stand campaigns, and hybrid programmes.",
      image: img("photo-1552664730-d307ca884978"),
      gallery: [img("photo-1600880292203-757bb62b4baf"), img("photo-1556761175-b413da4baf72")],
      icon: "Kanban",
      order: 4,
      featured: true,
      process: [
        { step: "01", title: "Scope", text: "Define outcomes, constraints, and success criteria." },
        { step: "02", title: "Plan", text: "Workstreams, owners, budgets, and critical path." },
        { step: "03", title: "Control", text: "Weekly governance, risk, and change control." },
        { step: "04", title: "Close", text: "Handover, reporting, and lessons learned." },
      ],
      benefits: ["Single programme office", "Budget transparency", "Stakeholder confidence", "Predictable delivery"],
      features: ["RAID logs", "Budget tracking", "Vendor SQA", "Executive reporting"],
    },
    {
      title: "Event Staffing",
      slug: "event-staffing",
      tagline: "People who elevate every interaction",
      description:
        "Trained hosts, brand ambassadors, technical crew, and VIP stewards who represent your brand with polish and warmth.",
      overview:
        "Recruitment, briefing, uniforming, and onsite management of front-of-house and production teams for expos, launches, and conferences.",
      image: img("photo-1511632765486-a01980e01a18"),
      gallery: [img("photo-1528605248644-14dd04022da1"), img("photo-1475721027785-f74eccf877e2")],
      icon: "Users",
      order: 5,
      featured: false,
      process: [
        { step: "01", title: "Profile", text: "Role requirements aligned to brand tone." },
        { step: "02", title: "Cast", text: "Vetting and selection for skill and presence." },
        { step: "03", title: "Brief", text: "Product, protocol, and scenario training." },
        { step: "04", title: "Deploy", text: "Shift management and quality supervision." },
      ],
      benefits: ["Brand-aligned talent", "Multilingual options", "Full supervision", "Flexible scaling"],
      features: ["Hosts & ambassadors", "Registration teams", "Technical crew", "Protocol officers"],
    },
    {
      title: "Event Production",
      slug: "event-production",
      tagline: "Stage, light, sound — cinematic delivery",
      description:
        "Full technical production for conferences, award nights, product launches, and hybrid experiences.",
      overview:
        "Stage design, lighting direction, sound engineering, LED environments, streaming, and show-calling for flawless live runs.",
      image: img("photo-1470229722913-7c0e2dbbafd3"),
      gallery: [img("photo-1492684223066-81342ee5ff30"), img("photo-1514525253161-7a46d19cd819")],
      icon: "Clapperboard",
      order: 6,
      featured: true,
      process: [
        { step: "01", title: "Creative", text: "Show concept and technical approach." },
        { step: "02", title: "Plot", text: "Lighting, AV, staging, and run-of-show." },
        { step: "03", title: "Rehearse", text: "Cue-to-cue and full dress rehearsals." },
        { step: "04", title: "Perform", text: "Show calling and live adjustments." },
      ],
      benefits: ["World-class technical standard", "Hybrid capability", "Trusted show-callers", "Creative direction"],
      features: ["LED walls", "Lighting design", "Broadcast", "Artist liaison"],
    },
    {
      title: "Creative & Branding",
      slug: "creative-branding",
      tagline: "Identity systems for live brand worlds",
      description:
        "Visual identity, spatial graphics, content systems, and campaign assets that make exhibitions unforgettable.",
      overview:
        "From brand toolkits to motion graphics and environmental wayfinding — creative that performs in real space and on camera.",
      image: img("photo-1561070791-2526d30994b5"),
      gallery: [img("photo-1558655146-d09347e92766"), img("photo-1626785774573-4b7993143465")],
      icon: "Sparkles",
      order: 7,
      featured: false,
      process: [
        { step: "01", title: "Audit", text: "Brand assets and opportunity mapping." },
        { step: "02", title: "System", text: "Visual language for space and media." },
        { step: "03", title: "Create", text: "Graphics, motion, and content production." },
        { step: "04", title: "Apply", text: "Consistent rollout across environments." },
      ],
      benefits: ["Cohesive brand worlds", "Content-ready assets", "Photo-worthy detailing", "Campaign extendability"],
      features: ["Spatial graphics", "Motion", "Print & digital", "Brand guidelines"],
    },
    {
      title: "Capabilities",
      slug: "capabilities",
      tagline: "A full production ecosystem",
      description:
        "An integrated suite of specialist partners and internal teams covering design, build, AV, logistics, hospitality, and measurement.",
      overview:
        "One relationship unlocks a complete exhibition and events ecosystem — designed for brands that expect clarity, quality, and speed.",
      image: img("photo-1486406146926-c627a92ad1ab"),
      gallery: [img("photo-1497366754035-f200968a6e72"), img("photo-1497366216548-37526070297c")],
      icon: "Orbit",
      order: 8,
      featured: false,
      process: [
        { step: "01", title: "Map", text: "Capability needs against programme goals." },
        { step: "02", title: "Assemble", text: "Right team and specialist partners." },
        { step: "03", title: "Integrate", text: "One plan, one brand standard." },
        { step: "04", title: "Deliver", text: "Unified programme delivery." },
      ],
      benefits: ["Fewer vendors, higher control", "Consistent quality bar", "Faster mobilisation", "Global reach"],
      features: ["Design studio", "Build workshops", "AV network", "Hospitality partners"],
    },
    {
      title: "Future Services",
      slug: "future-services",
      tagline: "Next-generation event experiences",
      description:
        "Emerging formats: immersive XR booths, data-driven experience design, sustainable builds, and AI-assisted engagement.",
      overview:
        "We invest in future-ready formats so forward-looking brands can lead the conversation on the exhibition floor.",
      image: img("photo-1633356122544-f134324a6cee"),
      gallery: [img("photo-1550751827-4bd374c3f58b"), img("photo-1485827404703-89b55fcc595e")],
      icon: "Rocket",
      order: 9,
      featured: false,
      process: [
        { step: "01", title: "Explore", text: "Opportunity workshops with brand teams." },
        { step: "02", title: "Pilot", text: "Controlled pilot at a flagship event." },
        { step: "03", title: "Measure", text: "Engagement and lead quality metrics." },
        { step: "04", title: "Scale", text: "Multi-market rollout of proven formats." },
      ],
      benefits: ["Differentiation", "Sustainability pathways", "Digital-physical fusion", "Early-adopter advantage"],
      features: ["Immersive tech", "Lead intelligence", "Green materials", "Hybrid formats"],
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  const portfolio = [
    {
      title: "National Infrastructure Expo Pavilion",
      slug: "national-infrastructure-expo",
      category: "Exhibitions",
      client: "Government Client",
      location: "Riyadh",
      year: "2025",
      description:
        "A monumental pavilion experience integrating interactive product stories, VIP lounges, and broadcast-ready stages for a flagship national infrastructure showcase.",
      coverImage: img("photo-1540575467063-178a50c2df87", 1800, 1200),
      gallery: [
        img("photo-1511578314322-379afb476865"),
        img("photo-1505373877841-8d25f7d46678"),
        img("photo-1492684223066-81342ee5ff30"),
      ],
      tags: ["Pavilion", "Government", "Interactive"],
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
        "Sculptural stand design with kinetic lighting, precision vehicle staging, and invitation-only hospitality suites.",
      coverImage: img("photo-1492144534655-ae79c964c9d7", 1800, 1200),
      gallery: [img("photo-1503376780353-7e6692767b70"), img("photo-1549317661-bd32c8ce0db2")],
      tags: ["Automotive", "Hospitality", "Lighting"],
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
        "Three-day executive summit with main stage production, breakout architecture, and seamless hybrid streaming.",
      coverImage: img("photo-1475721027785-f74eccf877e2", 1800, 1200),
      gallery: [img("photo-1505373877841-8d25f7d46678"), img("photo-1544531585-9847b68c8c86")],
      tags: ["Summit", "Hybrid", "AV"],
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
        "Clinical-grade exhibition environments with private consultation rooms and scientific content theatres.",
      coverImage: img("photo-1576091160399-112ba8d25d1d", 1800, 1200),
      gallery: [img("photo-1519494026892-80bbd2d6fd0d"), img("photo-1631815588090-d4bfec5b1ccb")],
      tags: ["Healthcare", "Forum", "Experience"],
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
        "A temporary retail cathedral — modular architecture, layered merchandising, and influencer-ready moments.",
      coverImage: img("photo-1441986300917-64674bd600d8", 1800, 1200),
      gallery: [img("photo-1445205170230-053b83016050"), img("photo-1469334031218-e382a71b716b")],
      tags: ["Retail", "Pop-up", "Modular"],
      featured: false,
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
        "Campus-style exhibition district with wayfinding, student journey narratives, and institutional lounges.",
      coverImage: img("photo-1523050854058-8df90110c9f1", 1800, 1200),
      gallery: [img("photo-1524178232363-1fb2b075b655"), img("photo-1427504494785-3a9ca7044f45")],
      tags: ["Education", "Campus", "Wayfinding"],
      featured: false,
      order: 6,
    },
  ];

  for (const p of portfolio) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  const testimonials = [
    {
      name: "A. Rahman",
      role: "Director of Brand Experiences",
      company: "Regional Conglomerate",
      content:
        "Project S7 delivered a pavilion that redefined how our organisation shows up on the international stage. Precision, calm under pressure, and creative excellence end to end.",
      rating: 5,
      order: 1,
    },
    {
      name: "S. Chen",
      role: "Head of Events EMEA",
      company: "Global Technology Firm",
      content:
        "From design to live show, the team operated like an extension of our brand. The production quality was world-class and the stakeholder management impeccable.",
      rating: 5,
      order: 2,
    },
    {
      name: "M. Al-Farsi",
      role: "Exhibition Committee Chair",
      company: "National Trade Authority",
      content:
        "They handled complexity with elegance — multi-vendor, multi-ministry requirements met without compromising the visitor experience.",
      rating: 5,
      order: 3,
    },
    {
      name: "L. Moreau",
      role: "Marketing Director",
      company: "Luxury Automotive Brand",
      content:
        "Our stand became the most photographed destination on the floor. Design ambition matched by flawless technical delivery.",
      rating: 5,
      order: 4,
    },
  ];

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: testimonials });

  const faqs = [
    {
      question: "What does Project S7 specialise in?",
      answer:
        "Project S7 is a premium corporate events and exhibition company specialising in exhibition management, stand design and build, event production, project management, staffing, and creative branding for high-profile clients across government, corporate, and international markets.",
      category: "General",
      order: 1,
    },
    {
      question: "Do you work internationally?",
      answer:
        "Yes. We plan and deliver programmes across the Middle East, Europe, Asia, and beyond — coordinating local fabricators, freight, customs, venue rules, and onsite teams with a single programme office.",
      category: "General",
      order: 2,
    },
    {
      question: "How early should we engage Project S7?",
      answer:
        "For flagship exhibitions and multi-stand programmes, we recommend engaging 6–12 months in advance. Complex international builds and national pavilions benefit from earlier strategic involvement.",
      category: "Planning",
      order: 3,
    },
    {
      question: "Can you handle design and build only?",
      answer:
        "Absolutely. Clients may engage us for individual services — design, build, production, staffing, or full turnkey management — depending on internal capabilities and partner ecosystems.",
      category: "Services",
      order: 4,
    },
    {
      question: "How do quotes and budgets work?",
      answer:
        "Submit a quote request with scope, dates, and location. We respond with a structured proposal covering creative direction, operational plan, timeline, and transparent investment breakdown.",
      category: "Commercial",
      order: 5,
    },
    {
      question: "Do you provide onsite show support?",
      answer:
        "Yes. Every major programme includes an onsite command presence for maintenance, visitor experience, technical show-calling, and rapid issue resolution throughout the event.",
      category: "Operations",
      order: 6,
    },
    {
      question: "What industries do you serve?",
      answer:
        "Government, corporate, international trade, healthcare, education, technology, automotive, and retail. Each sector has dedicated experience frameworks and compliance considerations.",
      category: "Industries",
      order: 7,
    },
    {
      question: "How do you approach sustainability?",
      answer:
        "We prioritise modular systems, reusable materials, responsible freight planning, and energy-conscious lighting where programme requirements allow — without sacrificing brand ambition.",
      category: "Sustainability",
      order: 8,
    },
  ];

  await prisma.fAQ.deleteMany();
  await prisma.fAQ.createMany({ data: faqs });

  const industries = [
    { title: "Government", slug: "government", description: "National pavilions, ministerial programmes, protocol-sensitive hosting, and public-sector showcases delivered with discretion and precision.", image: img("photo-1486406146926-c627a92ad1ab"), order: 1 },
    { title: "Corporate", slug: "corporate", description: "Brand experiences, AGMs, leadership summits, product launches, and internal culture events with executive polish.", image: img("photo-1497366216548-37526070297c"), order: 2 },
    { title: "International", slug: "international", description: "Cross-border trade exhibitions, multi-city roadshows, and market-entry experiences with global logistics mastery.", image: img("photo-1436491865332-7a61a109cc05"), order: 3 },
    { title: "Healthcare", slug: "healthcare", description: "Scientific congresses, medical device expos, and clinical brand environments that balance rigour with hospitality.", image: img("photo-1576091160399-112ba8d25d1d"), order: 4 },
    { title: "Education", slug: "education", description: "Institutional expos, campus forums, and student-facing experiences that inspire and inform.", image: img("photo-1523050854058-8df90110c9f1"), order: 5 },
    { title: "Technology", slug: "technology", description: "Demo theatres, innovation labs, and product storytelling platforms for software and hardware leaders.", image: img("photo-1518770660439-4636190af475"), order: 6 },
    { title: "Automotive", slug: "automotive", description: "Vehicle launches, motorsport hospitality, and sculptural stand architecture for premium mobility brands.", image: img("photo-1492144534655-ae79c964c9d7"), order: 7 },
    { title: "Retail", slug: "retail", description: "Pop-up cathedrals, experiential store formats, and seasonal exhibition commerce worlds.", image: img("photo-1441986300917-64674bd600d8"), order: 8 },
  ];

  for (const i of industries) {
    await prisma.industry.upsert({
      where: { slug: i.slug },
      update: i,
      create: i,
    });
  }

  const jobs = [
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

  for (const j of jobs) {
    await prisma.job.upsert({
      where: { slug: j.slug },
      update: j,
      create: j,
    });
  }

  await prisma.setting.upsert({
    where: { key: "site" },
    update: {},
    create: {
      key: "site",
      value: {
        companyName: "Project S7",
        tagline: "Luxury Corporate Events & Exhibitions",
        email: "hello@projects7.com",
        phone: "+971 4 000 0000",
        whatsapp: "+971500000000",
        address: "Business Bay, Dubai, United Arab Emirates",
        social: {
          linkedin: "https://linkedin.com/company/projects7",
          instagram: "https://instagram.com/projects7",
          x: "https://x.com/projects7",
        },
        mapEmbed:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178509174275!2d55.2708!3d25.1867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzEyLjEiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2s!4v1700000000000",
      },
    },
  });

  console.log("Seed complete.");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
