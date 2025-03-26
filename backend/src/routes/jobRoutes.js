const express = require("express");
const Job = require("../models/Job");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", async (req, res) => {
  const { title, description, requiredSkills, difficulty } = req.body;

  try {
    const newJob = new Job({ title, description, requiredSkills, difficulty });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
