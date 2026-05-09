import type { BodyPart } from "@/types/bodyPart";
import type { Symptom, SymptomResult } from "@/types/symptom";

export type FAQItem = {
  q: string;
  a: string;
};

export type SEOPage = {
  slug: string;
  symptomId: string;
  symptomName: string;
  bodyPartId: string;
  bodyPartName: string;
  bodyPartSlug: string;
  title: string;
  description: string;
  intro: string;
  h1: string;
  departments: string[];
  seeDoctorSoon: string;
  emergency: string;
  faq: FAQItem[];
  baseSlug?: string;
  baseName?: string;
  variantKey?: string;
};

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function generateTitle(symptomName: string) {
  return `${symptomName}看哪一科？原因、症狀與就醫建議`;
}

export function generateDescription(symptomName: string) {
  return `${symptomName}通常需要看哪一科？提供建議科別、就醫時機、急診警訊與常見問題。`;
}

export function generateIntro(symptomName: string, bodyPartName?: string) {
  const bodyPartText = bodyPartName ? `身體的${bodyPartName}` : "身體狀況";

  return `${symptomName}是一種常見症狀，可能與${bodyPartText}相關，原因包含生活習慣、感染、發炎、循環或神經功能變化，也可能和既有疾病、藥物或近期外傷有關。`;
}

export function generateFAQ(symptomName: string): FAQItem[] {
  return [
    {
      q: `${symptomName}一定很嚴重嗎？`,
      a: "不一定，多數情況可能和短期因素、生活習慣或輕微感染有關，但仍需要依症狀持續時間與嚴重度判斷。"
    },
    {
      q: `${symptomName}可以先觀察嗎？`,
      a: "若症狀輕微且短期出現，可以先觀察；如果症狀惡化、反覆發生，或出現急診警訊，建議盡快就醫。"
    },
    {
      q: `${symptomName}需要掛哪一科？`,
      a: "建議科別會依症狀資料對應產生；若症狀嚴重、持續或不確定，建議先由家醫科或相關專科評估。"
    }
  ];
}

export function generateMedicalJsonLd({
  symptom,
  bodyPart,
  result,
  faq
}: {
  symptom: Symptom;
  bodyPart: BodyPart | null;
  result: SymptomResult;
  faq: FAQItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${symptom.name}看哪一科`,
    description: `${symptom.name}的就醫建議、建議科別與急診警訊`,
    url: `${getSiteUrl()}/symptom/${symptom.slug}`,
    about: {
      "@type": "MedicalCondition",
      name: symptom.name,
      bodyLocation: bodyPart?.name,
      possibleTreatment: result.departments.map((department) => ({
        "@type": "MedicalTherapy",
        name: department
      }))
    },
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}

export function generateSEOPageJsonLd(page: SEOPage) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.title,
    description: page.description,
    url: `${getSiteUrl()}/symptom/${page.slug}`,
    about: {
      "@type": "MedicalCondition",
      name: page.symptomName,
      bodyLocation: page.bodyPartName,
      possibleTreatment: page.departments.map((department) => ({
        "@type": "MedicalTherapy",
        name: department
      }))
    },
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}
