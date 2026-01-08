const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    cost: {
      type: Number,
      default: 0,
    },

    hours_estimated: {
      type: Number,
      default: 0,
    },

    hours_real: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    imageProvider: {
      type: String,
      enum: ["local", "cloud", ""],
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Task", TaskSchema);
