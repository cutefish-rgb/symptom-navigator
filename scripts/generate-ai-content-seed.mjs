import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const generated = readJson("data/ai-generated-content.json");

const lines = [
  "-- Generated from data/ai-generated-content.json. Review before importing to production.",
  "begin;",
  ""
];

for (const item of generated) {
  lines.push(
    `insert into ai_generated_content (symptom_id, type, content, source, review_status, safety_notes, created_at) values ((select id from symptoms where slug = ${sql(item.symptomSlug)}), ${sql(item.type)}, ${sqlJson(item.content)}, ${sql(item.source)}, ${sql(item.reviewStatus)}, ${sql(item.safetyNotes)}, ${sql(item.createdAt)}) on conflict do nothing;`
  );
}

lines.push("", "commit;", "");

fs.writeFileSync(path.join(root, "supabase/ai-generated-content-seed.sql"), lines.join("\n"));

console.log("AI content seed generated:", generated.length);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function sql(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sql(JSON.stringify(value))}::jsonb`;
}
