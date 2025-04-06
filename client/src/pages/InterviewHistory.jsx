import { useEffect, useState } from "react";
import api from "../utils/api";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/api/interviews");
        setInterviews(Array.isArray(data) ? data.reverse() : []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpand = (index) => {
    setExpanded((prev) => (prev === index ? null : index));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
        <p className="text-lg text-gray-600">Loading interview history...</p>
      </div>
    );

  if (interviews.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
        <p className="text-lg text-gray-600">No interviews yet.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-6 sm:p-10 relative overflow-hidden">
      {/* Background blobs for visual depth */}
      <div className="absolute top-[-3rem] left-[-3rem] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-3rem] right-[-3rem] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] right-[25%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-10">
          Interview History
        </h2>

        <div className="space-y-6">
          {interviews.map((interview, index) => (
            <div
              key={interview._id}
              className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-all"
            >
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {interview.jobRole}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      ({interview.experienceLevel})
                    </span>
                  </p>
                  <p className="text-sm text-indigo-600 font-medium mt-1">
                    Score: {interview.score}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(interview.date).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => toggleExpand(index)}
                  className="text-sm text-indigo-700 font-medium hover:underline transition"
                >
                  {expanded === index ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expanded === index && (
                <div className="mt-6 space-y-5">
                  {interview.responses?.map((res, i) => (
                    <div
                      key={i}
                      className="bg-white border border-indigo-100 p-4 rounded-xl shadow-sm"
                    >
                      <p className="font-semibold text-gray-700">
                        Q{i + 1}: {res.question}
                      </p>
                      <p className="mt-2 text-sm text-gray-700">
                        <strong>Response:</strong> {res.response}
                      </p>
                      <p className="text-sm mt-2 text-indigo-600">
                        Score: {res.score}%
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                        <div>
                          <p className="font-semibold mb-1">Strengths:</p>
                          <ul className="list-disc ml-5">
                            {res.strengths?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Suggestions:</p>
                          <ul className="list-disc ml-5">
                            {res.suggestions?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Relevant Keywords:</strong>{" "}
                          {res.keywordAnalysis?.relevant?.join(", ") || "None"}
                        </p>
                        <p>
                          <strong>Irrelevant Keywords:</strong>{" "}
                          {res.keywordAnalysis?.irrelevant?.join(", ") ||
                            "None"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;
