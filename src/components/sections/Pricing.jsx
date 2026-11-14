import React from "react";
import { Link } from "react-router-dom";
import ContainerGrid from "./ContainerGrid";

/**
 * Pricing — one plan, everything in it.
 *
 * Layout is taken from the time.fyi pricing export: a centred eyebrow/title/
 * subtitle block, then a single 1px-gap grid whose background shows through as
 * the divider. The left cell is the peach price panel, the right cell is the
 * white feature list, and two 7px dots sit on the grid's top corners on desktop.
 *
 * Prices are intentionally in one place at the top: `PLAN_PRICE`,
 * `FIRST_MONTH_PRICE` and `FEATURES` are the only things that need editing when
 * billing changes. Checkout reads the same amounts from the backend, so these
 * must stay in sync with `paystack.rs`.
 */

const PLAN_PRICE = "₦2,000";
const FIRST_MONTH_PRICE = "₦1,000";
const PLAN_PERIOD = "per 30 days";
const SIGNUP_HREF = "/signup";

const FEATURES = [
  "Unlimited note uploads (PDF, PPTX, images, audio)",
  "A learning path built from each note",
  "Personalised AI study tutor chat",
  "Smart quizzes and exercises",
  "Dynamic study flashcards",
  "Topic-based YouTube videos",
  "Detailed AI explanations and deep dives",
];

const CheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="mt-[3px] size-4 shrink-0 text-[#2e9b5f]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3.5 8.5 6.5 11.5l6-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CornerDot = ({ side }) => (
  <span
    aria-hidden="true"
    className={`absolute -top-[3.5px] hidden size-[7px] rounded-full border border-[#141414]/15 bg-white md:block ${
      side === "left" ? "-left-[3.5px]" : "-right-[3.5px]"
    }`}
  />
);

const Pricing = () => (
  <section
    id="pricing"
    className="relative scroll-mt-24 border-t border-[#ece7d8] py-20 md:py-28"
  >
    <ContainerGrid dots />

    <div className="relative z-40">
      {/* Header */}
      <div className="mx-auto max-w-[680px] px-6 text-center md:px-10">
        <h2 className="text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] md:text-4xl">
          One simple plan
        </h2>
      </div>

      {/* Grid: the 1px gap plus the tinted background draws the divider. */}
      <div className="mx-auto mt-12 w-full max-w-[1080px] px-6 md:mt-16 md:px-10">
        <div className="relative grid grid-cols-1 gap-[1px] bg-[#141414]/8 md:grid-cols-2">
          <CornerDot side="left" />
          <CornerDot side="right" />

          {/* Price panel */}
          <div className="flex flex-col bg-[#fdf0e8] p-6 md:p-10">
            <p className="font-geist text-[clamp(14px,1.6vw,16px)] font-semibold text-[#141414]">
              Monthly plan
            </p>

            <div className="mt-6 flex items-end gap-1.5">
              <span className="font-geist text-[clamp(44px,6vw,56px)] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[#141414]">
                {PLAN_PRICE}
              </span>
              <span className="pb-2 font-geist text-[clamp(14px,1.6vw,16px)] text-[#726f6c]">
                {PLAN_PERIOD}
              </span>
            </div>

            <div className="mt-10 md:mt-auto md:pt-10">
              <Link
                to={SIGNUP_HREF}
                className="mx-auto flex h-12 w-full max-w-[300px] items-center justify-center rounded-full bg-[#141414] px-6 font-geist text-[14px] font-medium text-white transition-opacity duration-150 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
              >
                Start with a free note
              </Link>
            </div>
          </div>

          {/* Feature panel */}
          <div className="bg-white p-6 md:p-10">
            <p className="font-geist text-[clamp(14px,1.6vw,16px)] font-semibold text-[#141414]">
              Everything included
            </p>

            <ul className="mt-5 flex flex-col gap-3.5">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 font-geist text-[clamp(14px,1.6vw,16px)] leading-[1.45] tracking-[-0.005em] text-[#141414]/70"
                >
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Pricing;
