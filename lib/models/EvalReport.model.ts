import mongoose from "mongoose";

const evalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reportType: {
      type: String,
      enum: ["expense", "invoice", "client", "complete"],
      required: true,
    },

    dataSnapshot: {
      invoiceCount: Number,
      clientCount: Number,
      expenseTotal: Number,
      periodDays: Number,
      generatedAt: Date,
    },

    report: {
      score: { type: Number, min: 0, max: 100 },
      summary: String,
      insights: [String],
      redFlags: [String],
      actionItems: [String],
      marketContext: String,
      marketOpportunities: [String],
      pricingInsight: String,
      predictedRevenue: String,
    },

    clientRecommendations: [
      {
        clientId: mongoose.Schema.Types.ObjectId,
        clientName: String,
        dealScore: Number,
        tier: { type: String },
        recommendedDealSize: String,
        growthStrategy: String, 
        reasoning: String,
      },
    ],

    invoiceRecommendations: [
      {
        invoiceId: mongoose.Schema.Types.ObjectId,
        invoiceTitle: String,
        wasWorthIt: Boolean,
        suggestedChanges: String,
        similarToFollow: String,
      },
    ],

    expenseRecommendations: [
      {
        category: String,
        currentSpend: Number,
        action: {
          type: String
        },
        suggestion: String,
      },
    ],

    creditsUsed: { type: Number, required: true },
    tavilyQuery: String,
    tavilyResult: String,
    groqPromptTokens: Number,
  },
  { timestamps: true },
);

evalReportSchema.index({ user: 1, reportType: 1, createdAt: -1 });

export default mongoose.models.EvalReport ||
  mongoose.model("EvalReport", evalReportSchema);
