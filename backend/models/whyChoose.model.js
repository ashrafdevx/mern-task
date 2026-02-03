const mongoose = require('mongoose');

/**
 * WhyChoose schema: stores metrics for the "Why Choose for us?" module.
 * Examples: Services 88%, Chef Master 80%, Receptionist 92%, etc.
 */
const whyChooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

whyChooseSchema.index({ isActive: 1, order: 1 });

/**
 * Static method using an aggregation pipeline to return only active metrics
 * in the correct order and with a clean projection for the frontend.
 */
whyChooseSchema.statics.getActiveMetrics = function () {
  return this.aggregate([
    { $match: { isActive: true } },
    { $sort: { order: 1, createdAt: 1 } },
    {
      $project: {
        name: 1,
        percentage: 1,
        order: 1,
      },
    },
  ]);
};

const WhyChoose = mongoose.model('WhyChoose', whyChooseSchema);

module.exports = { WhyChoose };

