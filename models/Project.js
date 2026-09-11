const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true, // e.g. "01"
    },
    kicker: {
      type: String,
      required: true,
      trim: true, // e.g. "SECURITY / PLATFORM"
    },
    title: {
      type: String,
      required: true,
      trim: true, // e.g. "Cyber Raksha"
    },
    subtitle: {
      type: String,
      trim: true, // e.g. "v1 / v2"
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [], // e.g. ["SECURITY AWARENESS", "PRODUCT FLOWS"]
    },
    outcome: {
      type: String,
      trim: true, // e.g. "DIAMOND AWARD — 1ST PLACE"
    },
    link: {
      type: String,
      trim: true, // GitHub or live URL
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0, // for sorting
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', ProjectSchema);
