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

  const startInterview = () => {
    navigate("/setup-interview");
  };

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

  const saveInterviewResults = async () => {
    setIsSaving(true);
    try {
      const validScores = allFeedback
        .map((f) => Number(f.score) || 0)
        .filter((score) => !isNaN(score));

      const avgScore =
        validScores.length > 0
          ? Math.round(
              validScores.reduce((a, b) => a + b, 0) / validScores.length
            )
          : 0;

      const uniqueKeywords = [
        ...new Set(
          allFeedback.flatMap((f) => f.keywordAnalysis?.relevant || [])
        ),
      ];

      await api.post("api/interviews", {
        date: new Date().toISOString(),
        jobRole,
        experienceLevel,
        questions,
        responses: questions.map((q, i) => ({
          question: q,
          response: responses[i],
          // Add the missing evaluation fields
          strengths: allFeedback[i]?.strengths || [],
          suggestions: allFeedback[i]?.suggestions || [],
          score: allFeedback[i]?.score || 0,
          keywordAnalysis: allFeedback[i]?.keywordAnalysis || {
            relevant: [],
            irrelevant: []
          }
        })),
        score: avgScore,
        topics: uniqueKeywords.map((name) => ({ name, score: 0 })),
      });

      // Force refresh of interviews data
      await queryClient.invalidateQueries(["interviews"]);
      navigate("/dashboard");
    } catch (e) {
      console.error("Error saving interview:", e);
      alert("Failed to save interview. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && current >= questions.length) {
      saveInterviewResults();
    }
  }, [current, questions.length]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {!questions.length ? (
        <button
          onClick={startInterview}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Start Interview"}
        </button>
      ) : (
        <div className="space-y-6">
          {current < questions.length && (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Question {current + 1} of {questions.length}
                </h3>
                <ProgressBar
                  percent={Math.round(((current + 1) / questions.length) * 100)}
                />
              </div>
              <p className="text-lg mb-4">{questions[current]}</p>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-200"
                placeholder="Type your answer..."
                disabled={isSaving}
              />
              <button
                onClick={submitResponse}
                disabled={loading || !response.trim() || isSaving}
                className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Answer"}
              </button>
            </div>
          )}

          {feedback && current <= questions.length && (
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
              <h4 className="text-lg font-semibold mb-2">Feedback</h4>
              <p className="text-sm mb-4">Score: {feedback.score}/100</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeedbackList title="Strengths" items={feedback.strengths} />
                <FeedbackList
                  title="Suggestions"
                  items={feedback.suggestions}
                />
              </div>
              {isSaving && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Saving interview results...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeedbackList({ title, items }) {
  return (
    <div>
      <h5 className="font-medium mb-2">{title}</h5>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {items.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
