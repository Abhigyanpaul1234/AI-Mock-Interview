
import React, { useEffect, useState } from "react";
import axios from "axios";

const JobList = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
  
    axios
      .get("http://51.20.31.74:5000/api/jobs")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
      });
  }, []);

  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleSelect = (job) => {
    setSelectedJobId(job._id === selectedJobId ? null : job._id);
  };

  return (
    <div>
    <div className="max-w-4xl mx-auto">
      <div className="text-xl font-bold mb-4">Available Jobs</div>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="bg-[#FCF5E5] p-4 rounded-md shadow cursor-pointer hover:bg-orange-200"
          >
            <div onClick={() => handleSelect(job)}>
              <div className="font-semibold text-lg">{job.title}</div>
              <div className="text-gray-600">{job.description}</div>
              {job.requiredSkills && (
                <div className="text-sm text-gray-500">
                  Skills: {job.requiredSkills.join(", ")}
                </div>
              )}
              <div className="text-sm text-gray-500">Difficulty: {job.difficulty}</div>
            </div>
            
            {selectedJobId === job._id && (
              <button
              onClick={() => onSelectJob(job)}
              className="w-36 h-8 bg-cyan-700 !text-orange-200 py-1 px-3 rounded hover:bg-cyan-800 "
            >
              Mock Interview
            </button>
            
            )}
          </li>
        ))}
      </ul>
    </div>  
  </div>
  );
};

export default JobList;
