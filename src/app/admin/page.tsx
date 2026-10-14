import type { Metadata } from "next";
import { Suspense } from "react";

import { logout } from "@/app/admin/actions";
import { DeleteInquiryButton } from "@/app/admin/delete-inquiry";
import { LoginForm } from "@/app/admin/login-form";
import { adminIsSignedIn } from "@/lib/admin-auth";
import { inquiriesCollection, type InquiryRecord } from "@/lib/db";

export const metadata: Metadata = {
  title: "Админ — BilguunSoft",
  robots: { index: false, follow: false },
};

const typeLabels: Record<InquiryRecord["websiteType"], string> = {
  ready: "Бэлэн вебсайт",
  custom: "Захиалгат вебсайт",
};

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ulaanbaatar",
});

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Ачаалж байна</p>}>
      <AdminScreen />
    </Suspense>
  );
}

async function AdminScreen() {
  const signedIn = await adminIsSignedIn();

  return (
    <main className="min-h-dvh bg-stone px-5 py-10 text-ink md:px-8 md:py-14">
      <div className="mx-auto w-full max-w-[880px]">
        {signedIn ? <InquiryList /> : <LoginPanel />}
      </div>
    </main>
  );
}

function LoginPanel() {
  return (
    <section className="mx-auto mt-10 max-w-sm rounded-[10px] border border-line bg-white px-6 py-8">
      <p className="text-sm text-muted">BilguunSoft</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Админ</h1>
      <LoginForm />
    </section>
  );
}

async function InquiryList() {
  let collection: Awaited<ReturnType<typeof inquiriesCollection>> = null;

  try {
    collection = await inquiriesCollection();
  } catch {
    collection = null;
  }

  const inquiries = collection
    ? await collection.find().sort({ createdAt: -1 }).limit(200).toArray()
    : [];

  const readyCount = inquiries.filter((inquiry) => inquiry.websiteType === "ready").length;
  const customCount = inquiries.filter((inquiry) => inquiry.websiteType === "custom").length;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">bilguunsoft.</p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,2.6rem)] font-semibold tracking-[-0.04em]">
            Үнийн санал
          </h1>
          <p className="mt-2 text-sm text-muted">Ирсэн хүсэлтүүд</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-[8px] border border-line bg-white px-4 text-sm hover:border-ink"
          >
            Гарах
          </button>
        </form>
      </div>

      {collection ? null : (
        <p className="mt-8 rounded-[10px] border border-line bg-white px-4 py-3 text-sm">
          Өгөгдлийн сан холбогдоогүй тул хүсэлт хадгалагдахгүй.
        </p>
      )}

      <dl className="mt-8 grid grid-cols-3 overflow-hidden rounded-[10px] border border-line bg-white">
        <Stat label="Нийт" value={inquiries.length} />
        <Stat label="Бэлэн" value={readyCount} />
        <Stat label="Захиалгат" value={customCount} />
      </dl>

      {collection && inquiries.length === 0 ? (
        <p className="mt-4 rounded-[10px] border border-line bg-white px-5 py-10 text-center text-sm text-muted">
          Хүсэлт ирээгүй байна.
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {inquiries.map((inquiry) => {
          const id = inquiry._id.toString();
          const contact = inquiry.contact.trim();
          const contactHref = contact.includes("@") ? `mailto:${contact}` : `tel:${contact}`;

          return (
            <li key={id} className="rounded-[10px] border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-medium tracking-[-0.03em]">{inquiry.name}</p>
                  <a href={contactHref} className="mt-1 block truncate text-sm hover:underline">
                    {contact}
                  </a>
                </div>
                <DeleteInquiryButton id={id} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded-full border border-line px-2.5 py-1 text-xs">
                  {typeLabels[inquiry.websiteType]}
                </span>
                <time className="text-xs text-muted" dateTime={inquiry.createdAt.toISOString()}>
                  {dateFormat.format(inquiry.createdAt)}
                </time>
              </div>
              {inquiry.templateName ? (
                <p className="mt-3 text-sm text-muted">{inquiry.templateName}</p>
              ) : null}
              {inquiry.message ? (
                <p className="mt-3 text-sm leading-relaxed">{inquiry.message}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-line px-4 py-4 last:border-r-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{value}</dd>
    </div>
  );
}
