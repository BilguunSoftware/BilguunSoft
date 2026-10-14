"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { ArrowAction } from "@/components/ArrowAction";
import { Container } from "@/components/Container";
import { useInquiry } from "@/components/InquiryProvider";
import { Reveal } from "@/components/Reveal";
import { TemplatePreview } from "@/components/previews/TemplatePreviews";
import { categories, readyPrice } from "@/data/templates";
import { cn, EASE } from "@/lib/utils";

export function TemplateShowcase() {
  const { openInquiry } = useInquiry();
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [activeId, setActiveId] = useState(categories[0].templates[0].id);
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const active =
    category.templates.find((template) => template.id === activeId) ??
    category.templates[0];

  function selectCategory(nextId: string) {
    const next = categories.find((item) => item.id === nextId) ?? categories[0];
    setCategoryId(next.id);
    setActiveId(next.templates[0].id);
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = categories[(index + direction + categories.length) % categories.length];
    selectCategory(next.id);
    document.getElementById(`template-tab-${next.id}`)?.focus();
  }

  function onSiteKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next =
      category.templates[
        (index + direction + category.templates.length) % category.templates.length
      ];
    setActiveId(next.id);
    document.getElementById(`template-site-${next.id}`)?.focus();
  }

  return (
    <section id="templates" className="scroll-mt-16 border-t border-line bg-stone py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-semibold tracking-[-0.04em]">
              Жишээ загварууд.
            </h2>
            <p className="mt-3 text-muted">Ангиллаа сонгоод үзээрэй.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            role="tablist"
            aria-label="Загварын ангилал"
            className="mt-8 flex gap-5 overflow-x-auto border-b border-line sm:gap-8"
          >
            {categories.map((item, index) => {
              const selected = item.id === category.id;

              return (
                <button
                  key={item.id}
                  id={`template-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="template-panel"
                  tabIndex={selected ? 0 : -1}
                  className={cn(
                    "relative min-h-11 shrink-0 whitespace-nowrap pb-3 text-sm sm:text-[15px]",
                    selected ? "text-ink" : "text-muted hover:text-ink",
                  )}
                  onClick={() => selectCategory(item.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  {item.tab}
                  {selected ? (
                    <motion.span
                      layoutId="template-tab"
                      className="absolute inset-x-0 -bottom-px h-px bg-ink"
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  ) : null}
                </button>
              );
            })}
            </div>

          {category.templates.length > 1 ? (
            <div
              role="tablist"
              aria-label={category.tab}
              className="mt-4 flex gap-5"
            >
              {category.templates.map((template, index) => {
                const selected = template.id === active.id;

                return (
                  <button
                    key={template.id}
                    id={`template-site-${template.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="template-panel"
                    tabIndex={selected ? 0 : -1}
                    className={cn(
                      "relative min-h-11 pb-2 text-sm",
                      selected ? "text-ink" : "text-muted hover:text-ink",
                    )}
                    onClick={() => setActiveId(template.id)}
                    onKeyDown={(event) => onSiteKeyDown(event, index)}
                  >
                    {template.brand}
                    {selected ? (
                      <motion.span
                        layoutId="interior-site"
                        className="absolute inset-x-0 bottom-0 h-px bg-ink"
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div
            id="template-panel"
            role="tabpanel"
            aria-labelledby={`template-tab-${category.id}`}
            className="mt-6 overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_24px_50px_rgba(17,17,17,0.05)]"
          >
            <div className="relative flex h-10 items-center border-b border-line bg-[#f3f3f2] px-4">
              <div className="flex gap-1.5" aria-hidden>
                <span className="size-[7px] rounded-full bg-[#d4d4d4]" />
                <span className="size-[7px] rounded-full bg-[#cfcfcf]" />
                <span className="size-[7px] rounded-full bg-[#c8c8c8]" />
              </div>
              <AnimatePresence initial={false}>
                <motion.p
                  key={active.brand}
                  className="pointer-events-none absolute inset-x-10 text-center text-[11px] text-muted"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  {active.brand}
                </motion.p>
              </AnimatePresence>
              {active.url ? (
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto text-[11px] text-muted transition-colors hover:text-ink"
                >
                  Нээх ↗
                </a>
              ) : null}
            </div>

            <div className="relative aspect-[1/2] overflow-hidden sm:aspect-[16/11] lg:aspect-[16/10]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <TemplatePreview template={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-h-14">
              <div className="grid">
                <AnimatePresence initial={false}>
                  <motion.p
                    key={active.id}
                    className="col-start-1 row-start-1 text-lg font-medium tracking-[-0.03em] sm:text-xl"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {active.name} · {active.brand}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-1 text-sm text-muted">Бэлэн загвар — {readyPrice}</p>
            </div>
            <ArrowAction
              className="w-full sm:w-auto"
              onClick={() =>
                openInquiry({ websiteType: "ready", templateId: active.id })
              }
            >
              Энэ загварыг сонгох
            </ArrowAction>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
