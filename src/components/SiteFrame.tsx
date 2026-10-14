import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InquiryModal } from "@/components/InquiryModal";
import { InquiryProvider } from "@/components/InquiryProvider";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <InquiryProvider>
      <Header />
      <main id="content">{children}</main>
      <Footer />
      <InquiryModal />
    </InquiryProvider>
  );
}
