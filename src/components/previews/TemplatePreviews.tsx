"use client";

import { useState } from "react";

import type { Template } from "@/data/templates";

export function TemplatePreview({ template }: { template: Template }) {
  if (template.url) {
    return <LiveSitePreview url={template.url} title={template.brand} />;
  }
  if (template.id === "mono") return <MonoPreview template={template} />;
  if (template.id === "space") return <SpacePreview template={template} />;
  return <StudioPreview template={template} />;
}

function LiveSitePreview({ url, title }: { url: string; title: string }) {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative h-full w-full bg-white">
      {ready ? null : (
        <p className="absolute inset-0 z-10 flex items-center justify-center bg-white text-sm text-muted">
          Ачаалж байна
        </p>
      )}
      <iframe
        src={url}
        title={title}
        className="h-full w-full border-0"
        loading="lazy"
        onLoad={() => setReady(true)}
      />
    </div>
  );
}

function StudioPreview({ template }: { template: Template }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-ink">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <p className="text-sm font-semibold tracking-[-0.03em] sm:text-base">
          {template.brand}
        </p>
        <div className="flex gap-4 text-[11px] text-muted sm:gap-6 sm:text-xs">
          <span>Ажил</span>
          <span>Тухай</span>
          <span className="hidden sm:inline">Холбоо</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-center px-5 py-5 sm:px-8 sm:py-7">
          <p className="text-[10px] tracking-[0.16em] text-muted sm:text-[11px]">
            КОМПАНИ
          </p>
          <p className="mt-3 max-w-[12ch] text-[clamp(1.7rem,4.2vw,3.6rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
            {template.headline}
          </p>
          <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-[#555] sm:mt-4 sm:text-base">
            {template.description}
          </p>
        </div>
        <div className="relative min-h-28 overflow-hidden bg-card sm:min-h-0">
          <svg
            viewBox="0 0 400 520"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <rect
              x="46"
              y="46"
              width="308"
              height="428"
              fill="none"
              stroke="white"
              strokeOpacity="0.28"
            />
            <rect
              x="46"
              y="46"
              width="168"
              height="196"
              fill="none"
              stroke="white"
              strokeOpacity="0.85"
            />
            <path d="M46 392H354" stroke="white" strokeOpacity="0.4" />
            <path d="M214 46V242" stroke="white" strokeOpacity="0.4" />
            <circle cx="214" cy="242" r="3.5" fill="white" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-line px-5 py-3.5 text-[11px] sm:px-8 sm:py-4 sm:text-xs">
        <p>
          <span className="text-muted">01</span> Стратеги
        </p>
        <p>
          <span className="text-muted">02</span> Дизайн
        </p>
        <p>
          <span className="text-muted">03</span> Бүтээл
        </p>
      </div>
    </div>
  );
}

const products = [
  { name: "Пальто", price: "₮240,000", art: "coat" },
  { name: "Аяга", price: "₮48,000", art: "cup" },
  { name: "Дэнлүү", price: "₮120,000", art: "lamp" },
] as const;

function MonoPreview({ template }: { template: Template }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f7f7f6] text-ink">
      <div className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <p className="text-sm font-semibold tracking-[0.14em] sm:text-base">
          {template.brand}
        </p>
        <div className="flex gap-4 text-[11px] text-muted sm:text-xs">
          <span>Цуглуулга</span>
          <span>Дэлгүүр</span>
        </div>
      </div>

      <div className="px-5 pt-6 text-center sm:px-8 sm:pt-8">
        <p className="text-[clamp(1.8rem,4.4vw,4rem)] font-semibold leading-none tracking-[-0.045em]">
          {template.headline}
        </p>
        <p className="mx-auto mt-3 max-w-[28ch] text-sm text-muted sm:text-base">
          {template.description}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 px-4 pb-4 pt-5 sm:gap-4 sm:px-8 sm:pb-7 sm:pt-7">
        {products.map((product) => (
          <div key={product.name} className="flex min-h-0 flex-col">
            <div className="flex min-h-16 flex-1 items-center justify-center bg-white">
              <ProductArt type={product.art} />
            </div>
            <div className="pt-2 sm:pt-3">
              <p className="text-[11px] sm:text-sm">{product.name}</p>
              <p className="text-[10px] text-muted sm:text-xs">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductArt({ type }: { type: (typeof products)[number]["art"] }) {
  if (type === "coat") {
    return (
      <svg viewBox="0 0 80 110" className="h-[70%] w-auto" aria-hidden>
        <path
          d="M28 10h24l10 16-8 6v68H18V32l-8-6 10-16h8Z"
          fill="#151515"
        />
        <path d="M34 10c2 8 10 8 12 0" fill="none" stroke="white" strokeWidth="1.4" />
      </svg>
    );
  }

  if (type === "cup") {
    return (
      <svg viewBox="0 0 90 90" className="h-[58%] w-auto" aria-hidden>
        <circle cx="40" cy="45" r="22" fill="none" stroke="#151515" strokeWidth="2.2" />
        <path
          d="M62 38c10 2 12 16 2 20"
          fill="none"
          stroke="#151515"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 110" className="h-[70%] w-auto" aria-hidden>
      <path
        d="M22 28h36l-6 14H28L22 28Z"
        fill="none"
        stroke="#151515"
        strokeWidth="2"
      />
      <path d="M40 42v40" stroke="#151515" strokeWidth="2" />
      <path d="M28 86h24" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const services = [
  { name: "Зөвлөгөө", time: "30 мин", selected: false },
  { name: "Дизайн", time: "60 мин", selected: true },
  { name: "Сургалт", time: "45 мин", selected: false },
];

function SpacePreview({ template }: { template: Template }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-ink">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <p className="text-sm font-semibold tracking-[-0.03em] sm:text-base">
          {template.brand}
        </p>
        <span className="text-[11px] text-muted sm:text-xs">Нэвтрэх</span>
      </div>
      <div className="grid min-h-0 flex-1 sm:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-5 sm:px-8">
          <p className="max-w-[10ch] text-[clamp(1.7rem,4.2vw,3.5rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
            {template.headline}
          </p>
          <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-[#555] sm:mt-4 sm:text-base">
            {template.description}
          </p>
          <p className="mt-5 text-[10px] tracking-[0.14em] text-muted">ӨНӨӨДӨР</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["09:00", "11:00", "14:00"].map((time) => (
              <span
                key={time}
                className={
                  time === "11:00"
                    ? "inline-flex h-8 items-center bg-ink px-3 text-[11px] text-white sm:text-xs"
                    : "inline-flex h-8 items-center border border-line px-3 text-[11px] sm:text-xs"
                }
              >
                {time}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 border-t border-line bg-stone px-5 py-4 sm:border-t-0 sm:border-l sm:px-7">
          {services.map((service) => (
            <div
              key={service.name}
              className={
                service.selected
                  ? "flex items-center justify-between bg-ink px-3 py-2.5 text-white sm:px-4 sm:py-3"
                  : "flex items-center justify-between border border-line bg-white px-3 py-2.5 sm:px-4 sm:py-3"
              }
            >
              <span className="text-sm">{service.name}</span>
              <span
                className={
                  service.selected ? "text-xs text-white/70" : "text-xs text-muted"
                }
              >
                {service.time}
              </span>
            </div>
          ))}
          <div className="mt-1 flex h-10 items-center justify-center bg-ink text-xs text-white">
            Товлох
          </div>
        </div>
      </div>
    </div>
  );
}
