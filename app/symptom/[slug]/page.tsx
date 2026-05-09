import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import seoPagesJson from "@/data/seo-pages.json";
import { generateSEOPageJsonLd, type SEOPage } from "@/lib/seo";

const seoPages = seoPagesJson as SEOPage[];

type SymptomPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return seoPages.map((page) => ({
    slug: page.slug
  }));
}

export async function generateMetadata({ params }: SymptomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = seoPages.find((item) => item.slug === slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/symptom/${page.baseSlug ?? page.slug}`
    }
  };
}

export default async function SymptomPage({ params }: SymptomPageProps) {
  const { slug } = await params;
  const page = seoPages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  const jsonLd = generateSEOPageJsonLd(page);

  return (
    <article className="symptom-article">
      <div className="symptom-breadcrumb">{page.bodyPartName || "症狀"} / {page.symptomName}</div>

      <header className="symptom-article-header">
        <h1>{page.h1}</h1>
        <p>{page.description}</p>
      </header>

      <section className="quick-answer" aria-labelledby="quick-answer-title">
        <h2 id="quick-answer-title">建議掛號科別</h2>
        <p>
          {page.symptomName}通常建議先看：
          <strong>{page.departments.length > 0 ? page.departments.join("、") : "家醫科或相關專科"}</strong>
        </p>
      </section>

      <section className="seo-section" aria-labelledby="possible-causes-title">
        <h2 id="possible-causes-title">可能原因</h2>
        <p>{page.intro}</p>
      </section>

      <section className="seo-section" aria-labelledby="departments-title">
        <h2 id="departments-title">建議科別</h2>
        <ul className="department-bullets">
          {page.departments.map((department) => (
            <li key={department}>{department}</li>
          ))}
        </ul>
      </section>

      <section className="seo-section" aria-labelledby="see-doctor-title">
        <h2 id="see-doctor-title">何時需要就醫</h2>
        <p>{page.seeDoctorSoon}</p>
      </section>

      <section className="seo-section emergency-section" aria-labelledby="emergency-title">
        <h2 id="emergency-title">何時需要急診</h2>
        <p>{page.emergency}</p>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title">常見問題</h2>

        <div className="faq-list">
          {page.faq.map((item) => (
            <div className="faq-item" key={item.q}>
              <h3>Q：{item.q}</h3>
              <p>A：{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="page-actions">
        {page.bodyPartSlug ? (
          <Button href={`/body-part/${page.bodyPartSlug}`} variant="secondary">
            查看{page.bodyPartName}其他症狀
          </Button>
        ) : null}
        <Button href="/" variant="ghost">
          回首頁
        </Button>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
    </article>
  );
}
