"use client";

import { motion } from "motion/react";

import { ArrowAction } from "@/components/ArrowAction";
import { Container } from "@/components/Container";
import { ServiceCards } from "@/components/ServiceCards";
import { EASE } from "@/lib/utils";

const lines = ["Вебсайт", "хэрэгтэй юу?"];

const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

const group = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

export function Hero() {
  return (
    <section id="home" className="relative scroll-mt-16 pb-20 pt-14 md:pb-28 md:pt-24">
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[68%]" />
      <Container className="relative">
        <motion.div initial="hidden" animate="show" variants={group}>
          <motion.div variants={fade} className="mb-8">
            <ArrowAction href="/projects" className="min-h-12 w-full px-5 text-[15px] sm:w-auto">
              Хийсэн төслүүд үзэх
            </ArrowAction>
          </motion.div>
          <motion.p
            variants={fade}
            className="flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-muted sm:text-xs sm:tracking-[0.18em]"
          >
            <motion.span
              aria-hidden
              className="h-px w-8 origin-left bg-ink"
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
              }}
            />
            ВЕБ ДИЗАЙН & ХӨГЖҮҮЛЭЛТ
          </motion.p>
          <h1 className="mt-5 text-[clamp(2.45rem,10.4vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            {lines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.08 + index * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            variants={fade}
            className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg md:text-xl"
          >
            Бэлэн загвараас сонго. Эсвэл өөрийн хүссэнээр хийлгэ.
          </motion.p>
        </motion.div>
        <ServiceCards />
      </Container>
    </section>
  );
}
