import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const symptoms = readJson("data/symptoms.json");
const symptomResults = readJson("data/symptomResults.json");
const bodyParts = readJson("data/bodyParts.json");

const limit = Number.parseInt(process.env.DAILY_AI_LIMIT ?? "25", 10);
const today = new Date().toISOString();
const selectedSymptoms = symptoms.slice(0, Number.isFinite(limit) ? limit : 25);

const generated = selectedSymptoms.flatMap((symptom) => {
  const bodyPart = bodyParts.find((item) => item.id === symptom.bodyPartId);
  const result = symptomResults.find((item) => item.symptomId === symptom.id);
  const related = findRelatedSymptoms(symptom);
  const departments = result?.departments ?? ["家醫科"];

  return [
    createContent(symptom, "intent", {
      keywords: [
        `${symptom.name}看哪一科`,
        `${symptom.name}原因`,
        `${symptom.name}怎麼辦`,
        `${symptom.name}需要急診嗎`,
        `${symptom.name}危險嗎`
      ]
    }),
    createContent(symptom, "faq", {
      items: [
        {
          q: `${symptom.name}可能和${bodyPart?.name ?? "身體狀況"}有關嗎？`,
          a: `${symptom.name}可能與${bodyPart?.name ?? "身體狀況"}相關，也可能受到生活作息、感染、發炎或其他身體因素影響。`
        },
        {
          q: `${symptom.name}應該先看哪一科？`,
          a: `可以優先考慮${departments.join("、")}；若不確定或症狀複雜，可先由家醫科評估。`
        }
      ]
    }),
    createContent(symptom, "synonym", {
      synonyms: buildSynonyms(symptom.name)
    }),
    createContent(symptom, "link", {
      related: related.map((item) => ({
        slug: item.slug,
        name: item.name
      }))
    })
  ];
});

const safeGenerated = generated.map((item) => {
  const safety = checkSafety(item);

  return {
    ...item,
    reviewStatus: safety.ok ? "pending" : "rejected",
    safetyNotes: safety.notes,
    createdAt: today
  };
});

fs.writeFileSync(path.join(root, "data/ai-generated-content.json"), `${JSON.stringify(safeGenerated, null, 2)}\n`);

console.log("Daily AI content generated:", safeGenerated.length);
console.log("Pending review:", safeGenerated.filter((item) => item.reviewStatus === "pending").length);
console.log("Rejected by safety filter:", safeGenerated.filter((item) => item.reviewStatus === "rejected").length);

function createContent(symptom, type, content) {
  return {
    symptomId: symptom.id,
    symptomSlug: symptom.slug,
    symptomName: symptom.name,
    type,
    content,
    source: "daily-rule-engine"
  };
}

function buildSynonyms(symptomName) {
  return [
    `${symptomName}怎麼辦`,
    `${symptomName}原因`,
    `${symptomName}看哪科`,
    `${symptomName}危險嗎`
  ];
}

function findRelatedSymptoms(symptom) {
  return symptoms
    .filter((item) => item.id !== symptom.id && item.bodyPartId === symptom.bodyPartId)
    .slice(0, 4);
}

function checkSafety(item) {
  const serialized = JSON.stringify(item.content);
  const forbidden = [
    "不用就醫",
    "不用看醫生",
    "自行服藥",
    "保證",
    "一定是",
    "一定不是",
    "診斷為",
    "吃藥即可"
  ];
  const matched = forbidden.filter((term) => serialized.includes(term));

  if (matched.length > 0) {
    return {
      ok: false,
      notes: `Contains forbidden medical certainty or treatment wording: ${matched.join(", ")}`
    };
  }

  return {
    ok: true,
    notes: "Generated as low-risk SEO support content. Requires review before publication."
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

