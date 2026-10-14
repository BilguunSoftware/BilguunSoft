import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SiteFrame } from "@/components/SiteFrame";
import { TemplateShowcase } from "@/components/TemplateShowcase";

export default function HomePage() {
  return (
    <SiteFrame>
      <Hero />
      <TemplateShowcase />
      <ProcessSteps />
    </SiteFrame>
  );
}
