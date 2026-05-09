import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const symptoms = readJson("data/symptoms.json");
const symptomResults = readJson("data/symptomResults.json");
const bodyParts = readJson("data/bodyParts.json");
const expandedSymptoms = process.env.SEO_USE_EXPANDED === "true" ? readOptionalJson("data/expanded-symptoms.json") : null;

const sourceSymptoms = expandedSymptoms ?? symptoms.map((symptom) => {
  const result = symptomResults.find((item) => item.symptomId === symptom.id);
  const bodyPart = bodyParts.find((item) => item.id === symptom.bodyPartId);

  return {
    id: symptom.id,
    baseId: symptom.id,
    baseSlug: symptom.slug,
    baseName: symptom.name,
    variantKey: "base",
    name: symptom.name,
    slug: symptom.slug,
    bodyPartId: symptom.bodyPartId,
    bodyPartName: bodyPart?.name ?? "",
    bodyPartSlug: bodyPart?.slug ?? symptom.bodyPartId,
    departments: result?.departments ?? [],
    seeDoctorSoon: result?.seeDoctorSoon ?? "",
    emergency: result?.emergency ?? ""
  };
});

const seoPages = sourceSymptoms.map((symptom) => {
  const bodyPartName = symptom.bodyPartName ?? "";
  const departments = symptom.departments ?? [];

  return {
    slug: symptom.slug,
    symptomId: symptom.id,
    symptomName: symptom.name,
    bodyPartId: symptom.bodyPartId,
    bodyPartName,
    bodyPartSlug: symptom.bodyPartSlug ?? symptom.bodyPartId,
    baseSlug: symptom.baseSlug ?? symptom.slug,
    baseName: symptom.baseName ?? symptom.name,
    variantKey: symptom.variantKey ?? "base",
    title: `${symptom.name}看哪一科？原因、症狀與就醫建議`,
    description: `${symptom.name}可能與${bodyPartName || "身體狀況"}相關，本頁提供建議科別、就醫時機與急診警訊。`,
    intro: `${symptom.name}是一種常見症狀，可能與${bodyPartName || "身體狀況"}相關，原因包含生活習慣、感染、發炎、循環或神經功能變化，也可能和既有疾病、藥物或近期外傷有關。`,
    h1: `${symptom.name}要看哪一科？`,
    departments,
    seeDoctorSoon: symptom.seeDoctorSoon ?? "",
    emergency: symptom.emergency ?? "",
    faq: [
      {
        q: `${symptom.name}一定嚴重嗎？`,
        a: "不一定，多數情況與生活習慣或短期因素有關，但仍需要依症狀持續時間與嚴重度判斷。"
      },
      {
        q: `${symptom.name}需要急診嗎？`,
        a: "若出現紅旗症狀，例如劇烈疼痛、意識改變、呼吸困難或單側無力，應立即就醫。"
      },
      {
        q: `${symptom.name}需要掛哪一科？`,
        a: departments.length
          ? `可以優先考慮${departments.join("、")}。`
          : "建議先由家醫科或相關專科評估。"
      }
    ]
  };
});

fs.writeFileSync(path.join(root, "data/seo-pages.json"), `${JSON.stringify(seoPages, null, 2)}\n`);

console.log("SEO pages generated:", seoPages.length);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function readOptionalJson(filePath) {
  const fullPath = path.join(root, filePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}
