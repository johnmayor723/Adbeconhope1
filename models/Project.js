const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant", // for multitenancy
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
    },
    featureImage: {
      type: String, // main project image URL
    },
    description: {
      type: String, // project summary
    },
    sections: [
      {
        heading: { type: String },
        content: { type: String },
        listItems: [String],
      },
    ],
    images: [
      {
        url: { type: String },
        caption: { type: String },
      },
    ],
    donationsInfo: {
      accountDetails: { type: String },
      donateUrl: { type: String },
    },

    // 📊 New Fields
    status: {
      type: String,
      enum: ["ongoing", "completed", "latest"],
      default: "ongoing",
    },
    goal: {
      type: Number,
      default: 0, // fundraising target
    },
    raised: {
      type: Number,
      default: 0, // amount already raised
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
