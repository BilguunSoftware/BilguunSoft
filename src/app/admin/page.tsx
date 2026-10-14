import type { Metadata } from "next";
import { Suspense } from "react";

import { logout } from "@/app/admin/actions";
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
    <main className="min-h-full bg-white px-5 py-12 text-ink md:px-8">
      <div className="mx-auto w-full max-w-[880px]">
        {signedIn ? <InquiryList /> : <LoginPanel />}
      </div>
    </main>
  );
}

function LoginPanel() {
  return (
    <section className="mx-auto max-w-sm pt-10">
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

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">BilguunSoft</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Үнийн санал</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="min-h-11 text-sm text-muted hover:text-ink">
            Гарах
          </button>
        </form>
      </div>

      {collection ? null : (
        <p className="mt-8 rounded-[8px] border border-line bg-stone px-4 py-3 text-sm">
          Өгөгдлийн сан холбогдоогүй тул хүсэлт хадгалагдахгүй.
        </p>
      )}

      {collection && inquiries.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Хүсэлт ирээгүй байна.</p>
      ) : null}

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {inquiries.map((inquiry) => (
          <li key={inquiry._id.toString()} className="grid gap-2 py-5 sm:grid-cols-[160px_1fr]">
            <time className="text-sm text-muted" dateTime={inquiry.createdAt.toISOString()}>
              {dateFormat.format(inquiry.createdAt)}
            </time>
            <div>
              <p className="font-medium">{inquiry.name}</p>
              <p className="mt-1 text-sm">{inquiry.contact}</p>
              <p className="mt-2 text-sm text-muted">{typeLabels[inquiry.websiteType]}</p>
              {inquiry.templateName ? (
                <p className="mt-1 text-sm text-muted">{inquiry.templateName}</p>
              ) : null}
              {inquiry.message ? <p className="mt-3 text-sm leading-relaxed">{inquiry.message}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
