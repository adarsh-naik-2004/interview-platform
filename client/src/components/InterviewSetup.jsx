// src/components/InterviewSetup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function InterviewSetup() {
  const [setupData, setSetupData] = useState({
    experienceLevel: 'entry',
    jobRole: 'software-engineer'
  });
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const { data } = await api.post('/api/interviews/generate', setupData);
      navigate('/interview', {
        state: {
          questions: data,
          jobRole: setupData.jobRole,
          experienceLevel: setupData.experienceLevel
        }
      });
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Configure Your Interview</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Experience Level
            </label>
            <select
              value={setupData.experienceLevel}
              onChange={(e) => setSetupData({...setupData, experienceLevel: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Job Role
            </label>
            <select
              value={setupData.jobRole}
              onChange={(e) => setSetupData({...setupData, jobRole: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="software-engineer">Software Engineer</option>
              <option value="frontend-engineer">Frontend Engineer</option>
              <option value="backend-engineer">Backend Engineer</option>
              <option value="fullstack-engineer">Fullstack Engineer</option>
            </select>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}