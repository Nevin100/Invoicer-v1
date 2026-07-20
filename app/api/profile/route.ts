import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Profile from "@/lib/models/Profile.model";
import { getUserId } from "@/lib/helpers/getUserId";
import logger from "@/lib/logger";

export async function GET() {
  logger.info("Received request to fetch user profile");
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) {
      logger.warn("Unauthorized request to fetch user profile");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      logger.info("User profile not found");
      return NextResponse.json({ profile: null });
    }

    logger.info("User profile fetched successfully");
    return NextResponse.json({ profile });
  } catch (error) {
    logger.error("Server error occurred while fetching user profile", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  logger.info("Received request to create user profile");
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) {
      logger.warn("Unauthorized request to create user profile");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    const profile = await Profile.create({ user: userId, ...body });
    logger.info("User profile created successfully");
    return NextResponse.json({ message: "Profile created", profile });
  } catch (error) {
    logger.error("Server error occurred while creating user profile", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  logger.info("Received request to update user profile");
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) {
      logger.warn("Unauthorized request to update user profile");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { pageNumber, data } = body;

    if (!pageNumber || !data) {
      return NextResponse.json({ error: "pageNumber and data required" }, { status: 400 });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: { [`page${pageNumber}`]: data },
        $addToSet: { completedPages: pageNumber },
      },
      { new: true, upsert: true }
    );

    const mandatoryPages = [1, 2, 3, 4];
    const allMandatoryDone = mandatoryPages.every(p =>
      profile.completedPages.includes(p)
    );

    if (allMandatoryDone && !profile.isComplete) {
      profile.isComplete = true;
      await profile.save();
    }

    logger.info(`Profile page ${pageNumber} updated for user ${userId}`);
    return NextResponse.json({ message: `Page ${pageNumber} saved`, profile });
  } catch (error) {
    logger.error("Server error occurred while updating user profile", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}