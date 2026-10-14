"use client";

import { motion } from "motion/react";

import { ArrowAction } from "@/components/ArrowAction";
import { Container } from "@/components/Container";
import { useInquiry } from "@/components/InquiryProvider";
import { EASE } from "@/lib/utils";

export function Footer() {
  const { openInquiry } = useInquiry();

  return (
    <footer id="contact" data-surface="dark" className="scroll-mt-16 bg-footer text-white">
      <Container className="py-20 md:py-28">
        <motion.h2
          className="max-w-[12ch] overflow-hidden pb-1 text-[clamp(2.6rem,6.2vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.045em] sm:max-w-[14ch]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        >
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
            }}
          >
            Вебсайтаа эхлүүлье.
          </motion.span>
        </motion.h2>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
        >
          <ArrowAction variant="light" onClick={() => openInquiry()}>
            Хүсэлт гаргах
          </ArrowAction>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-12">
            <a href="mailto:Bilguunsoft12@gmail.com" className="group block">
              <span className="block text-sm text-white/60">Имэйл</span>
              <span className="mt-1 block text-base text-white underline-offset-4 group-hover:underline">
                Bilguunsoft12@gmail.com
              </span>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61594794234487"
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <span className="block text-sm text-white/60">Facebook</span>
              <span className="mt-1 block text-base text-white underline-offset-4 group-hover:underline">
                BilguunSoft
              </span>
            </a>
          </div>
        </motion.div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/60 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium tracking-[-0.03em] text-white">bilguunsoft.</p>
          <p>Веб дизайн & хөгжүүлэлт</p>
          <p>© 2026 BilguunSoft</p>
        </div>
      </Container>
    </footer>
  );
}
