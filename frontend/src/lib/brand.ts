/** Project S7 Brand Tokens — matched to the S7 wordmark pink */
export const brand = {
  pink: "#F52D71",
  pinkSoft: "#FF5A8F",
  pinkMuted: "#FFF0F5",
  pinkDeep: "#D91F5C",
  white: "#FFFFFF",
  soft: "#FFF5F9",
  ink: "#111111",
  muted: "#6B5560",
  line: "#F3D4E0",
} as const;

export const siteConfig = {
  name: "Project S7",
  legalName: "Project S7 Event Management",
  tagline: "Events & Exhibitions",
  description:
    "Project S7 delivers premium events, exhibitions, bespoke exhibition stands and end-to-end project management with precision, creativity and professional execution.",
  seoTitle: "Project S7 | Events, Exhibitions & Exhibition Stands",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  email: "hello@projects7.com",
  phone: "+971 4 000 0000",
  whatsapp: "+971500000000",
  address: "Business Bay, Dubai, United Arab Emirates",
  social: {
    linkedin: "https://linkedin.com/company/projects7",
    instagram: "https://instagram.com/projects7",
    x: "https://x.com/projects7",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Our Process", href: "/#process" },
    { label: "Contact", href: "/contact" },
  ],
  footerServices: [
    { label: "Exhibition Management", href: "/services/exhibition-management" },
    { label: "Exhibition Stand Design", href: "/services/exhibition-stand-design" },
    { label: "Exhibition Stand Build", href: "/services/exhibition-stand-build" },
    { label: "Project Management & Consultancy", href: "/services/project-management" },
    { label: "Speaker Management & VIP Services", href: "/services/speaker-management" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
