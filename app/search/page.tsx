import type { Metadata } from "next";
import { SymptomList } from "@/components/symptom/SymptomList";
import { SearchInput } from "@/components/ui/SearchInput";
import { searchSymptoms } from "@/lib/data";

export const metadata: Metadata = {
  title: "搜尋症狀"
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ?? "";
  const symptoms = await searchSymptoms(query);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">搜尋</p>
        <h1>搜尋症狀</h1>
        <p>輸入症狀、部位或關鍵字，找到相關的就醫科別參考。</p>
      </div>
      <SearchInput defaultValue={query} />
      {query ? (
        <div className="search-results-heading">
          找到 {symptoms.length} 個與「{query}」相關的結果
        </div>
      ) : null}
      <SymptomList symptoms={symptoms} />
    </section>
  );
}
