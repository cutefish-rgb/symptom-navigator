import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bodyParts = readJson("data/bodyParts.json");
const symptoms = readJson("data/symptoms.json");
const symptomResults = readJson("data/symptomResults.json");

const departmentSlugs = {
  一般外科: "general-surgery",
  家醫科: "family-medicine",
  心臟內科: "cardiology",
  急診醫學科: "emergency-medicine",
  感染科: "infectious-disease",
  泌尿科: "urology",
  皮膚科: "dermatology",
  神經內科: "neurology",
  神經外科: "neurosurgery",
  耳鼻喉科: "ent",
  胸腔內科: "pulmonology",
  腎臟內科: "nephrology",
  腸胃內科: "gastroenterology",
  肝膽腸胃科: "hepatobiliary-gastroenterology",
  血液腫瘤科: "hematology-oncology",
  身心科: "psychiatry",
  過敏免疫科: "allergy-immunology",
  風濕免疫科: "rheumatology-immunology",
  復健科: "rehabilitation",
  骨科: "orthopedics",
  眼科: "ophthalmology"
};

const departmentDescriptions = {
  一般外科: "處理需外科評估的急性疼痛、腫塊、感染與傷口問題。",
  家醫科: "適合初步評估常見症狀、慢性問題與轉診方向。",
  心臟內科: "評估胸痛、心悸、心律不整、心衰竭與心血管風險。",
  急診醫學科: "處理急性、嚴重或可能危及生命的症狀。",
  感染科: "評估不明發燒、反覆感染與特殊感染問題。",
  泌尿科: "評估排尿、血尿、泌尿道感染與男性泌尿生殖問題。",
  皮膚科: "評估皮疹、搔癢、感染、掉髮與皮膚腫塊。",
  神經內科: "評估頭痛、暈眩、無力、抽搐、記憶與神經功能異常。",
  神經外科: "評估脊椎神經壓迫、外傷或可能需要手術的神經問題。",
  耳鼻喉科: "評估耳、鼻、喉、聲音、吞嚥與平衡相關症狀。",
  胸腔內科: "評估咳嗽、呼吸困難、胸悶與肺部疾病。",
  腎臟內科: "評估腎功能、尿液異常、水腫與電解質問題。",
  腸胃內科: "評估腹痛、消化不適、排便改變與腸胃道症狀。",
  肝膽腸胃科: "評估黃疸、肝膽功能、右上腹痛與肝膽胰相關症狀。",
  血液腫瘤科: "評估不明瘀青、貧血、血球異常、夜間盜汗與體重下降。",
  身心科: "評估情緒、焦慮、睡眠與認知相關困擾。",
  過敏免疫科: "評估過敏、蕁麻疹與免疫相關症狀。",
  風濕免疫科: "評估發炎性關節、晨僵與自體免疫相關症狀。",
  復健科: "評估肌骨疼痛、活動受限與復健治療需求。",
  骨科: "評估骨折、關節、骨骼、韌帶與肌腱相關症狀。",
  眼科: "評估視力、眼痛、紅眼、乾眼與眼部急症。"
};

const redFlags = [
  { slug: "altered-consciousness", description: "意識改變、混亂或反應明顯變慢" },
  { slug: "shortness-of-breath", description: "呼吸困難、喘到無法說完整句子或嘴唇發紫" },
  { slug: "one-sided-weakness", description: "單側無力、臉歪、說話不清或疑似中風症狀" },
  { slug: "severe-chest-pain", description: "壓迫性胸痛、冒冷汗、疼痛延伸到左臂或下巴" },
  { slug: "severe-headache", description: "突然劇烈頭痛或此生最嚴重頭痛" },
  { slug: "high-fever", description: "高燒不退、發燒合併劇痛或嚴重感染跡象" },
  { slug: "major-bleeding", description: "大量出血、吐血、黑便、血尿量多或出血不止" },
  { slug: "severe-abdominal-pain", description: "劇烈腹痛、腹部變硬或持續嘔吐" },
  { slug: "vision-loss", description: "突然視力喪失、視野缺損或劇烈眼痛" },
  { slug: "urine-retention", description: "完全尿不出來或尿滯留合併疼痛" },
  { slug: "seizure", description: "抽搐超過五分鐘、連續發作或首次抽搐" },
  { slug: "major-trauma", description: "重大外傷、疑似骨折、變形或無法承重" },
  { slug: "severe-allergy", description: "嘴唇舌頭腫、喉嚨緊、喘或嚴重過敏反應" },
  { slug: "rapid-swelling", description: "快速腫大、紅腫熱痛擴散或疑似深部感染" }
];

const redFlagMatchers = [
  ["altered-consciousness", /意識|混亂|反應|不清/],
  ["shortness-of-breath", /呼吸困難|休息仍喘|嘴唇發紫|無法說完整句子|喘/],
  ["one-sided-weakness", /單側|臉歪|說話不清|中風|無力/],
  ["severe-chest-pain", /胸痛|胸壓|冒冷汗|左臂|下巴/],
  ["severe-headache", /劇烈頭痛|最劇烈|嚴重頭痛/],
  ["high-fever", /高燒|發燒|不退/],
  ["major-bleeding", /大量出血|吐血|黑便|血尿|出血|血便|咳血/],
  ["severe-abdominal-pain", /劇烈腹痛|腹部變硬|持續嘔吐|無法排氣排便/],
  ["vision-loss", /視力|視野|閃光|布幕|眼痛/],
  ["urine-retention", /完全尿不出|尿不出/],
  ["seizure", /抽搐|連續發作/],
  ["major-trauma", /外傷|骨折|變形|無法承重/],
  ["severe-allergy", /嘴唇|舌頭腫|喉嚨緊|過敏/],
  ["rapid-swelling", /快速紅腫|紅線|擴散|快速腫|膿瘍/]
];

