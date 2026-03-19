import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import { clientSchema } from "@/utils/validations";
import { getUserId } from "@/lib/helpers/getUserId";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  logger.info("Received request to add a new client");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to add a new client");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const body = await req.json();
    const validation = clientSchema.safeParse(body);
    if (!validation.success) {
      logger.warn("Validation failed for new client");
      return NextResponse.json(
        { error: "Validation failed", issues: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newClient = new Client({ ...validation.data, user: userId });
    await newClient.save();

    await cache.del(CacheKeys.clients(userId));

    logger.info("New client saved successfully");
    return NextResponse.json({ message: "Client saved successfully!" }, { status: 201 });
  } catch (error) {
    logger.error("Server error occurred while adding client", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  logger.info("Received request to fetch clients");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to fetch clients");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const cacheKey = CacheKeys.clients(userId);
    const cached = await cache.get(cacheKey);
    if (cached) return NextResponse.json(cached, { status: 200 });

    const clients = await Client.find({ user: userId }).sort({ createdAt: -1 });
    await cache.set(cacheKey, clients); 

    logger.info("Clients fetched successfully");
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    logger.error("Server error occurred while fetching clients", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  logger.info("Received request to delete clients");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to delete clients");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const { clientIds } = await req.json();
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      logger.warn("No client IDs provided for deletion");
      return NextResponse.json({ error: "No client IDs provided" }, { status: 400 });
    }

    const deleteResult = await Client.deleteMany({ _id: { $in: clientIds }, user: userId });

    await Promise.all([
      cache.del(CacheKeys.clients(userId)),
      ...clientIds.map((id: string) => cache.del(CacheKeys.client(userId, id))),
    ]);

    logger.info(`${deleteResult.deletedCount} client(s) deleted successfully`);
    return NextResponse.json(
      { message: `${deleteResult.deletedCount} client(s) deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Server error occurred while deleting clients", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}