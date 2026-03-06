import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Profile from "@/lib/models/Profile.model";
import { getUserId } from "@/lib/helpers/getUserId";

export async function GET() {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await Profile.findOne({ user: userId });
    if (!profile) return NextResponse.json({ profile: null });

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const existing = await Profile.findOne({ user: userId });
    if (existing) return NextResponse.json({ error: "Profile already exists" }, { status: 400 });

    const profile = await Profile.create({ user: userId, ...body });
    return NextResponse.json({ message: "Profile created", profile });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { pageNumber, data } = body;

    if (!pageNumber || !data) {
      return NextResponse.json({ error: "pageNumber and data required" }, { status: 400 });
    }

    const updatePayload: any = {
      [`page${pageNumber}`]: data,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: updatePayload,
        $addToSet: { completedPages: pageNumber },
      },
      { new: true, upsert: true }
    );

    if (profile.completedPages.length === 4) {
      profile.isComplete = true;
      await profile.save();
    }

    return NextResponse.json({ message: `Page ${pageNumber} saved`, profile });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}