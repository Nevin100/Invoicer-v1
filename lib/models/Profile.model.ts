import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  page1: {
    fullName: { type: String, required: true },
    avatar: { type: String },
    phone: { type: String },
    bio: { type: String, maxlength: 300 },
    userType: {
      type: String,
      enum: ["freelancer", "business_owner"],
      required: true,
    },
    occupation: { type: String }, 
    tagline: { type: String },    
  },

  page2: {
    companyName: { type: String },
    companyType: {
      type: String,
      enum: ["sole_proprietor", "partnership", "pvt_ltd", "llp", "other"],
    },
    industry: { type: String }, 
    yearsInBusiness: { type: Number },
    teamSize: {
      type: String,
      enum: ["solo", "2-5", "6-15", "16-50", "50+"],
    },
    officeAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    website: { type: String },
    gstin: { type: String },
  },

  page3: {
    monthlyRevenueRange: {
      type: String,
      enum: [
        "under_50k",
        "50k_2L",
        "2L_5L",
        "5L_10L",
        "10L_plus",
      ],
    },
    avgDealSize: {
      type: String,
      enum: ["under_10k", "10k_50k", "50k_2L", "2L_plus"],
    },
    primaryServices: [{ type: String }],
    paymentTermsPreference: {
      type: String,
      enum: ["immediate", "net_15", "net_30", "net_60", "milestone_based"],
    },
    currentPriorities: {
      primary: { type: String },  
      secondary: { type: String },
    },
    goals: {
      shortTerm: { type: String }, 
      midTerm: { type: String },  
      longTerm: { type: String }, 
    },
    dailyBusinessScale: { type: String }, 
  },

  page4: {
    education: {
      degree: { type: String },
      field: { type: String },
      institution: { type: String },
      year: { type: Number },
    },
    achievements: [{ type: String }],
    hobbies: [{ type: String }],
    pastTradeHighlights: { type: String },
    currentTargets: {
      type: String, 
    },
  },
  
  page5: {
    preferredMethod: {
      type: String,
      enum: ["upi", "bank", "both"],
      default: "upi",
    },
    upiId:       { type: String },   
    accountName: { type: String },   
    accountNo:   { type: String },   
    ifsc:        { type: String },   
    bankName:    { type: String },   
    qrCode:      { type: String },
    branchName:  { type: String },
  },

  completedPages: {
    type: [Number],
    default: [],
  }, 
  
  isComplete: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

export default mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);