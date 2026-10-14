"use client";

import { motion } from "motion/react";

import { Container } from "@/components/Container";
import { cn, EASE } from "@/lib/utils";

const steps = [
  { number: "01", title: "Загвараа сонго" },
  { number: "02", title: "Хүсэлт илгээ" },
  { number: "03", title: "Бид холбогдоно" },
];

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export function ProcessSteps() {
  return (
    <section className="border-t border-line py-14 md:py-20" aria-label="Захиалгын алхам">
      <Container>
        <motion.div
          className="mb-8 hidden h-px origin-left bg-ink sm:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 1.05, ease: EASE }}
        />
        <motion.ol
          className="grid sm:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          variants={list}
        >
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              variants={item}
              className={cn(
                "flex items-baseline gap-4 border-line py-4 sm:flex-col sm:items-start sm:gap-3 sm:py-1",
                index > 0 && "sm:border-l sm:pl-8",
                index < steps.length - 1 && "border-b sm:border-b-0",
              )}
            >
              <span className="w-8 shrink-0 text-sm text-muted sm:w-auto">
                {step.number}
              </span>
              <span className="text-[17px] font-medium tracking-[-0.02em] md:text-xl">
                {step.title}
              </span>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
