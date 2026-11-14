import React from "react";
import ContainerGrid from "./ContainerGrid";

/**
 * FooterNav — standard footer navigation links, placed above the halftone wordmark footer.
 * Clean, readable links without ALL CAPS transformation.
 */
const FOOTER_NAV_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "API Reference", href: "/api-docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const FooterNav = () => (
  <section
    id="footer-nav"
    className="relative border-t border-[#ece7d8] py-12 md:py-16 bg-[#fffcf0]"
  >
    <ContainerGrid dots />

    <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {FOOTER_NAV_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <h3 className="font-geist text-[13px] font-semibold leading-tight tracking-[0.02em] text-[#141414]">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-geist text-[14px] leading-relaxed text-[#141414]/70 transition-colors duration-150 hover:text-[#141414] hover:opacity-100"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Divider line */}
      <div className="mt-8 border-t border-[#ece7d8]" />
    </div>
  </section>
);

export default FooterNav;