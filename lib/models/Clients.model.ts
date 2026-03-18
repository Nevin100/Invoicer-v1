import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    postal: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    serviceCharge: {
      type: Number,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
