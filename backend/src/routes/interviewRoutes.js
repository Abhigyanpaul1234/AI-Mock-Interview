const express = require("express");
const Interview = require("../models/Interview");
const Job = require("../models/Job");
const axios = require("axios");

const router = express.Router();


const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = "judge0-ce.p.rapidapi.com";


const LANGUAGE_IDS = {
  Python: 71,  
  C: 50,       
  Java: 62     
};


router.post("/start", async (req, res) => {
  const { jobId, language } = req.body; 

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const mockQuestions = {
      Python: "Write a function to check if a number is prime.",
      C: "Implement a function to reverse a string.",
      Java: "Write a program to find the factorial of a number."
    };

    if (!LANGUAGE_IDS[language]) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const interview = new Interview({
      jobId,
      question: mockQuestions[language],
      language,
      status: "Pending"
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/submit", async (req, res) => {
  const { interviewId, userCode } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const languageId = LANGUAGE_IDS[interview.language];

    
    const response = await axios.post(
      `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
      {
        source_code: userCode,
        language_id: languageId
      },
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": JUDGE0_API_HOST,
          "Content-Type": "application/json"
        },
      }
    );

    interview.userCode = userCode;
    interview.output = response.data.stdout || response.data.stderr || "No output";
    interview.status = "Completed";

    await interview.save();
    res.json(interview);
  } catch (error) {
    console.error("Error executing code:", error.response?.data || error.message);
    res.status(500).json({ message: "Code execution failed" });
  }
});


router.post("/review", async (req, res) => {
  const { interviewId } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview || interview.status !== "Completed") {
      return res.status(400).json({ message: "Invalid interview ID or code not submitted yet." });
    }

    const prompt = `Review the following code written in ${interview.language} for the problem: "${interview.question}". Code: ${interview.userCode}. Provide a concise review with suggestions for improvement.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const geminiFeedback = response.data.candidates[0].content.parts[0].text;

    res.json({ interviewId, feedback: geminiFeedback });
  } catch (error) {
    console.error("Gemini API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Failed to generate review feedback" });
  }
});

module.exports = router;
