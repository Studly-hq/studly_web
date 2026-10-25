import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { Button } from "../ui/button";

/**
 * Header shell mirroring the design export: sticky, translucent cream with a
 * backdrop blur, a hairline bottom border, and a 1080px / h-16 row using the
 * standard inline padding scale.
 *
 * Two things make this actually work, and neither is enough alone:
 *
 *  - The blur has to be strong enough to destroy the content passing through.
 *    At 12px a 32px headline is still readable behind the bar, so the header
 *    never feels clear of it. 20px smears passing text into an indistinct wash,
 *    which is what keeps the logo / nav / CTA legible on top.
 *  - The tint stays fairly opaque (70%). The blur does the work of hiding what
 *    is behind; the cream does the work of guaranteeing contrast for the
 *    header's own content. Going more transparent makes the header text
 *    *less* readable, which is the opposite of the goal.
 *
 * `z-50` is load-bearing, not cosmetic. `backdrop-filter` only blurs what is
 * painted *below* the element, and the hero's content wrapper is itself `z-40`
 * (it needs to clear the `z-30` ContainerGrid). At an equal z-index the later
 * element in the DOM wins, so the headline painted straight over the header and
 * the blur had nothing left to do — the headline stayed razor sharp. The header
 * has to outrank the page content for the effect to exist at all.
 *
 * Light-only for now: colors are pinned to the app's light palette rather
 * than theme tokens, so this stays stable while the page is a bare shell.
 */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-[#ece7d8] bg-[#fffcf0]/70 backdrop-blur-[20px]">
    <div className="mx-auto grid h-16 w-full max-w-[1080px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10">
      <Link to="/" className="flex items-center gap-0.5" aria-label="Studly home">
        <img src={logo} alt="" className="block h-5 w-auto" />
        <span className="font-geist text-[17px] font-semibold tracking-[-0.02em] text-[#141414]">
          Studly
        </span>
      </Link>

      <nav className="col-start-2 hidden items-center gap-7 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-geist text-[14px] font-medium text-[#141414]/60 transition-colors hover:text-[#141414]"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="col-start-3 flex justify-end">
        <Link
          to="/login"
          className="inline-flex h-9 items-center justify-center rounded-full bg-[#141414] px-4 text-[14px] font-medium text-white transition-opacity hover:bg-[#141414]/85"
        >
          Log in
        </Link>
      </div>
    </div>
  </header>
);

export default Header;