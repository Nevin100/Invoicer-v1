import { auth } from "@/auth";
import { getAuthToken, verifyAuthToken } from "@/lib/auth/cookies";
import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";

export async function getUserId(): Promise<string | null> {
  // Pehle Google session check
  const session = await auth();
  if (session?.user?.email) {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return user?._id?.toString() || null;
  }

  // Phir JWT check
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const decoded = (await verifyAuthToken(token)) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}