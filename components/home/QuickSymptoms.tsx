import Link from "next/link";
import type { Symptom } from "@/types/symptom";

type QuickSymptomsProps = {
  symptoms: Symptom[];
};

export function QuickSymptoms({ symptoms }: QuickSymptomsProps) {
  return (
    <section className="quick-section" aria-labelledby="quick-title">
      <div className="section-heading">
        <p className="eyebrow">常見入口</p>
        <h2 id="quick-title">快速查看症狀</h2>
      </div>
      <div className="quick-list">
        {symptoms.slice(0, 12).map((symptom) => (
          <Link href={`/symptom/${symptom.slug}`} key={symptom.id}>
            {symptom.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
