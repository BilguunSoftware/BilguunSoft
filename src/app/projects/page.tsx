import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { MarketplaceShowcase } from "@/components/MarketplaceShowcase";
import { SiteFrame } from "@/components/SiteFrame";
import { marketplace } from "@/data/templates";

export const metadata: Metadata = {
  title: "Хийсэн төслүүд — BilguunSoft",
  description: "Зөвхөн захиалагчийн захиалгаар хийгдсэн вебсайтууд.",
};

export default function ProjectsPage() {
  return (
    <SiteFrame>
      <section className="scroll-mt-16 pb-4 pt-20 md:pt-28">
        <Container>
          <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] font-semibold tracking-[-0.04em]">
            Хийсэн төслүүд.
          </h1>
          <p className="mt-3 text-muted">
            Зөвхөн захиалагчийн захиалгаар хийгдсэн вебсайтууд.
          </p>
        </Container>
      </section>
      <section id="marketplace" className="scroll-mt-16 border-t border-line bg-stone py-20 md:py-28">
        <Container>
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold tracking-[-0.04em]">
              {marketplace.name}
            </h2>
            <p className="mt-3 text-muted">{marketplace.brand}</p>
          </div>
          <MarketplaceShowcase />
        </Container>
      </section>
    </SiteFrame>
  );
}
