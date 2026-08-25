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
  tagline: "Luxury Corporate Events & Exhibitions",
  description:
    "Project S7 is a premium corporate events and exhibition company delivering world-class exhibition management, stand design & build, event production, and project management for government, corporate, and international clients.",
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
    { label: "Portfolio", href: "/portfolio" },
    { label: "Industries", href: "/industries" },
    { label: "Careers", href: "/careers" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
