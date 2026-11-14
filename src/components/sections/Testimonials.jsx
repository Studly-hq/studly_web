import React from "react";
import { useReducedMotion } from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import Marquee from "../ui/3d-testimonials";

/**
 * Testimonials — the 3D marquee wall.
 *
 * Sits between Features and Pricing, where it has the most work to do: it is
 * the last thing read before the price, so it carries the social proof the
 * rest of the page only asserts.
 *
 * ⚠️ PLACEHOLDER COPY — the twelve entries below are sample wording standing in
 * for real quotes. Replace `name`, `university` and `quote` with permission-
 * granted testimonials before this page goes live. Invented student quotes are
 * a trust problem, not a design detail. The shape of the data is the only thing
 * this file depends on, so swapping the copy needs no other change.
 */

const SCHOOL_TINTS = {
  covenant: "#f4e9cd",
  nile: "#e4ecf8",
  abuad: "#e9f1ea",
  babcock: "#f7e7dc",
};

const TESTIMONIALS = [
  {
    name: "Tolu Adebayo",
    university: "Covenant University",
    quote:
      "I stopped re-reading the same slide deck for hours. It turns a pile of PDFs into a path I can actually finish before an 8am test.",
    tint: SCHOOL_TINTS.covenant,
  },
  {
    name: "Chidera Nwosu",
    university: "Covenant University",
    quote:
      "The quizzes catch what I only thought I knew. That changed how I prepare for continuous assessment.",
    tint: SCHOOL_TINTS.covenant,
  },
  {
    name: "Similoluwa Ojo",
    university: "Covenant University",
    quote:
      "Everything was already sitting in my Drive. It just put it in an order I could follow.",
    tint: SCHOOL_TINTS.covenant,
  },
  {
    name: "Aisha Bello",
    university: "Nile University",
    quote:
      "I upload the lecture note on my way out of class and the path is ready before I reach the hostel.",
    tint: SCHOOL_TINTS.nile,
  },
  {
    name: "Daniel Terkaa",
    university: "Nile University",
    quote:
      "It reads my lecturer's sixty-slide deck and gives me the six things that actually matter.",
    tint: SCHOOL_TINTS.nile,
  },
  {
    name: "Zainab Yusuf",
    university: "Nile University",
    quote:
      "The flashcards come from my own notes, so revision is my course, not a generic deck with the wrong syllabus.",
    tint: SCHOOL_TINTS.nile,
  },
  {
    name: "Femi Ogunleye",
    university: "ABUAD",
    quote:
      "Group study used to be an argument about where to start. Now we just open the path and begin.",
    tint: SCHOOL_TINTS.abuad,
  },
  {
    name: "Blessing Eze",
    university: "ABUAD",
    quote:
      "One topic at a time is the whole thing. I stopped panicking at the size of the syllabus.",
    tint: SCHOOL_TINTS.abuad,
  },
  {
    name: "Ibrahim Sani",
    university: "ABUAD",
    quote:
      "I test myself after every section, so by exam week nothing on the paper feels new.",
    tint: SCHOOL_TINTS.abuad,
  },
  {
    name: "Grace Ademola",
    university: "Babcock University",
    quote:
      "Handwritten notes, screenshots, audio from class. It takes all of it, and no other app did that for me.",
    tint: SCHOOL_TINTS.babcock,
  },
  {
    name: "Kelechi Umeh",
    university: "Babcock University",
    quote:
      "It explains the concept at my level instead of pasting a textbook paragraph at me.",
    tint: SCHOOL_TINTS.babcock,
  },
  {
    name: "Temilade Ajayi",
    university: "Babcock University",
    quote:
      "I don't study longer. I study in order, and it shows in my assessments.",
    tint: SCHOOL_TINTS.babcock,
  },
];

/** Four columns, each a different rotation of the same list so no two match. */
const COLUMNS = [
  { duration: "58s", reverse: false },
  { duration: "74s", reverse: true },
  { duration: "64s", reverse: false },
  { duration: "80s", reverse: true },
].map((col, i) => ({
  ...col,
  key: `column-${i}`,
  items: [...TESTIMONIALS.slice(i), ...TESTIMONIALS.slice(0, i)],
  // Two columns on phones, three from sm, four from lg. Each step is sized to
  // just fill its breakpoint, so the wall always spans the viewport without
  // cropping a column at the edges.
  hide: i === 2 ? "hidden sm:flex" : i === 3 ? "hidden lg:flex" : "",
}));

