import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";

export const CREDIT_COSTS = {
  INVOICE: 20,
  CLIENT: 5,
  EXPENSE: 5,
  AI_EVAL: 15,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export async function deductCredits(
  userId: string,
  action: CreditAction
): Promise<{ success: boolean; remaining: number }> {
  await connectDB();
  const cost = CREDIT_COSTS[action];

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      credits: { $gte: cost }, 
    },
    { $inc: { credits: -cost } },
    { new: true }
  ).select("credits");

  if (!user) {
    const current = await User.findById(userId).select("credits");
    return { success: false, remaining: current?.credits || 0 };
  }

  return { success: true, remaining: user.credits };
}

export async function getCredits(
  userId: string
): Promise<{ credits: number; plan: string }> {
  await connectDB();
  const user = await User.findById(userId).select("credits plan");
  return {
    credits: user?.credits || 0,
    plan: user?.plan || "free",
  };
}

export async function addCredits(
  userId: string,
  amount: number
): Promise<{ credits: number }> {
  await connectDB();
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { credits: amount },
      plan: "pro",
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  ).select("credits");

  return { credits: user?.credits || 0 };
}

export async function hasEnoughCredits(
  userId: string,
  action: CreditAction
): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId).select("credits");
  if (!user) return false;
  return user.credits >= CREDIT_COSTS[action];
}

export async function refundCredits(
  userId: string,
  action: CreditAction
): Promise<void> {
  await connectDB();
  const cost = CREDIT_COSTS[action];
  await User.findByIdAndUpdate(userId, {
    $inc: { credits: cost },
  });
}