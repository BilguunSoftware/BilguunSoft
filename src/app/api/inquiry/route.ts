import { NextResponse } from "next/server";

import type { InquiryPayload, InquiryResult } from "@/lib/inquiry";
import { inquiriesCollection } from "@/lib/db";

type InquiryBody = Partial<InquiryPayload>;

function json(body: InquiryResult, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let body: InquiryBody;

  try {
    body = (await request.json()) as InquiryBody;
  } catch {
    return json({ status: "error", message: "Invalid JSON" }, 400);
  }

  const name = body.name?.trim() ?? "";
  const contact = body.contact?.trim() ?? "";
  const websiteType = body.websiteType;
  const message = body.message?.trim() ?? "";

  if (
    name.length < 2 ||
    contact.length < 3 ||
    (websiteType !== "ready" && websiteType !== "custom")
  ) {
    return json({ status: "error", message: "Validation failed" }, 400);
  }

  try {
    const collection = await inquiriesCollection();

    if (!collection) {
      return json(
        {
          status: "unconfigured",
          message: "Inquiry backend is not configured.",
        },
        501,
      );
    }

    await collection.insertOne({
      name,
      contact,
      websiteType,
      message,
      templateId: body.templateId ?? null,
      templateName: body.templateName ?? null,
      createdAt: new Date(),
    });

    return json({ status: "success" }, 200);
  } catch {
    return json({ status: "error", message: "Database request failed" }, 502);
  }
}
