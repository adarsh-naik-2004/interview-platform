import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function InterviewSetup() {
  const [setupData, setSetupData] = useState({
    experienceLevel: "entry",
    jobRole: "software-engineer",
    questionCount: 5, // Default number of questions
  });

  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const { data } = await api.post("/api/interviews/generate", setupData);
      navigate("/interview", {
        state: {
          questions: data,
          jobRole: setupData.jobRole,
          experienceLevel: setupData.experienceLevel,
        },
      });
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-white p-6 relative flex items-center justify-center overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute top-[-3rem] left-[-3rem] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-3rem] right-[-3rem] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] right-[25%] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-800">
          🧠 Configure Your Interview
        </h2>

        <div className="space-y-6">
          {/* Experience Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              value={setupData.experienceLevel}
              onChange={(e) =>
                setSetupData({ ...setupData, experienceLevel: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>

          {/* Job Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Target Job Role
            </label>
            <select
              value={setupData.jobRole}
              onChange={(e) =>
                setSetupData({ ...setupData, jobRole: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="software-engineer">Software Engineer</option>
              <option value="frontend-engineer">Frontend Engineer</option>
              <option value="backend-engineer">Backend Engineer</option>
              <option value="fullstack-engineer">Fullstack Engineer</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Number of Questions (max 10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={setupData.questionCount}
              onChange={(e) =>
                setSetupData({
                  ...setupData,
                  questionCount: Math.min(
                    10,
                    Math.max(1, parseInt(e.target.value) || 1)
                  ),
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
              placeholder="e.g., 5"
            />
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
          >
            🚀 Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
