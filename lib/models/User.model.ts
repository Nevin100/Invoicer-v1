import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  credits: {
    type: Number,
    default: 200,  
    min: 0,         
  },
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
  },
  planExpiresAt: {
    type: Date,
    default: null,  
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;