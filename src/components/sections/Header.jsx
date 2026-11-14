import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.webp";

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
