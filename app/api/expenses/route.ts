export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Expense from "@/lib/models/Expenses.model";
import { expenseSchema } from "@/utils/validations";
import { getUserId } from "@/lib/helpers/getUserId";
import { deductCredits } from "@/lib/helpers/credits";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  logger.info("Received request to add a new expense");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to add a new expense");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const { success, remaining } = await deductCredits(userId, "EXPENSE");
    if (!success) {
      logger.warn("Insufficient credits to log an expense");
      return NextResponse.json(
        { error: "insufficient_credits", message: "Not enough credits to log an expense", remaining },
        { status: 402 }
      );
    }

    const body = await req.json();
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn("Validation failed for new expense");
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const newExpense = new Expense({ ...parsed.data, user: userId });
    const savedExpense = await newExpense.save();

    await Promise.all([
      cache.del(CacheKeys.expenses(userId)),
      cache.del(CacheKeys.analytics(userId)),
    ]);

    logger.info("New expense saved successfully");
    return NextResponse.json({ message: "Expense created", expense: savedExpense });
  } catch (error) {
    logger.error("Server error occurred while adding expense", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  logger.info("Received request to fetch expenses");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to fetch expenses");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const cacheKey = CacheKeys.expenses(userId);
    const cached = await cache.get(cacheKey);
    if (cached) return NextResponse.json(cached, { status: 200 });

    const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });

    const formatted = expenses.map((exp) => ({
      _id: exp._id,
      category: exp.category,
      amount: `${exp.currency} ${exp.amount}`,
      date: new Date(exp.date).toLocaleString("en-IN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }),
      icon: "💸",
      description: exp.description,
    }));

    const totalAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const categoryCount: Record<string, number> = {};
    expenses.forEach((exp) => {
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });
    const topCategory =
      Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const response = {
      expenses: formatted,
      stats: { totalAmount, topCategory, totalExpenses: expenses.length },
    };

    await cache.set(cacheKey, response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error("Server error occurred while fetching expenses", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  logger.info("Received request to delete expenses");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to delete expenses");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } 

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const { expenseIds } = await req.json();
    if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
      logger.warn("No expense IDs provided for deletion");
      return NextResponse.json({ error: "No expense IDs provided" }, { status: 400 });
    }

    const deleteResult = await Expense.deleteMany({ _id: { $in: expenseIds }, user: userId });

    await Promise.all([
      cache.del(CacheKeys.expenses(userId)),
      cache.del(CacheKeys.analytics(userId)),
      ...expenseIds.map((id: string) => cache.del(CacheKeys.expense(userId, id))),
    ]);

    logger.info(`${deleteResult.deletedCount} expense(s) deleted successfully`);
    return NextResponse.json({
      message: `${deleteResult.deletedCount} expense(s) deleted successfully`,
    });
  } catch (error) {
    logger.error("Server error occurred while deleting expenses", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}