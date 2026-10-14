"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";

import { ArrowAction } from "@/components/ArrowAction";
import { useInquiry } from "@/components/InquiryProvider";
import { EASE } from "@/lib/utils";

const links = [
  { href: "/#home", label: "Нүүр" },
  { href: "/#templates", label: "Загварууд" },
  { href: "/projects", label: "Хийсэн төслүүд" },
  { href: "/#contact", label: "Холбогдох" },
];

export function Header() {
  const { openInquiry } = useInquiry();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.2,
  });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };

    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function requestQuote() {
    setMenuOpen(false);
    openInquiry({ websiteType: "custom" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-50 h-px origin-left bg-ink"
        style={{ scaleX }}
      />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
      >
        Агуулга руу
      </a>
      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between px-5 lg:grid lg:h-16 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <motion.a
          href="/"
          className="justify-self-start"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Image
            src="/Logo.png"
            alt="BilguunSoft"
            width={168}
            height={56}
            priority
            className="h-8 w-auto md:h-9"
          />
        </motion.a>

        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link whitespace-nowrap text-[13px] text-ink lg:text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <div className="hidden lg:block">
            <ArrowAction onClick={requestQuote}>Үнийн санал авах</ArrowAction>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Цэс хаах" : "Цэс нээх"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-line bg-white px-5 py-3 lg:hidden"
          >
            <nav aria-label="Гар утасны цэс" className="flex flex-col">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="border-b border-line py-3.5 text-base last:border-b-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + index * 0.06, ease: EASE }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <ArrowAction className="mt-3 w-full" onClick={requestQuote}>
              Үнийн санал авах
            </ArrowAction>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
