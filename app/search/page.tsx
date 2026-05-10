import type { Metadata } from "next";
import { SymptomList } from "@/components/symptom/SymptomList";
import { SearchInput } from "@/components/ui/SearchInput";
import { getSymptomResults, searchSymptoms } from "@/lib/data";
import { buildGoogleSearchLinks, buildGoogleSearchUrl, suggestDepartmentsFromSearch } from "@/lib/search-support";

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
  const [symptoms, results] = await Promise.all([searchSymptoms(query), getSymptomResults()]);
  const suggestedDepartments = query
    ? suggestDepartmentsFromSearch({
        query,
        symptoms,
        results
      })
    : [];
  const googleLinks = query ? buildGoogleSearchLinks(query) : [];

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
      {query ? (
        <section className="google-search-panel" aria-labelledby="google-search-title">
          <div>
            <p className="eyebrow">補充搜尋</p>
            <h2 id="google-search-title">用 Google 補充查詢</h2>
            <p>
              站內資料會優先提供已整理的科別建議；Google 搜尋適合用來補充了解相關關鍵字，但不能取代醫師診斷。
            </p>
          </div>

          {suggestedDepartments.length > 0 ? (
            <div className="suggested-departments">
              <strong>依目前資料推測可先考慮：</strong>
              <div>
                {suggestedDepartments.map((department) => (
                  <span key={department}>{department}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="google-link-list">
            {googleLinks.map((link) => (
              <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            <a href={buildGoogleSearchUrl(query)} target="_blank" rel="noreferrer">
              查看更多 Google 搜尋結果
            </a>
          </div>
        </section>
      ) : null}
    </section>
  );
}
