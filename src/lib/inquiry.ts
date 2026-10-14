import type { WebsiteType } from "@/data/templates";

export type InquiryPayload = {
  name: string;
  contact: string;
  websiteType: WebsiteType;
  message: string;
  templateId: string | null;
  templateName: string | null;
};

export type InquiryResult =
  | { status: "success" }
  | { status: "unconfigured"; message?: string }
  | { status: "error"; message: string };

export async function submitInquiry(
  payload: InquiryPayload,
  signal?: AbortSignal,
): Promise<InquiryResult> {
  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });

    const data = (await response.json().catch(() => null)) as
      | InquiryResult
      | null;

    if (
      data &&
      (data.status === "success" ||
        data.status === "unconfigured" ||
        data.status === "error")
    ) {
      return data;
    }

    return {
      status: "error",
      message: "Хүсэлтийг илгээж чадсангүй.",
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return {
      status: "error",
      message: "Холболт амжилтгүй боллоо.",
    };
  }
}
