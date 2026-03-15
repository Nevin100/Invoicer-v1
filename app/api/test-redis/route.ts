import redis from "@/lib/Redis/redis";
import { NextResponse } from "next/server";

export async function GET() {
  await redis.set("ping", "pong");
  const val = await redis.get("ping");
  return NextResponse.json({ val }); 
}