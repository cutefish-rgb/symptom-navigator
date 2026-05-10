import type { Symptom, SymptomResult } from "@/types/symptom";
import { normalizeText } from "@/lib/helpers";

const fallbackDepartmentRules: Array<{ keywords: string[]; departments: string[] }> = [
  { keywords: ["尿", "頻尿", "血尿", "排尿", "夜尿"], departments: ["泌尿科", "家醫科"] },
  { keywords: ["胸", "心", "心悸", "胸悶", "胸痛"], departments: ["心臟內科", "胸腔內科", "家醫科"] },
  { keywords: ["頭", "暈", "麻", "無力", "抽搐", "記憶"], departments: ["神經內科", "家醫科"] },
  { keywords: ["眼", "視力", "飛蚊"], departments: ["眼科"] },
  { keywords: ["耳", "鼻", "喉", "咳", "聲音"], departments: ["耳鼻喉科", "家醫科"] },
  { keywords: ["腹", "胃", "便", "吐", "黃疸", "肝"], departments: ["腸胃內科", "家醫科"] },
  { keywords: ["皮膚", "疹", "癢", "痘", "水泡", "掉髮"], departments: ["皮膚科", "家醫科"] },
  { keywords: ["骨", "關節", "膝", "手腕", "腳踝", "背", "腰"], departments: ["骨科", "復健科"] },
  { keywords: ["瘀青", "發燒", "盜汗", "體重"], departments: ["家醫科", "血液腫瘤科"] }
];

export function buildGoogleSearchUrl(query: string) {
  const search = new URLSearchParams({
    q: `${query} 看哪一科 症狀 就醫建議`
  });

  return `https://www.google.com/search?${search.toString()}`;
}

export function buildGoogleSearchLinks(query: string) {
  return [
    {
      label: `${query}看哪一科`,
      href: googleUrl(`${query} 看哪一科`)
    },
    {
      label: `${query}可能原因`,
      href: googleUrl(`${query} 原因`)
    },
    {
      label: `${query}急診警訊`,
      href: googleUrl(`${query} 什麼情況要急診`)
    }
  ];
}

export function suggestDepartmentsFromSearch({
  query,
  symptoms,
  results
}: {
  query: string;
  symptoms: Symptom[];
  results: SymptomResult[];
}) {
  const keyword = normalizeText(query);
  const scores = new Map<string, number>();

  for (const symptom of symptoms) {
    const haystack = normalizeText([symptom.name, symptom.slug, symptom.description].join(" "));

    if (!keyword || !haystack.includes(keyword)) {
      continue;
    }

    const result = results.find((item) => item.symptomId === symptom.id);

    for (const department of result?.departments ?? []) {
      scores.set(department, (scores.get(department) ?? 0) + 2);
    }
  }

  for (const rule of fallbackDepartmentRules) {
    if (rule.keywords.some((item) => keyword.includes(normalizeText(item)))) {
      for (const department of rule.departments) {
        scores.set(department, (scores.get(department) ?? 0) + 1);
      }
    }
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hant"))
    .slice(0, 4)
    .map(([department]) => department);
}

function googleUrl(query: string) {
  const search = new URLSearchParams({ q: query });
  return `https://www.google.com/search?${search.toString()}`;
}
