"use client";

import { motion } from "motion/react";

import { ArrowAction } from "@/components/ArrowAction";
import { useInquiry } from "@/components/InquiryProvider";
import { readyPrice } from "@/data/templates";
import { cn, EASE } from "@/lib/utils";

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.34 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

function onCardMove(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function ServiceCards() {
  const { openInquiry } = useInquiry();

  return (
    <motion.div
      className="mt-14 grid items-stretch gap-4 md:mt-20 md:grid-cols-2 md:gap-5"
      initial="hidden"
      animate="show"
      variants={list}
    >
      <motion.article
        variants={item}
        whileHover={{ y: -6, transition: { duration: 0.4, ease: EASE } }}
        onPointerMove={onCardMove}
        className="spotlight flex h-full flex-col rounded-[10px] border border-line bg-white p-7 shadow-[0_0_0_rgba(17,17,17,0)] transition-shadow duration-500 hover:shadow-[0_22px_50px_rgba(17,17,17,0.1)] md:p-9"
      >
        <div className="relative z-10 flex h-full flex-col">
          <h2 className="text-base font-medium">Бэлэн вебсайт</h2>
          <p className="mt-8 text-[2.5rem] font-semibold leading-none tracking-[-0.045em] tabular-nums md:text-5xl">
            {readyPrice}
          </p>
          <div className="mt-auto pt-12">
            <p className="text-[15px]">Статик вебсайт</p>
            <p className="mt-1 text-sm text-muted">Бэлэн загвар + эх код</p>
            <ArrowAction href="#templates" variant="text" className="mt-5">
              Загвар үзэх
            </ArrowAction>
          </div>
        </div>
      </motion.article>

      <motion.article
        variants={item}
        whileHover={{ y: -6, transition: { duration: 0.4, ease: EASE } }}
        onPointerMove={onCardMove}
        data-surface="dark"
        className={cn(
          "spotlight spotlight-dark flex h-full flex-col rounded-[10px] bg-card p-7 text-white shadow-[0_0_0_rgba(0,0,0,0)] transition-shadow duration-500 hover:shadow-[0_22px_50px_rgba(0,0,0,0.28)] md:p-9",
        )}
      >
        <div className="relative z-10 flex h-full flex-col">
          <h2 className="text-base font-medium">Захиалгат вебсайт</h2>
          <p className="mt-8 text-[2.5rem] font-semibold leading-none tracking-[-0.045em] md:text-5xl">
            Үнийн санал
          </p>
          <div className="mt-auto pt-12">
            <p className="text-[15px]">Dynamic веб систем</p>
            <p className="mt-1 text-sm text-white/60">Таны шаардлагад нийцүүлнэ</p>
            <ArrowAction
              variant="text"
              className="mt-5"
              onClick={() => openInquiry({ websiteType: "custom" })}
            >
              Хүсэлт илгээх
            </ArrowAction>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
