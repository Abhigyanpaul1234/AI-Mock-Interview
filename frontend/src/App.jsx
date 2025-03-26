// src/App.jsx
import React, { useState } from "react";
import JobList from "./pages/JobList";
import MockInterview from "./pages/MockInterview";

const App = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="min-h-screen bg-orange-100 p-4">
      <div className="text-2xl h-20 font-extrabold text-center ">AI Mock Interview System</div>
      {!selectedJob ? (
        <JobList onSelectJob={setSelectedJob} />
      ) : (
        <MockInterview job={selectedJob} onBack={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default App;
