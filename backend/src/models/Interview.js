const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  question: String,
  language: { type: String, enum: ["Python", "C", "Java"], required: true },
  userCode: String,
  output: String,
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Interview", interviewSchema);
