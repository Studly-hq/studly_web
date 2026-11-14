import React from "react";
import covenantLogo from "../../assets/school-covenant.png";
import abuadLogo from "../../assets/school-abuad.png";
import nileLogo from "../../assets/school-nile.svg";

/**
 * "Trusted by" social proof row, composed directly beneath the hero headline.
 *
 * Logos are the official marks served by each institution's own site, pulled
 * locally so nothing depends on a third-party CDN. Heights are normalized to a
 * common visual weight — the source files are wildly different aspect ratios
 * (282x88, 572x111, and an SVG lockup), so a fixed height plus auto width keeps
 * them from reading as three different sizes.
 *
 * These are registered trademarks. If the schools haven't granted permission,
 * swap the <img> for the plain wordmark text — the layout holds either way.
 */
const INSTITUTIONS = [
  { name: "Covenant University", logo: covenantLogo },
  { name: "Afe Babalola University", logo: abuadLogo },
  { name: "Nile University", logo: nileLogo },
];

/**
 * Label metrics mirror the design export's trust strip: 13px at 55% opacity,
 * with the marks below in a wrapping row.
 */
const SocialProof = () => (
  <div className="w-full">
    <p className="font-geist text-[13px] text-[#141414]/55">Trusted by students at</p>

    <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-5">
      {INSTITUTIONS.map(({ name, logo }) => (
        <li key={name}>
          <img
            src={logo}
            alt={name}
            className="h-8 w-auto object-contain"
          />
        </li>
      ))}
    </ul>
  </div>
);

export default SocialProof;