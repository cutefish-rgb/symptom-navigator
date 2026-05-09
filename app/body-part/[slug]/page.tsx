import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SymptomList } from "@/components/symptom/SymptomList";
import { Button } from "@/components/ui/Button";
import { getBodyPartBySlug, getBodyParts, getSymptomsByBodyPart } from "@/lib/data";

type BodyPartPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const bodyParts = await getBodyParts();

  return bodyParts.map((bodyPart) => ({
    slug: bodyPart.slug
  }));
}

export async function generateMetadata({ params }: BodyPartPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bodyPart = await getBodyPartBySlug(slug);

  return {
    title: bodyPart ? `${bodyPart.name}症狀` : "找不到部位"
  };
}

export default async function BodyPartPage({ params }: BodyPartPageProps) {
  const { slug } = await params;
  const bodyPart = await getBodyPartBySlug(slug);

  if (!bodyPart) {
    notFound();
  }

  const symptoms = await getSymptomsByBodyPart(slug);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">身體部位</p>
        <h1>{bodyPart.name}</h1>
        <p>{bodyPart.description ?? `選擇一個${bodyPart.name}相關症狀，查看建議科別與就醫提醒。`}</p>
      </div>
      <SymptomList symptoms={symptoms} />
      <div className="page-actions">
        <Button href="/" variant="secondary">
          回首頁
        </Button>
      </div>
    </section>
  );
}