const initialsOf = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const TestimonialCard = ({ name, university, quote, tint }) => (
  <figure className="w-[168px] shrink-0 rounded-xl border border-[#ece7d8] bg-white p-4 text-left shadow-[0_1px_0_rgba(20,20,20,0.03)] sm:w-[196px] sm:p-[18px] md:w-[232px] md:p-5 lg:w-[248px]">
    <div className="flex items-center gap-2.5 sm:gap-3">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#141414]/8 font-geist text-[10.5px] font-semibold tracking-[0.02em] text-[#141414]/70 sm:size-9 sm:text-[11.5px]"
        style={{ backgroundColor: tint }}
      >
        {initialsOf(name)}
      </span>
      <figcaption className="min-w-0">
        <p className="truncate font-geist text-[12px] font-semibold leading-tight tracking-[-0.01em] text-[#141414] sm:text-[13px]">
          {name}
        </p>
        <p className="mt-0.5 truncate font-geist text-[10px] leading-tight text-[#141414]/45 sm:text-[11px]">
          {university}
        </p>
      </figcaption>
    </div>

    <blockquote className="mt-2.5 font-geist text-[12px] leading-[1.45] tracking-[-0.005em] text-[#141414]/75 sm:mt-3 sm:text-[13px] sm:leading-[1.5]">
      &ldquo;{quote}&rdquo;
    </blockquote>
  </figure>
);

const SectionHeading = () => (
  <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
    <h2 className="max-w-[640px] text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] md:text-4xl">
      Students who stopped re-reading.
    </h2>
  </div>
);

const Testimonials = () => {
  const reduced = useReducedMotion();

  return (
    <section
      id="testimonials"
      className="relative border-t border-[#ece7d8] py-20 md:py-28"
    >
      <ContainerGrid dots />

      <div className="relative z-40">
        <SectionHeading />
      </div>

      {reduced ? (
        /* Reduced motion: the same cards, laid out flat, nothing moving. */
        <div className="relative z-40 mx-auto mt-12 grid w-full max-w-[1080px] grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3 [&>figure]:w-full">
          {TESTIMONIALS.slice(0, 6).map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      ) : (
        /* Panel is deliberately narrower than the 1080 container: the wall's
           cream edge fades would otherwise paint over the ContainerGrid rails
           and erase them for the full height of this section. Keeping the wall
           inside the rails also stops the tilt from hard-cutting cards at the
           viewport edge. */
        <div className="relative z-40 mx-auto mt-12 h-[360px] w-full max-w-[960px] overflow-hidden [perspective:900px] sm:h-[440px] md:h-[520px] lg:h-[560px]">
          {/* The tilted wall itself. One transform, so the four columns share a plane. */}
          <div
            className="flex h-full w-full flex-row items-stretch justify-center gap-3 sm:gap-4"
            style={{
              transform:
                "translateZ(-60px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
            }}
          >
            {COLUMNS.map((col, i) => (
              /* shrink-0 is load-bearing: the wall is wider than the viewport on
                 purpose, and each column must keep its card width. Without it
                 flex squeezes the columns and `overflow-hidden` crops the cards. */
              <Marquee
                key={col.key}
                vertical
                pauseOnHover
                repeat={2}
                reverse={col.reverse}
                ariaLabel={`Student testimonials, column ${i + 1}`}
                className={`h-full shrink-0 [--gap:1rem] ${col.hide}`}
                style={{ "--duration": col.duration }}
              >
                {col.items.map((t) => (
                  <TestimonialCard key={`${col.key}-${t.name}`} {...t} />
                ))}
              </Marquee>
            ))}
          </div>

          {/* Screen-space vignette so the wall dissolves into the cream page. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#fffcf0] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#fffcf0] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#fffcf0] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#fffcf0] to-transparent" />
        </div>
      )}
    </section>
  );
};

export default Testimonials;
