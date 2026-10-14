export const readyPrice = "₮1,000,000";

export type WebsiteType = "ready" | "custom";

export const websiteTypeOptions: { value: WebsiteType; label: string }[] = [
  { value: "ready", label: `Бэлэн вебсайт — ${readyPrice}` },
  { value: "custom", label: "Захиалгат вебсайт — Үнийн санал" },
];

export type Template = {
  id: string;
  brand: string;
  name: string;
  headline: string;
  description: string;
  url?: string;
};

export type TemplateCategory = {
  id: string;
  tab: string;
  templates: Template[];
};

export const marketplace: Template = {
  id: "bb-eternity",
  brand: "Bayan Burd Eternity",
  name: "Developer Marketplace",
  headline: "Таны бизнесийг дэмжих технологийн найдвартай түнш",
  description: "Тоног төхөөрөмж, программ хангамж, веб системийн нэгдсэн портал.",
  url: "https://www.bb-eternity.mn/",
};

export const projects: Template[] = [
  {
    id: "kubo",
    brand: "KUBO",
    name: "Барилга, интерьер, Вебсайт",
    headline: "Build your own space",
    description: "Архитектур, интерьер студи.",
    url: "https://kubo-phi.vercel.app/",
  },
  {
    id: "mira",
    brand: "MIRA",
    name: "Барилга, интерьер, Вебсайт",
    headline: "Орон зайн мэдрэмж",
    description: "Орон зайн ателье.",
    url: "https://mira-seven-peach-80.vercel.app/",
  },
  {
    id: "formax",
    brand: "FORMA X",
    name: "Барилга, интерьер, Вебсайт",
    headline: "Орон зайг эвдэ. Шинээр бүтээ.",
    description: "Архитектур ба интерьер студи.",
    url: "https://formax-pied.vercel.app/",
  },
];

export const companyInterviews: Template[] = [
  {
    id: "verso",
    brand: "VERSO",
    name: "Company Interview",
    headline: "Өөр өнцөг. Илүү өргөн боломж.",
    description: "Хүмүүс, санаа, боломжийг холбосон компанийн танилцуулга.",
    url: "https://verso-sepia-phi.vercel.app/",
  },
  {
    id: "sfera",
    brand: "SFERA",
    name: "Company Interview",
    headline: "Өөр өнцгөөс хар.",
    description: "Хөдөлгөөнд байгаа компанийн танилцуулга.",
    url: "https://sfera-theta.vercel.app/",
  },
  {
    id: "vectra",
    brand: "VECTRA",
    name: "Company Interview",
    headline: "Тод хараа. Зөв шийдэл. Бодит ахиц.",
    description: "Стратеги, хүмүүс, хэрэгжилтийг нэгтгэсэн компанийн танилцуулга.",
    url: "https://vectra-eight-vert.vercel.app/",
  },
];

export const categories: TemplateCategory[] = [
  {
    id: "interior",
    tab: "Барилга, интерьер, Вебсайт",
    templates: projects,
  },
  {
    id: "company-interview",
    tab: "Company Interview",
    templates: companyInterviews,
  },
];

export const templates: Template[] = categories.flatMap(
  (category) => category.templates,
);

export function getTemplateById(id: string | null) {
  if (!id) return null;
  return templates.find((template) => template.id === id) ?? null;
}
