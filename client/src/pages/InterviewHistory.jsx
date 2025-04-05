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

  if (loading) return <div className="p-4">Loading interview history...</div>;
  if (interviews.length === 0)
    return <div className="p-4">No interviews yet.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interview History</h2>

      {interviews.map((interview, index) => (
        <div
          key={interview._id}
          className="border rounded-xl p-4 mb-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                {interview.jobRole} ({interview.experienceLevel})
              </p>
              <p className="text-gray-600">Score: {interview.score}%</p>
              <p className="text-sm text-gray-500">
                {new Date(interview.date).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => toggleExpand(index)}
              className="text-blue-500 hover:underline"
            >
              {expanded === index ? "Hide Details" : "View Details"}
            </button>
          </div>

          {expanded === index && (
            <div className="mt-4 space-y-4">
              {interview.responses?.map((res, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-md border">
                  <p className="font-medium">
                    Q{i + 1}: {res.question}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    <strong>Response:</strong> {res.response}
                  </p>
                  <p className="text-sm mt-2">Score: {res.score}%</p>

                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="font-semibold">Strengths:</p>
                      <ul className="list-disc ml-5">
                        {res.strengths?.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Suggestions:</p>
                      <ul className="list-disc ml-5">
                        {res.suggestions?.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <strong>Relevant Keywords:</strong>
                      {res.keywordAnalysis?.relevant?.join(", ") || "None"}
                    </p>
                    <p>
                      <strong>Irrelevant Keywords:</strong>
                      {res.keywordAnalysis?.irrelevant?.join(", ") || "None"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InterviewHistory;
