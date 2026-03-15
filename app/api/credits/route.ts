import { NextResponse } from "next/server";
import { getUserId } from "@/lib/helpers/getUserId";
import { getCredits } from "@/lib/helpers/credits";
import logger from "@/lib/logger";

export async function GET() {
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to fetch credit information");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { credits, plan } = await getCredits(userId);
    return NextResponse.json({ credits, plan });
  } catch (error) {
    logger.error("Server error occurred while fetching credit information", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}