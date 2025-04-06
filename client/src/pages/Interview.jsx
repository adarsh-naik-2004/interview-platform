import { useState, useEffect } from "react";
import api from "../utils/api";
import { ProgressBar } from "../components/ProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { questions = [], jobRole, experienceLevel } = location.state || {};
  const [responses, setResponses] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [current, setCurrent] = useState(0);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [avgScore, setAvgScore] = useState(0);

  const startInterview = () => navigate("/setup-interview");

  const submitResponse = async () => {
    setLoading(true);
    try {
      const { data: evalData } = await api.post("api/interviews/evaluate", {
        question: questions[current],
        response,
      });

      setFeedback(evalData);
      setResponses((prev) => [...prev, response]);
      setAllFeedback((prev) => [...prev, evalData]);
      setCurrent((c) => c + 1);
      setResponse("");
    } catch (e) {
      console.error("Error evaluating response:", e);
    } finally {
      setLoading(false);
    }
  };

  const finalizeInterview = async () => {
    setIsSaving(true);
    try {
      const validScores = allFeedback
        .map((f) => Number(f.score) || 0)
        .filter((score) => !isNaN(score));

      const avg =
        validScores.length > 0
          ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
          : 0;

      setAvgScore(avg);

      await api.post("api/interviews", {
        date: new Date().toISOString(),
        jobRole,
        experienceLevel,
        questions,
        responses: questions.map((q, i) => ({
          question: q,
          response: responses[i],
          strengths: allFeedback[i]?.strengths || [],
          suggestions: allFeedback[i]?.suggestions || [],
          score: allFeedback[i]?.score || 0,
          keywordAnalysis: allFeedback[i]?.keywordAnalysis || {
            relevant: [],
            irrelevant: [],
          },
        })),
        score: avg,
        topics: [
          ...new Set(
            allFeedback.flatMap((f) => f.keywordAnalysis?.relevant || [])
          ),
        ].map((name) => ({ name, score: 0 })),
      });

      await queryClient.invalidateQueries(["interviews"]);
      setShowFinalFeedback(true);
    } catch (e) {
      console.error("Error saving interview:", e);
      alert("Failed to save interview. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && current >= questions.length) {
      finalizeInterview();
    }
  }, [current]);

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-6 sm:p-10 relative overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute top-[-3rem] left-[-3rem] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-3rem] right-[-3rem] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] right-[25%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {!questions.length ? (
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-white/40 backdrop-blur-md border border-indigo-200 text-indigo-800 font-semibold py-4 rounded-2xl hover:bg-white/60 transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? "Loading..." : "Start Interview"}
          </button>
        ) : showFinalFeedback ? (
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4 text-center">
            <h3 className="text-2xl font-bold text-indigo-700">🎯 Interview Summary</h3>
            <p className="text-lg text-gray-800">
              Your Average Score: <span className="font-semibold">{avgScore}/100</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <FeedbackList
                title="Key Strengths"
                items={[
                  ...new Set(
                    allFeedback.flatMap((f) => f.strengths || [])
                  ),
                ]}
              />
              <FeedbackList
                title="Suggestions for Improvement"
                items={[
                  ...new Set(
                    allFeedback.flatMap((f) => f.suggestions || [])
                  ),
                ]}
              />
            </div>

            <button
              onClick={goToDashboard}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-md transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {current < questions.length && (
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-indigo-700">
                    Question {current + 1} of {questions.length}
                  </h3>
                  <ProgressBar
                    percent={Math.round(
                      ((current + 1) / questions.length) * 100
                    )}
                  />
                </div>
                <p className="text-lg text-gray-800">{questions[current]}</p>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full h-40 p-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 bg-white/80"
                  placeholder="Type your answer..."
                  disabled={isSaving}
                />
                <button
                  onClick={submitResponse}
                  disabled={loading || !response.trim() || isSaving}
                  className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            )}

            {feedback && current <= questions.length && (
              <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md">
                <h4 className="text-lg font-bold text-gray-800 mb-2">📋 Feedback</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Score: <span className="font-medium">{feedback.score}/100</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeedbackList title="Strengths" items={feedback.strengths} />
                  <FeedbackList title="Suggestions" items={feedback.suggestions} />
                </div>
                {isSaving && (
                  <div className="mt-4 text-center text-sm text-gray-500 italic">
                    Saving interview results...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackList({ title, items }) {
  return (
    <div>
      <h5 className="font-semibold text-gray-700 mb-2">{title}</h5>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
        {items.length > 0 ? (
          items.map((s, i) => <li key={i}>{s}</li>)
        ) : (
          <li>No feedback available.</li>
        )}
      </ul>
    </div>
  );
}
