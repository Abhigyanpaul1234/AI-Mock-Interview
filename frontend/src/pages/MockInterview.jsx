
import React, { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

const languageMapping = {
  python: "Python",
  c: "C",
  java: "Java"
};

const editorLanguageMapping = {
  python: "python",
  c: "c",
  java: "java"
};

const MockInterview = ({ job, onBack }) => {
  const [interview, setInterview] = useState(null);
  const [code, setCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("c");
  const [feedback, setFeedback] = useState("");

  const startInterview = () => {

    const backendLang = languageMapping[selectedLang] || "C";
    axios
      .post("http://localhost:5000/api/interviews/start", {
        jobId: job._id,
        language: backendLang
      })
      .then((res) => {
        setInterview(res.data);
      })
      .catch((err) => console.error("Error starting interview:", err));
  };

  const submitCode = () => {
    if (!interview) return;

    axios
      .post("http://51.20.31.74:5000/api/interviews/submit", {
        interviewId: interview._id,
        userCode: code,
      })
      .then(() => axios.post("http://51.20.31.74:5000/api/interviews/review", {
        interviewId: interview._id,
      }))
      .then((res) => {
        setFeedback(res.data.feedback);
      })
      .catch((err) => console.error("Error submitting code:", err));
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#FCF5E5] p-4 rounded shadow">
      <button
        onClick={onBack}
        className=" w-30 h-8 bg-gray-200 py-1 px-4 rounded-lg hover:bg-gray-400"
      >
        &larr; Back
      </button>

      <div className="text-xl font-bold my-4">Mock Interview for {job.title}</div>


      <div className="flex items-center space-x-2 mb-4">
        <label className="font-medium">Language:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="border border-gray-300 rounded p-1"
        >
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="java">Java</option>
        </select>
        <button
          onClick={startInterview}
          className="h-8 w-30 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
        >
          Start Interview
        </button>
      </div>


      <div className="grid grid-cols-2 gap-4">

        <div className="border border-gray-200 p-4 rounded h-[400px] overflow-auto">
          {interview ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Question:</h3>
              <p className="whitespace-pre-wrap">{interview.question}</p>
            </>
          ) : (
            <p className="text-gray-500">No interview started yet. Click "Start Interview".</p>
          )}
        </div>


        <div className="border border-gray-200 p-4 rounded h-[550px] flex flex-col justify-between">
          <Editor
            height="90%"
            language={editorLanguageMapping[selectedLang] || "c"}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
          />
          {interview && (  
            <button
              onClick={submitCode}
              className="h-8 w-30 mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 self-end"
            >
              Submit Code
            </button>
          )}
        </div>
      </div>


      {feedback && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-semibold mb-2">AI Code Review:</h3>
          <pre className="whitespace-pre-wrap">{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
