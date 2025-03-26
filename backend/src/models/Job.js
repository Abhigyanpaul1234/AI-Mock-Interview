const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  requiredSkills: [String],
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" }
});

module.exports = mongoose.model("Job", jobSchema);
