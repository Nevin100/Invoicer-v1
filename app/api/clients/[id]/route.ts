import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import { clientSchema } from "@/utils/validations";
import { getUserId } from "@/lib/helpers/getUserId";
import { deductCredits } from "@/lib/helpers/credits"; // ← add

export async function POST(req: Request) {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success, remaining } = await deductCredits(userId, "CLIENT");
    if (!success) {
      return NextResponse.json(
        { error: "insufficient_credits", message: "Not enough credits to add a client", remaining },
        { status: 402 }
      );
    }

    const body = await req.json();
    const validation = clientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const newClient = new Client({ ...validation.data, user: userId });
    await newClient.save();
    return NextResponse.json({ message: "Client saved successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clients = await Client.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { clientIds } = await req.json();
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      return NextResponse.json({ error: "No client IDs provided" }, { status: 400 });
    }

    const deleteResult = await Client.deleteMany({ _id: { $in: clientIds }, user: userId });
    return NextResponse.json({ message: `${deleteResult.deletedCount} client(s) deleted successfully` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}