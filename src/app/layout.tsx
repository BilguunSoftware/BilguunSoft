import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BilguunSoft — Веб дизайн & хөгжүүлэлт",
  description:
    "Бэлэн вебсайт ₮1,000,000. Загвараас сонгох эсвэл захиалгаар хийлгэх. Хүсэлт илгээгээрэй.",
  applicationName: "BilguunSoft",
  keywords: [
    "BilguunSoft",
    "вебсайт",
    "веб дизайн",
    "вэб хөгжүүлэлт",
    "Монгол",
  ],
  openGraph: {
    title: "BilguunSoft — Веб дизайн & хөгжүүлэлт",
    description: "Бэлэн загвараас сонго. Эсвэл өөрийн хүссэнээр хийлгэ.",
    locale: "mn_MN",
    type: "website",
    siteName: "BilguunSoft",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-ink">{children}</body>
    </html>
  );
}
