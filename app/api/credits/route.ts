import { NextResponse } from "next/server";
import { getUserId } from "@/lib/helpers/getUserId";
import { getCredits } from "@/lib/helpers/credits";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { credits, plan } = await getCredits(userId);
    return NextResponse.json({ credits, plan });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}