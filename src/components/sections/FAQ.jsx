import React from "react";
import ContainerGrid from "./ContainerGrid";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "../ui/accordion";

const ITEMS = [
  {
    title: "What can I upload?",
    content:
      "PDFs, PowerPoint decks, Word documents, screenshots, photos of handwritten notes, and recordings of a lecture. Files stay in your account and are only used to build your path. One note is enough to see the whole thing work.",
  },
  {
    title: "How is this different from asking ChatGPT?",
    content:
      "ChatGPT answers the question you ask. Studly reads the full note you give it, turns it into an ordered path, and quizzes you on each part, so you know what to study next and whether it actually stuck.",
  },
  {
    title: "Will it work for my course?",
    content:
      "It follows the material you upload, not a generic syllabus. Engineering, law, medicine, accountancy, a random elective. If you can upload it, Studly can build a path through it.",
  },
  {
    title: "How much does it cost?",
    content:
      "Your first note is free. After that it is ₦2,000 a month for everything, billed through Paystack. You can cancel from your settings whenever you want.",
  },
  {
    title: "Do you write my assignments for me?",
    content:
      "No. Studly explains, tests, and keeps you moving through the material. You still do the work, which is the only reason it shows up when you sit the paper.",
  },
  {
    title: "What if my exam is next week?",
    content:
      "Start with the topic you are weakest on. The quizzes show where you are losing marks, so a week is enough to fix the parts that matter instead of rereading everything.",
  },
  {
    title: "Does it work on my phone?",
    content:
      "Yes. Studly runs in the browser on your laptop or phone, and your path picks up exactly where you stopped. Uploads straight from your camera roll work too.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ITEMS.map((item) => ({
    "@type": "Question",
    name: item.title,
    acceptedAnswer: { "@type": "Answer", text: item.content },
  })),
};

const FAQ = () => (
  <section
    id="faq"
    className="relative scroll-mt-24 border-t border-[#ece7d8] py-20 md:py-28"
  >
    <ContainerGrid dots />

    <div className="relative z-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <h2 className="mx-auto max-w-[600px] px-6 text-center text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] md:text-4xl">
        Questions we get from students.
      </h2>

      <div className="mx-auto mt-12 w-full max-w-[600px] px-6 md:px-0">
        <Accordion className="w-full">
          {ITEMS.map((item, index) => (
            <AccordionItem
              key={item.title}
              value={`item-${index + 1}`}
              className="border-[#ece7d8]"
            >
              <AccordionTrigger className="py-[18px] font-geist text-[clamp(14px,1.6vw,16px)] font-medium tracking-[-0.011em] text-[#141414]">
                {item.title}
              </AccordionTrigger>
              <AccordionPanel className="font-geist text-[clamp(13px,1.6vw,15px)] leading-[1.7] tracking-[-0.011em] text-[#726f6c]">
                {item.content}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Support card: anything the seven answers did not cover. */}
      <div className="mx-auto mt-10 w-full max-w-[600px] px-6 md:px-0">
        <div className="relative overflow-hidden rounded-xl border border-[#141414] bg-[#141414]">
          <div className="relative px-6 py-16 text-center sm:py-20">
            <p className="font-geist text-[clamp(14px,1.6vw,16px)] leading-[1.6] tracking-[-0.011em] text-white">
              Still have a question?{" "}
              <a
                href="mailto:studlyhelp@gmail.com"
                className="rounded-xl font-medium text-white underline underline-offset-4 transition-colors duration-[140ms] hover:text-white/80"
              >
                Email us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
