import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Expense from "@/lib/models/Expenses.model";
import { expenseSchema } from "@/utils/validations";
import { getUserId } from "@/lib/helpers/getUserId";

export async function POST(req: Request) {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors }, { status: 400 });

    const newExpense = new Expense({ ...parsed.data, user: userId });
    const savedExpense = await newExpense.save();
    return NextResponse.json({ message: "Expense created", expense: savedExpense });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return NextResponse.json({
      expenses: formatted,
      stats: { totalAmount, topCategory, totalExpenses: expenses.length },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { expenseIds } = await req.json();
    if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
      return NextResponse.json({ error: "No expense IDs provided" }, { status: 400 });
    }

    const deleteResult = await Expense.deleteMany({ _id: { $in: expenseIds }, user: userId });
    return NextResponse.json({ message: `${deleteResult.deletedCount} expense(s) deleted successfully` });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}