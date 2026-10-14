"use client";

import { ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { useInquiry } from "@/components/InquiryProvider";
import {
  getTemplateById,
  websiteTypeOptions,
  type WebsiteType,
} from "@/data/templates";
import { submitInquiry } from "@/lib/inquiry";
import { cn, EASE } from "@/lib/utils";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "unconfigured" }
  | { type: "success" }
  | { type: "error"; message: string };

type Errors = {
  name?: string;
  contact?: string;
  websiteType?: string;
};

function isValidContact(value: string) {
  const trimmed = value.trim();

  if (trimmed.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }

  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function InquiryModal() {
  const { isOpen, session, websiteType, templateId, closeInquiry } = useInquiry();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("#inquiry-name")?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInquiry();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const items = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];

      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, closeInquiry]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.3 } },
          }}
        >
          <div className="absolute inset-0 bg-[#111]/45" onClick={closeInquiry} />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.98 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.35, ease: EASE },
              },
            }}
            className="relative z-10 max-h-[min(680px,calc(100dvh-1.5rem))] w-full max-w-[460px] overflow-y-auto rounded-[10px] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-7"
          >
            <button
              type="button"
              className="absolute right-3 top-3 inline-flex size-10 items-center justify-center"
              onClick={closeInquiry}
              aria-label="Хаах"
            >
              <X className="size-4" />
            </button>
            <h2 id={titleId} className="pr-10 text-2xl font-semibold tracking-[-0.03em]">
              Хүсэлт илгээх
            </h2>
            <p id={descriptionId} className="mt-2 text-sm text-muted">
              Төслийнхөө талаар товч бичээрэй.
            </p>
            <InquiryForm
              key={session}
              initialType={websiteType}
              templateId={templateId}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function InquiryForm({
  initialType,
  templateId,
}: {
  initialType: WebsiteType | "";
  templateId: string | null;
}) {
  const template = getTemplateById(templateId);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [websiteType, setWebsiteType] = useState<WebsiteType | "">(initialType);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const selectedTemplate =
    websiteType === "ready" && template
      ? `${template.brand} — ${template.name}`
      : null;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (name.trim().length < 2) nextErrors.name = "Нэрээ оруулна уу.";
    if (!contact.trim()) {
      nextErrors.contact = "Утас эсвэл и-мэйл оруулна уу.";
    } else if (!isValidContact(contact)) {
      nextErrors.contact = "Утас эсвэл и-мэйл буруу байна.";
    }
    if (websiteType !== "ready" && websiteType !== "custom") {
      nextErrors.websiteType = "Вебсайтын төрлөө сонгоно уу.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = nextErrors.name
        ? "inquiry-name"
        : nextErrors.contact
          ? "inquiry-contact"
          : "inquiry-type";
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus({ type: "loading" });

    try {
      const result = await submitInquiry(
        {
          name: name.trim(),
          contact: contact.trim(),
          websiteType: websiteType as WebsiteType,
          message: message.trim(),
          templateId: selectedTemplate ? template?.id ?? null : null,
          templateName: selectedTemplate,
        },
        controller.signal,
      );

      if (result.status === "error") {
        setStatus({
          type: "error",
          message: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
        });
        return;
      }

      setStatus(
        result.status === "success" ? { type: "success" } : { type: "unconfigured" },
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus({
        type: "error",
        message: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
      });
    }
  }

  const busy = status.type === "loading";

  return (
    <form className="mt-6 space-y-4" noValidate onSubmit={onSubmit}>
      {selectedTemplate ? (
        <p className="rounded-[8px] border border-line bg-stone px-3 py-2.5 text-sm">
          <span className="text-muted">Сонгосон загвар</span>
          <span className="mt-0.5 block font-medium">{selectedTemplate}</span>
        </p>
      ) : null}

      <Field
        id="inquiry-name"
        label="Таны нэр"
        error={errors.name}
      >
        <input
          id="inquiry-name"
          name="name"
          autoComplete="name"
          value={name}
          disabled={busy}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "inquiry-name-error" : undefined}
          onChange={(event) => setName(event.target.value)}
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <Field
        id="inquiry-contact"
        label="Утас эсвэл и-мэйл"
        error={errors.contact}
      >
        <input
          id="inquiry-contact"
          name="contact"
          autoComplete="on"
          inputMode="email"
          value={contact}
          disabled={busy}
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={errors.contact ? "inquiry-contact-error" : undefined}
          onChange={(event) => setContact(event.target.value)}
          className={inputClass(Boolean(errors.contact))}
        />
      </Field>

      <Field
        id="inquiry-type"
        label="Вебсайтын төрөл"
        error={errors.websiteType}
      >
        <div className="relative">
          <select
            id="inquiry-type"
            name="websiteType"
            value={websiteType}
            disabled={busy}
            aria-invalid={Boolean(errors.websiteType)}
            aria-describedby={errors.websiteType ? "inquiry-type-error" : undefined}
            onChange={(event) =>
              setWebsiteType(event.target.value as WebsiteType | "")
            }
            className={cn(inputClass(Boolean(errors.websiteType)), "appearance-none pr-10")}
          >
            <option value="">Сонгох</option>
            {websiteTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        </div>
      </Field>

      <Field id="inquiry-message" label="Нэмэлт мэдээлэл">
        <textarea
          id="inquiry-message"
          name="message"
          rows={4}
          maxLength={1000}
          value={message}
          disabled={busy}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(inputClass(false), "h-auto resize-y py-3 leading-relaxed")}
        />
      </Field>

      <div aria-live="polite">
        {status.type === "unconfigured" ? (
          <div className="rounded-[8px] border border-line bg-stone px-3 py-3 text-sm leading-relaxed">
            <p className="font-medium">Хүсэлт илгээгдээгүй.</p>
            <p className="mt-1 text-muted">
              Сервер холболт тохируулаагүй тул мэдээлэл хадгалагдаагүй. Энэ нь демо горим.
            </p>
          </div>
        ) : null}
        {status.type === "success" ? (
          <div className="rounded-[8px] border border-line bg-stone px-3 py-3 text-sm leading-relaxed">
            <p className="font-medium">Хүсэлт илгээгдлээ.</p>
            <p className="mt-1 text-muted">Бид тантай холбогдоно.</p>
          </div>
        ) : null}
        {status.type === "error" ? (
          <p className="text-sm font-medium">{status.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center rounded-[8px] bg-ink text-sm font-medium text-white transition-colors duration-300 hover:bg-[#2a2a2a] disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? "Илгээж байна…" : "Илгээх"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-11 w-full rounded-[8px] border bg-white px-3 text-base text-ink transition-colors duration-200 placeholder:text-muted disabled:opacity-60",
    invalid ? "border-ink" : "border-line focus:border-ink",
  );
}
