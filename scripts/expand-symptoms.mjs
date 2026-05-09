import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const symptoms = readJson("data/symptoms.json");
const symptomResults = readJson("data/symptomResults.json");
const bodyParts = readJson("data/bodyParts.json");

const variants = [
  { key: "base", label: "", titlePrefix: "" },
  { key: "persistent", label: "持續", titlePrefix: "持續" },
  { key: "sudden", label: "突然", titlePrefix: "突然" },
  { key: "mild", label: "輕微", titlePrefix: "輕微" },
  { key: "severe", label: "嚴重", titlePrefix: "嚴重" },
  { key: "recurrent", label: "反覆", titlePrefix: "反覆" },
  { key: "worsening", label: "加劇", titlePrefix: "" },
  { key: "night", label: "晚上", titlePrefix: "晚上" },
  { key: "morning", label: "早上", titlePrefix: "早上" },
  { key: "activity", label: "活動時", titlePrefix: "活動時" },
  { key: "left", label: "左側", titlePrefix: "左側" },
  { key: "right", label: "右側", titlePrefix: "右側" }
];

const expanded = [];
const usedSlugs = new Set();

for (const symptom of symptoms) {
  const result = symptomResults.find((item) => item.symptomId === symptom.id);
  const bodyPart = bodyParts.find((item) => item.id === symptom.bodyPartId);

  for (const variant of variants) {
    const name = buildVariantName(symptom.name, variant);
    const slug = variant.key === "base" ? symptom.slug : `${symptom.slug}-${variant.key}`;

    if (usedSlugs.has(slug)) {
      continue;
    }

    usedSlugs.add(slug);
    expanded.push({
      id: slug,
      baseId: symptom.id,
      baseSlug: symptom.slug,
      baseName: symptom.name,
      variantKey: variant.key,
      name,
      slug,
      bodyPartId: symptom.bodyPartId,
      bodyPartName: bodyPart?.name ?? "",
      bodyPartSlug: bodyPart?.slug ?? symptom.bodyPartId,
      departments: result?.departments ?? [],
      seeDoctorSoon: result?.seeDoctorSoon ?? "",
      emergency: result?.emergency ?? ""
    });
  }
}

fs.writeFileSync(path.join(root, "data/expanded-symptoms.json"), `${JSON.stringify(expanded, null, 2)}\n`);

console.log("Expanded symptoms generated:", expanded.length);

function buildVariantName(name, variant) {
  if (variant.key === "base") {
    return name;
  }

  if (variant.key === "worsening") {
    return `${name}加劇`;
  }

  return `${variant.titlePrefix}${name}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}
