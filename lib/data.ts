import bodyPartsJson from "@/data/bodyParts.json";
import symptomResultsJson from "@/data/symptomResults.json";
import symptomsJson from "@/data/symptoms.json";
import type { BodyPart } from "@/types/bodyPart";
import type { Symptom, SymptomResult } from "@/types/symptom";
import { normalizeText } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";

const bodyParts = bodyPartsJson as BodyPart[];
const symptoms = symptomsJson as Symptom[];
const symptomResults = symptomResultsJson as SymptomResult[];

type SupabaseBodyPart = {
  id: string;
  slug: string;
  name: string;
  image_key: string | null;
};

type SupabaseSymptom = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  body_parts: {
    slug: string;
  } | null;
};

type SupabaseGuidance = {
  see_doctor_soon: string | null;
  emergency: string | null;
  symptoms: {
    slug: string;
  } | null;
};

type SupabaseSymptomDepartment = {
  medical_departments: {
    name: string;
  } | null;
};

export async function getBodyParts() {
  const remote = await getRemoteBodyParts();
  return remote ?? bodyParts;
}

export async function getBodyPartBySlug(slug: string) {
  const remote = await getRemoteBodyPartBySlug(slug);
  return remote ?? bodyParts.find((bodyPart) => bodyPart.slug === slug) ?? null;
}

export async function getSymptoms() {
  const remote = await getRemoteSymptoms();
  return remote ?? symptoms;
}

export async function getSymptomsByBodyPart(slug: string) {
  const remote = await getRemoteSymptomsByBodyPart(slug);

  if (remote) {
    return remote;
  }

  const bodyPart = await getBodyPartBySlug(slug);

  if (!bodyPart) {
    return [];
  }

  return symptoms.filter((symptom) => symptom.bodyPartId === bodyPart.id);
}

export async function getSymptomBySlug(slug: string) {
  const remote = await getRemoteSymptomBySlug(slug);
  return remote ?? symptoms.find((symptom) => symptom.slug === slug) ?? null;
}

export async function getSymptomResult(symptomId: string) {
  const remote = await getRemoteSymptomResult(symptomId);
  return remote ?? symptomResults.find((result) => result.symptomId === symptomId) ?? null;
}

export async function getSymptomResults() {
  return symptomResults;
}

export async function searchSymptoms(query: string) {
  const keyword = normalizeText(query);

  if (!keyword) {
    return [];
  }

  const remote = await searchRemoteSymptoms(query);

  if (remote) {
    return remote;
  }

  return symptoms.filter((symptom) => {
    const bodyPart = bodyParts.find((item) => item.id === symptom.bodyPartId);
    const haystack = normalizeText(
      [symptom.name, symptom.slug, symptom.description, bodyPart?.name].filter(Boolean).join(" ")
    );

    return haystack.includes(keyword);
  });
}

async function getRemoteBodyParts() {
  return withSupabaseFallback(async () => {
    const { data, error } = await supabase!
      .from("body_parts")
      .select("id, slug, name, image_key")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as SupabaseBodyPart[]).map(mapBodyPart);
  });
}

async function getRemoteBodyPartBySlug(slug: string) {
  return withSupabaseFallback(async () => {
    const { data, error } = await supabase!
      .from("body_parts")
      .select("id, slug, name, image_key")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapBodyPart(data as SupabaseBodyPart) : null;
  });
}

async function getRemoteSymptoms() {
  return withSupabaseFallback(async () => {
    const { data, error } = await supabase!
      .from("symptoms")
      .select("id, slug, name, description, body_parts!inner(slug)")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as unknown as SupabaseSymptom[]).map(mapSymptom);
  });
}

async function getRemoteSymptomsByBodyPart(slug: string) {
  return withSupabaseFallback(async () => {
    const { data, error } = await supabase!
      .from("symptoms")
      .select("id, slug, name, description, body_parts!inner(slug)")
      .eq("body_parts.slug", slug)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as unknown as SupabaseSymptom[]).map(mapSymptom);
  });
}

