"use client";

import { ArrowAction } from "@/components/ArrowAction";
import { Reveal } from "@/components/Reveal";
import { TemplatePreview } from "@/components/previews/TemplatePreviews";
import { marketplace } from "@/data/templates";

export function MarketplaceShowcase() {
  return (
    <Reveal>
      <div className="mt-8 overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_24px_50px_rgba(17,17,17,0.05)]">
        <div className="relative flex h-10 items-center border-b border-line bg-[#f3f3f2] px-4">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-[7px] rounded-full bg-[#d4d4d4]" />
            <span className="size-[7px] rounded-full bg-[#cfcfcf]" />
            <span className="size-[7px] rounded-full bg-[#c8c8c8]" />
          </div>
          <p className="pointer-events-none absolute inset-x-10 text-center text-[11px] text-muted">
            {marketplace.brand}
          </p>
          <a
            href={marketplace.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[11px] text-muted transition-colors hover:text-ink"
          >
            Нээх ↗
          </a>
        </div>

        <div className="relative aspect-[1/2] overflow-hidden sm:aspect-[16/11] lg:aspect-[16/10]">
          <TemplatePreview template={marketplace} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-medium tracking-[-0.03em] sm:text-xl">
            {marketplace.brand}
          </p>
          <p className="mt-1 max-w-md text-sm text-muted">{marketplace.description}</p>
        </div>
        <ArrowAction
          href={marketplace.url}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          Сайт нээх
        </ArrowAction>
      </div>
    </Reveal>
  );
}
