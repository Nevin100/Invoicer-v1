import { NextResponse } from "next/server";
import { Client } from "@/lib/models/Clients.model";
import connectDB from "@/lib/database/db_connection";
import { getUserId } from "@/lib/helpers/getUserId";
import logger from "@/lib/logger";

export async function GET() {
  try {
    logger.info("Received request to fetch client statistics");
    await connectDB();
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully`);
    if (!userId) {
      logger.warn("Unauthorized request to fetch client statistics");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await Client.find({ user: userId });
    const totalClients = clients.length;
    const totalPayment = clients.reduce((sum, client) => sum + client.serviceCharge, 0);

    const clientsPerWeek: Record<string, number> = {};
    clients.forEach((client) => {
      const createdAt = new Date(client.createdAt);
      const weekStart = new Date(createdAt);
      weekStart.setDate(createdAt.getDate() - createdAt.getDay());
      const key = weekStart.toISOString().split("T")[0];
      clientsPerWeek[key] = (clientsPerWeek[key] || 0) + 1;
    });

    const chartData = Object.entries(clientsPerWeek)
      .map(([date, value]) => ({ name: date, value }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    logger.info("Client statistics fetched successfully");
    return NextResponse.json({ totalClients, totalPayment, chartData });
  } catch (err) {
    logger.error("Server error occurred while fetching client statistics", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}