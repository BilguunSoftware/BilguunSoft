"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { WebsiteType } from "@/data/templates";

export type OpenInquiryOptions = {
  websiteType?: WebsiteType | "";
  templateId?: string | null;
};

type InquiryContextValue = {
  isOpen: boolean;
  session: number;
  websiteType: WebsiteType | "";
  templateId: string | null;
  openInquiry: (options?: OpenInquiryOptions) => void;
  closeInquiry: () => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(0);
  const [websiteType, setWebsiteType] = useState<WebsiteType | "">("");
  const [templateId, setTemplateId] = useState<string | null>(null);

  const openInquiry = useCallback((options?: OpenInquiryOptions) => {
    setWebsiteType(options?.websiteType ?? "");
    setTemplateId(options?.templateId ?? null);
    setSession((current) => current + 1);
    setIsOpen(true);
  }, []);

  const closeInquiry = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      session,
      websiteType,
      templateId,
      openInquiry,
      closeInquiry,
    }),
    [isOpen, session, websiteType, templateId, openInquiry, closeInquiry],
  );

  return (
    <MotionConfig reducedMotion="user">
      <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
    </MotionConfig>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);

  if (!context) {
    throw new Error("useInquiry must be used within InquiryProvider");
  }

  return context;
}