async function getRemoteSymptomBySlug(slug: string) {
  return withSupabaseFallback(async () => {
    const { data, error } = await supabase!
      .from("symptoms")
      .select("id, slug, name, description, body_parts!inner(slug)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapSymptom(data as unknown as SupabaseSymptom) : null;
  });
}

async function getRemoteSymptomResult(symptomId: string) {
  return withSupabaseFallback(async () => {
    const [guidanceResponse, departmentsResponse] = await Promise.all([
      supabase!
        .from("symptom_guidance")
        .select("see_doctor_soon, emergency, symptoms!inner(slug)")
        .eq("symptoms.slug", symptomId)
        .maybeSingle(),
      supabase!
        .from("symptom_departments")
        .select("medical_departments!inner(name), symptoms!inner(slug)")
        .eq("symptoms.slug", symptomId)
    ]);

    if (guidanceResponse.error) {
      throw guidanceResponse.error;
    }

    if (departmentsResponse.error) {
      throw departmentsResponse.error;
    }

    const guidance = guidanceResponse.data as unknown as SupabaseGuidance | null;

    if (!guidance) {
      return null;
    }

    const departments = (departmentsResponse.data as unknown as SupabaseSymptomDepartment[])
      .map((item) => item.medical_departments?.name)
      .filter((name): name is string => Boolean(name));

    return {
      symptomId,
      departments,
      seeDoctorSoon: guidance.see_doctor_soon ?? "",
      emergency: guidance.emergency ?? ""
    };
  });
}

async function searchRemoteSymptoms(query: string) {
  const keyword = normalizeText(query);

  return withSupabaseFallback(async () => {
    const [symptomsResponse, synonymsResponse] = await Promise.all([
      supabase!
        .from("symptoms")
        .select("id, slug, name, description, body_parts!inner(slug)")
        .or(`name.ilike.%${escapeLike(keyword)}%,slug.ilike.%${escapeLike(keyword)}%,description.ilike.%${escapeLike(keyword)}%`)
        .limit(50),
      supabase!
        .from("symptom_synonyms")
        .select("symptoms!inner(id, slug, name, description, body_parts!inner(slug))")
        .ilike("synonym", `%${escapeLike(keyword)}%`)
        .limit(50)
    ]);

    if (symptomsResponse.error) {
      throw symptomsResponse.error;
    }

    if (synonymsResponse.error) {
      throw synonymsResponse.error;
    }

    const bySlug = new Map<string, Symptom>();

    for (const symptom of symptomsResponse.data as unknown as SupabaseSymptom[]) {
      const mapped = mapSymptom(symptom);
      bySlug.set(mapped.slug, mapped);
    }

    for (const item of synonymsResponse.data as unknown as Array<{ symptoms: SupabaseSymptom | null }>) {
      if (item.symptoms) {
        const mapped = mapSymptom(item.symptoms);
        bySlug.set(mapped.slug, mapped);
      }
    }

    return Array.from(bySlug.values());
  });
}

async function withSupabaseFallback<T>(query: () => Promise<T>) {
  if (!supabase) {
    return null;
  }

  try {
    return await query();
  } catch (error) {
    console.warn("Supabase query failed; falling back to local JSON.", error);
    return null;
  }
}

function mapBodyPart(bodyPart: SupabaseBodyPart): BodyPart {
  return {
    id: bodyPart.slug,
    slug: bodyPart.slug,
    name: bodyPart.name,
    imageKey: bodyPart.image_key ?? bodyPart.slug
  };
}

function mapSymptom(symptom: SupabaseSymptom): Symptom {
  return {
    id: symptom.slug,
    bodyPartId: symptom.body_parts?.slug ?? "",
    slug: symptom.slug,
    name: symptom.name,
    description: symptom.description ?? ""
  };
}

function escapeLike(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
