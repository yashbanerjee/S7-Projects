/**
 * Approved Project S7 website content — source of truth from client brief.
 * Do not add unsupported claims, services, or fabricated portfolio/testimonial data.
 */

export const APPROVED_SERVICE_SLUGS = [
  "exhibition-management",
  "exhibition-stand-design",
  "exhibition-stand-build",
  "project-management",
  "speaker-management",
] as const;

export type ApprovedServiceSlug = (typeof APPROVED_SERVICE_SLUGS)[number];

export const heroContent = {
  eyebrow: "Project S7 · Events & Exhibitions",
  headline: "Creating Exceptional Events. Designing Unforgettable Experiences.",
  supporting:
    "From world-class exhibitions and conferences to bespoke exhibition stands and premium corporate events, we provide end-to-end event solutions that bring your vision to life.",
  primaryCta: { label: "Start Designing", href: "/quote?intent=design" },
  secondaryCta: { label: "Get a Quote", href: "/quote" },
};

export const aboutSection = {
  eyebrow: "About Us",
  title: "Your Trusted Event & Exhibition Partner",
  copy: [
    "We plan, design, build, and run exhibitions and events with operational discipline. From floor plans, contractor coordination, and stand fabrication through to on-site delivery, our teams own the full production cycle — not just the concept.",
    "Creative direction sits alongside project control: clear timelines, accountable workstreams, and turnkey solutions for exhibitions, conferences, corporate programmes, and bespoke stands.",
  ],
  capabilities: [
    "Exhibition planning & operations",
    "Stand design & build",
    "On-site project control",
    "Build-up & breakdown",
  ],
  cta: { label: "Request a Consultation", href: "/contact?intent=consultation" },
};

export const aboutPageContent = {
  ...aboutSection,
  positioning:
    "Project S7 delivers premium events, exhibitions, bespoke exhibition stands, and end-to-end project management for corporate, government, and international clients.",
};

export const approvedServices = [
  {
    slug: "exhibition-management" as const,
    title: "Exhibition Management",
    description:
      "We specialise in delivering exhibitions of every scale, providing complete operational management from exhibitor coordination to on-site delivery.",
    features: [
      "Exhibition Planning",
      "Operations Management",
      "Exhibitor Management",
      "Venue Coordination",
      "Contractor Management",
      "Floor Plan Management",
      "Registration Services",
      "Logistics Coordination",
      "Build-Up & Breakdown Management",
      "Health & Safety Compliance",
    ],
    cta: { label: "Get a Quote", href: "/quote" },
  },
  {
    slug: "exhibition-stand-design" as const,
    title: "Exhibition Stand Design",
    description:
      "Stand out on the exhibition floor with bespoke exhibition stands designed to maximise engagement and showcase your brand. Our creative designers combine functionality with innovative concepts to create memorable visitor experiences.",
    features: [
      "Bespoke Stand Design",
      "3D Visualisation",
      "Concept Development",
      "Branding Integration",
      "Space Planning",
      "Graphic Design",
    ],
    cta: { label: "Start Designing", href: "/quote?intent=design", prominent: true },
  },
  {
    slug: "exhibition-stand-build" as const,
    title: "Exhibition Stand Build",
    description:
      "From fabrication to installation, we manufacture high-quality exhibition stands built with precision and attention to detail.",
    features: [
      "Custom Fabrication",
      "Modular Stands",
      "Double Decker Stands",
      "Country Pavilions",
      "Installation",
      "Dismantling",
      "Storage Solutions",
    ],
    cta: { label: "Get a Quote", href: "/quote" },
  },
  {
    slug: "project-management" as const,
    title: "Project Management & Consultancy",
    description:
      "We provide strategic oversight and hands-on project management for events, exhibitions and complex projects. From initial planning to supplier coordination and on-site delivery, we ensure every element is aligned, efficiently managed and delivered to the highest standard.",
    features: [
      "Project Planning & Scheduling",
      "Procurement & Supplier Management",
      "Technical & Operational Coordination",
      "Risk Management & Compliance",
      "Stakeholder & Client Management",
      "On-Site Project Delivery",
      "Project Reporting & Close-Out",
    ],
    cta: { label: "Get a Quote", href: "/quote" },
  },
  {
    slug: "speaker-management" as const,
    title: "Speaker Management & VIP Services",
    description:
      "We provide comprehensive speaker and VIP coordination for conferences, summits and corporate events. From travel arrangements and speaker briefings to on-site coordination and green room management, we ensure a seamless and professional experience for every speaker, guest and VIP.",
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
    cta: { label: "Get a Quote", href: "/quote" },
  },
];

export const whyChooseContent = {
  eyebrow: "Why Choose Us",
  title: "Excellence Delivered. Every Time.",
  description:
    "We combine creativity, technical expertise, and operational excellence to deliver events that exceed expectations. Our experienced team manages every detail with precision, allowing our clients to focus on what matters most—connecting with their audience.",
  reasons: [
    "End-to-End Event Solutions",
    "Exhibition Specialists",
    "Creative Design Team",
    "Experienced Project Managers",
    "Speaker & VIP Coordination",
    "Premium Quality Stand Fabrication",
    "On-Time Delivery",
    "Budget-Conscious Planning",
    "Exceptional Client Service",
  ],
};

export const processStages = [
  {
    step: "01",
    title: "Consultation",
    text: "Understanding your objectives and event requirements.",
  },
  {
    step: "02",
    title: "Strategy",
    text: "Developing creative concepts and operational plans.",
  },
  {
    step: "03",
    title: "Design",
    text: "Creating engaging event experiences and exhibition spaces.",
  },
  {
    step: "04",
    title: "Planning",
    text: "Managing budgets, suppliers, schedules, and logistics.",
  },
  {
    step: "05",
    title: "Build",
    text: "Fabricating exhibition stands and preparing event infrastructure.",
  },
  {
    step: "06",
    title: "Delivery",
    text: "Managing every detail on-site to ensure flawless execution.",
  },
  {
    step: "07",
    title: "Success",
    text: "Delivering exceptional experiences that exceed expectations.",
  },
];

export const ctaBandContent = {
  eyebrow: "Request a Quote",
  title: "Ready to bring your event vision to life?",
  description:
    "Share your requirements and our team will respond with clarity, creative direction, and a practical path forward.",
  primary: { label: "Get a Quote", href: "/quote" },
  secondary: { label: "Request a Consultation", href: "/contact?intent=consultation" },
};

export const portfolioPlaceholder = {
  title: "Project showcase",
  description:
    "Our portfolio of exhibitions, stands, and corporate events will be published here as projects are approved for public release.",
};

export function isApprovedServiceSlug(slug: string): slug is ApprovedServiceSlug {
  return (APPROVED_SERVICE_SLUGS as readonly string[]).includes(slug);
}

export function filterApprovedServices<T extends { slug: string }>(services: T[]): T[] {
  return services.filter((s) => isApprovedServiceSlug(s.slug));
}
