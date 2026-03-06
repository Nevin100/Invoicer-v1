import { cookies } from "next/headers";
import { jwtVerify } from "jose";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUserId(): Promise<string | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}