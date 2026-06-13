import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "./badge";
import { Button } from "./button";

const Changelog = ({
  title = "Changelog",
  description = "Get the latest updates and improvements to our platform.",
  entries = [],
}) => {
  const totalEntries = entries.length;
  return (
    <section className="py-24 sm:py-32" aria-labelledby="changelog-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h1
            id="changelog-heading"
            className="mb-4 text-3xl font-heading font-bold tracking-tight md:text-5xl text-reddit-text"
          >
            {title}
          </h1>
          <p className="mb-6 text-base text-reddit-textMuted md:text-lg leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: Math.min(index, 5) * 0.06,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative flex flex-col gap-3 md:flex-row md:gap-16"
            >
              {/* Left side — version badge & date (sticky on desktop) */}
              <div className="flex h-min w-full md:w-64 md:shrink-0 items-center gap-3 md:sticky top-4">
                <Badge variant="secondary" className="text-xs">
                  {entry.version}
                </Badge>
                <span className="text-xs font-medium text-reddit-textMuted">
                  {entry.date}
                </span>
              </div>

              {/* Right side — content */}
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="mb-3 text-lg leading-tight font-bold text-reddit-text md:text-2xl font-heading">
                  {entry.title}
                </h2>
                <p className="text-sm text-reddit-textMuted md:text-base leading-relaxed">
                  {entry.description}
                </p>

                {entry.items && entry.items.length > 0 && (
                  <ul
                    className="mt-4 ml-4 space-y-1.5 text-sm text-reddit-text/70 md:text-base"
                    aria-label={`Changes in ${entry.version}`}
                  >
                    {entry.items.map((item, itemIndex) => (
                      <li key={`${entry.version}-${itemIndex}`} className="list-disc marker:text-reddit-border">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {entry.sections && entry.sections.length > 0 && (
                  <div className="mt-6 space-y-6">
                    {entry.sections.map((section, sIdx) => (
                      <div key={sIdx}>
                        <h3 className="text-base font-bold text-reddit-text mb-2 font-heading">{section.title}</h3>
                        <ul className="ml-4 space-y-1.5 text-sm text-reddit-text/70 md:text-base">
                          {section.items.map((item, itemIndex) => (
                            <li key={`${entry.version}-s${sIdx}-${itemIndex}`} className="list-disc marker:text-reddit-border">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {entry.image && (
                  <img
                    src={entry.image}
                    alt={`Screenshot for ${entry.title}`}
                    loading="lazy"
                    decoding="async"
                    className="mt-8 w-full rounded-lg object-cover border border-reddit-border/30"
                  />
                )}

                {entry.button && (
                  <Button variant="link" className="mt-4 self-start gap-1 px-0 text-reddit-textMuted hover:text-white" asChild>
                    <a href={entry.button.url} target="_blank" rel="noopener noreferrer">
                      {entry.button.text} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Separator — hide after last entry */}
                {index < totalEntries - 1 && (
                  <div className="mt-12 h-px bg-reddit-border/30 md:mt-16" aria-hidden="true" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Changelog;
