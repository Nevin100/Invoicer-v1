import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import { clientSchema } from "@/utils/validations";
import { getUserId } from "@/lib/helpers/getUserId";
import { deductCredits } from "@/lib/helpers/credits"; 
import logger from "../../../../lib/logger";

export async function POST(req: Request) {
  logger.info("Received request to add a new client");
  await connectDB();
  try {
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully`);
    if (!userId) {
      logger.warn("Unauthorized request to add a new client");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });}

    const { success, remaining } = await deductCredits(userId, "CLIENT");
    if (!success) {
      logger.warn("Insufficient credits to add a new client");
      return NextResponse.json(
        { error: "insufficient_credits", message: "Not enough credits to add a client", remaining },
        { status: 402 }
      );
    }

    const body = await req.json();
    const validation = clientSchema.safeParse(body);
    if (!validation.success) {
      logger.warn("Validation failed for new client");
      return NextResponse.json({ error: "Validation failed", issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const newClient = new Client({ ...validation.data, user: userId });
    await newClient.save();
    logger.info("New client saved successfully");
    return NextResponse.json({ message: "Client saved successfully!" }, { status: 201 });
  } catch (error) {
    logger.error("Server error occurred while adding client", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  logger.info("Received request to delete clients");
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) {
      logger.warn("Unauthorized request to delete clients");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientIds } = await req.json();
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      logger.warn("No client IDs provided for deletion");
      return NextResponse.json({ error: "No client IDs provided" }, { status: 400 });
    }

    const deleteResult = await Client.deleteMany({ _id: { $in: clientIds }, user: userId });
    logger.info(`${deleteResult.deletedCount} client(s) deleted successfully`);
    return NextResponse.json({ message: `${deleteResult.deletedCount} client(s) deleted successfully` }, { status: 200 });
  } catch (error) {
    logger.error("Server error occurred while deleting clients", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> } ) {
  logger.info(`Received request to fetch client with ID: `);
  try{
    const { id }= await params;
    await connectDB();

    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully`);
    if (!userId) {
      logger.warn("Unauthorized request to fetch client by ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await Client.findOne({ _id: id, user: userId });
    if (!client) {
      logger.warn(`Client with ID: ${id} not found`);
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    
    logger.info(`Client with ID: ${id} fetched successfully`);
    return NextResponse.json(client, { status: 200 });

  }catch(error){
    logger.error("Server error occurred while fetching client by ID", error);
    return NextResponse.json({ error: "Internal Server error in Fetching Client" }, { status: 500 });
  }
}