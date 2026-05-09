import { NextResponse } from "next/server";
import { getSymptoms, searchSymptoms } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const symptoms = query ? await searchSymptoms(query) : await getSymptoms();

  return NextResponse.json({ symptoms });
}
