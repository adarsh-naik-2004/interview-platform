import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function Interview() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState(null);

  const startInterview = async () => {
    try {
      const { data } = await api.post('/api/interviews/generate', {
        jobRole: user.jobRole,
        experienceLevel: user.experienceLevel
      });
      setQuestions(data);
    } catch (err) {
      console.error('Error starting interview:', err);
    }
  };

  const submitResponse = async () => {
    try {
      const { data: evaluation } = await api.post('/interviews/evaluate', {
        question: questions[currentQuestion],
        response
      });
      
      setFeedback(evaluation);
      setCurrentQuestion(prev => prev + 1);
      setResponse('');

    } catch (err) {
      console.error('Evaluation error:', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {!questions.length ? (
        <button 
          onClick={startInterview}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Start Interview
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <p className="text-lg mb-4">{questions[currentQuestion]}</p>
            
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full h-48 p-3 border rounded-lg"
              placeholder="Type your answer here..."
            />
            
            <button
              onClick={submitResponse}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Submit Answer
            </button>
          </div>

          {feedback && (
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-2">Feedback</h4>
              <p className="text-sm">Score: {feedback.score}/100</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h5 className="font-medium">Strengths</h5>
                  <ul className="list-disc pl-4">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-sm">{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Suggestions</h5>
                  <ul className="list-disc pl-4">
                    {feedback.suggestions.map((s, i) => (
                      <li key={i} className="text-sm">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}