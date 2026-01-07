/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/database/db_connection";
import Expense from "@/lib/models/Expenses.model";
import { expenseSchema } from "@/utils/validations";

const JWT_SECRET = process.env.JWT_SECRET as string;

// POST handler for creating expenses
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await req.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const newExpense = new Expense({
      ...parsed.data,
      user: decoded.userId,
    });

    const savedExpense = await newExpense.save();
    return NextResponse.json({ message: "Expense created", expense: savedExpense });
  } catch (error) {
    return NextResponse.json({ error: "Server Error: " + error }, { status: 500 });
  }
}

// 👇 GET handler for fetching expenses and stats
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const expenses = await Expense.find({ user: decoded.userId }).sort({ createdAt: -1 });

    const formatted = expenses.map((exp) => ({
      _id: exp._id,
      category: exp.category,
      amount: `${exp.currency} ${exp.amount}`,
      date: new Date(exp.date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      icon: "💸",
      description: exp.description,
    }));

    const totalAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const categoryCount: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const stats = {
      totalAmount,
      topCategory,
      totalExpenses: expenses.length,
    };

    return NextResponse.json({ expenses: formatted, stats });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now TypeScript knows the error is of type `Error`
      console.error("Error fetching expenses:", error.message);
      return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
    } else {
      // Handle cases where the error is not an instance of `Error`
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    }
  }

}

// 👇 DELETE handler for deleting expenses
export async function DELETE(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { expenseIds } = await req.json();

    if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
      return NextResponse.json(
        { error: "No expense IDs provided" },
        { status: 400 }
      );
    }

    const deleteResult = await Expense.deleteMany({
      _id: { $in: expenseIds },
      user: userId,
    });

    return NextResponse.json(
      {
        message: `${deleteResult.deletedCount} expense(s) deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting expenses:", error);
    return NextResponse.json(
      { error: "Server error or invalid token" + error },
      { status: 500 }
    );
  }
}
