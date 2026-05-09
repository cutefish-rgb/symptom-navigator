import Link from "next/link";
import type { Symptom } from "@/types/symptom";

type SymptomListProps = {
  symptoms: Symptom[];
};

export function SymptomList({ symptoms }: SymptomListProps) {
  if (symptoms.length === 0) {
    return <p className="empty-state">目前還沒有收錄這個部位的症狀。</p>;
  }

  return (
    <div className="symptom-list">
      {symptoms.map((symptom) => (
        <Link className="symptom-row" href={`/symptom/${symptom.slug}`} key={symptom.id}>
          <span>{symptom.name}</span>
          <small>{symptom.description}</small>
        </Link>
      ))}
    </div>
  );
}