const synonyms = {
  "frequent-urination": ["一直想尿", "尿很多次"],
  "painful-urination": ["尿尿痛", "小便疼痛"],
  "blood-in-urine": ["尿裡有血", "紅色尿"],
  "chest-tightness": ["胸口壓迫感", "胸口悶"],
  "chest-pain": ["胸口痛", "胸部疼痛"],
  dizziness: ["頭昏", "頭暈暈"],
  vertigo: ["天旋地轉"],
  headache: ["頭很痛"],
  "sore-throat": ["喉嚨不舒服"],
  "nasal-congestion": ["鼻子不通"],
  "stomach-pain": ["胃不舒服", "上腹痛"],
  diarrhea: ["拉肚子"],
  constipation: ["大不出來"],
  rash: ["皮膚紅紅的"],
  itching: ["皮膚癢"],
  "unknown-lump": ["摸到硬塊"],
  palpitations: ["心跳很快", "心跳不規則"],
  "irregular-heartbeat": ["心跳亂", "心跳忽快忽慢"],
  "one-side-weakness": ["半邊無力"],
  "speech-difficulty": ["講話不清楚"],
  "morning-stiffness": ["早上關節僵硬"],
  "fracture-suspected": ["可能骨折"]
};

const departments = [...new Set(symptomResults.flatMap((result) => result.departments))]
  .sort((a, b) => a.localeCompare(b, "zh-Hant"));

const lines = [
  "-- Generated from data/*.json. Do not edit by hand; run npm run seed:supabase.",
  "begin;",
  ""
];

for (const bodyPart of bodyParts) {
  lines.push(
    `insert into body_parts (slug, name, image_key) values (${sql(bodyPart.slug)}, ${sql(bodyPart.name)}, ${sql(bodyPart.imageKey ?? null)}) on conflict (slug) do update set name = excluded.name, image_key = excluded.image_key;`
  );
}

lines.push("");

for (const department of departments) {
  lines.push(
    `insert into medical_departments (slug, name, description) values (${sql(departmentSlugs[department] ?? slugify(department))}, ${sql(department)}, ${sql(departmentDescriptions[department] ?? null)}) on conflict (slug) do update set name = excluded.name, description = excluded.description;`
  );
}

lines.push("");

for (const symptom of symptoms) {
  lines.push(
    `insert into symptoms (body_part_id, slug, name, description) values ((select id from body_parts where slug = ${sql(symptom.bodyPartId)}), ${sql(symptom.slug)}, ${sql(symptom.name)}, ${sql(symptom.description ?? null)}) on conflict (slug) do update set body_part_id = excluded.body_part_id, name = excluded.name, description = excluded.description;`
  );
}

lines.push("");

for (const result of symptomResults) {
  lines.push(
    `insert into symptom_guidance (symptom_id, see_doctor_soon, emergency) values ((select id from symptoms where slug = ${sql(result.symptomId)}), ${sql(result.seeDoctorSoon)}, ${sql(result.emergency)}) on conflict (symptom_id) do update set see_doctor_soon = excluded.see_doctor_soon, emergency = excluded.emergency;`
  );

  for (const department of result.departments) {
    lines.push(
      `insert into symptom_departments (symptom_id, department_id) values ((select id from symptoms where slug = ${sql(result.symptomId)}), (select id from medical_departments where slug = ${sql(departmentSlugs[department] ?? slugify(department))})) on conflict (symptom_id, department_id) do nothing;`
    );
  }
}

lines.push("");

for (const redFlag of redFlags) {
  lines.push(
    `insert into red_flags (slug, description) values (${sql(redFlag.slug)}, ${sql(redFlag.description)}) on conflict (slug) do update set description = excluded.description;`
  );
}

lines.push("");

for (const result of symptomResults) {
  const matchedSlugs = redFlagMatchers
    .filter(([, matcher]) => matcher.test(result.emergency))
    .map(([slug]) => slug);

  for (const redFlagSlug of new Set(matchedSlugs)) {
    lines.push(
      `insert into symptom_red_flags (symptom_id, red_flag_id) values ((select id from symptoms where slug = ${sql(result.symptomId)}), (select id from red_flags where slug = ${sql(redFlagSlug)})) on conflict (symptom_id, red_flag_id) do nothing;`
    );
  }
}

lines.push("");

for (const [symptomSlug, values] of Object.entries(synonyms)) {
  for (const synonym of values) {
    lines.push(
      `insert into symptom_synonyms (symptom_id, synonym) values ((select id from symptoms where slug = ${sql(symptomSlug)}), ${sql(synonym)}) on conflict (symptom_id, synonym) do nothing;`
    );
  }
}

lines.push("", "commit;", "");

fs.writeFileSync(path.join(root, "supabase/seed.sql"), lines.join("\n"));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function sql(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
