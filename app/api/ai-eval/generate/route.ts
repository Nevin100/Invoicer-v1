export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import connectDB from "@/lib/database/db_connection";
import { getUserId } from "@/lib/helpers/getUserId";
import {
  deductCredits,
  refundCredits,
  EVAL_CREDIT_MAP,
  CREDIT_COSTS,
} from "@/lib/helpers/credits";
import { searchMarketContext } from "@/lib/helpers/tavily";
import { buildEvalPrompt } from "@/lib/helpers/buildEvalPrompt";
import { EVAL_SYSTEM_PROMPT } from "@/lib/helpers/evalPrompt";
import EvalReport from "@/lib/models/EvalReport.model";
import Profile from "@/lib/models/Profile.model";
import Invoice from "@/lib/models/Invoice.model";
import { Client } from "@/lib/models/Clients.model";
import Expense from "@/lib/models/Expenses.model";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VALID_TYPES = ["expense", "invoice", "client", "complete"] as const;
type ReportType = (typeof VALID_TYPES)[number];

export async function POST(req: NextRequest) {
  // 1. Auth
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Rate limit
  const rl = await withRateLimit(req, userId, "sensitive");
  if (rl) return rl;

  // 3. Validate reportType
  const { reportType } = await req.json();
  if (!VALID_TYPES.includes(reportType))
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });

  // 4. Deduct credits FIRST — before any expensive ops
  const creditKey = EVAL_CREDIT_MAP[reportType as ReportType];
  const { success, remaining } = await deductCredits(userId, creditKey);
  if (!success)
    return NextResponse.json(
      { error: "insufficient_credits", remaining },
      { status: 402 },
    );

  try {
    await connectDB();

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // 5. Fetch all user data in parallel
    const [profile, invoices, clients, expenses] = await Promise.all([
      Profile.findOne({ user: userId }).lean(),
      Invoice.find({ userId, date: { $gte: ninetyDaysAgo } }).lean(),
      Client.find({ userId }).lean(),
      Expense.find({ userId, date: { $gte: ninetyDaysAgo } }).lean(),
    ]);

    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // 6. Tavily market search (Redis cached 6hrs)
    const industry = (profile as any).page2?.industry || "IT services";
    const userType = (profile as any).page1?.userType || "freelancer";
    const tavilyQuery = `${industry} freelancer India 2025`;

    const marketContext = await searchMarketContext(
      (profile as any).page2?.industry || "IT services",
      (profile as any).page1?.userType || "freelancer",
    );

    // 7. Build Groq user prompt
    const userPrompt = buildEvalPrompt({
      reportType: reportType as ReportType,
      profile,
      invoices,
      clients,
      expenses,
      marketContext,
    });

    // 8. Groq call — response_format enforces valid JSON
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: EVAL_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content || "{}";
    const parsed = JSON.parse(raw);

    // 9. Save to MongoDB
    const report = await EvalReport.create({
      user: userId,
      reportType,
      dataSnapshot: {
        invoiceCount: invoices.length,
        clientCount: clients.length,
        expenseTotal: (expenses as any[]).reduce(
          (sum, e) => sum + (e.amount ?? 0),
          0,
        ),
        periodDays: 90,
        generatedAt: new Date(),
      },
      report: {
        score: parsed.score ?? null,
        summary: parsed.summary ?? "",
        insights: parsed.insights ?? [],
        redFlags: parsed.redFlags ?? [],
        actionItems: parsed.actionItems ?? [],
        marketContext: parsed.marketContext ?? "",
        marketOpportunities: parsed.marketOpportunities ?? [], // NEW
        pricingInsight: parsed.pricingInsight ?? "",
        predictedRevenue: parsed.predictedRevenue ?? null,
      },
      clientRecommendations: parsed.clientRecommendations ?? [],
      invoiceRecommendations: parsed.invoiceRecommendations ?? [],
      expenseRecommendations: parsed.expenseRecommendations ?? [],
      creditsUsed: CREDIT_COSTS[creditKey],
      tavilyQuery,
      tavilyResult: marketContext.combined,
    });

    logger.info("AI eval generated", {
      userId,
      reportType,
      score: parsed.score,
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    // Refund credits on ANY failure — user must not lose credits
    await refundCredits(userId, creditKey);
    logger.error("AI eval failed", { userId, error });
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
