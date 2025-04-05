import { useQuery } from "@tanstack/react-query";
import ProgressChart from "../components/ProgressChart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Dashboard() {
  const { data: interviews = [] } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => 
      api.get("/api/interviews").then((res) => res.data),
  });

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Metrics
  const totalPractices = interviews.length;
  const avgScore =
    totalPractices > 0
      ? Math.round(
          interviews.reduce((sum, i) => sum + (i.score || 0), 0) /
            totalPractices
        )
      : 0;

  const topicScores = {};
  interviews.forEach((iv) => {
    iv.topics?.forEach(({ name, score }) => {
      if (!topicScores[name]) topicScores[name] = { sum: 0, count: 0 };
      topicScores[name].sum += score;
      topicScores[name].count += 1;
    });
  });
  let weakestArea = "—";
  if (Object.keys(topicScores).length) {
    weakestArea = Object.entries(topicScores)
      .map(([name, { sum, count }]) => ({ name, avg: sum / count }))
      .sort((a, b) => a.avg - b.avg)[0].name;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/setup-interview")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              New Interview
            </button>
            <button
              onClick={() => navigate("/history")}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              View History
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Total Practices"
            value={totalPractices}
            color="blue"
          />
          <StatCard
            label="Average Score"
            value={`${avgScore}%`}
            color="green"
          />
          <StatCard label="Weakest Area" value={weakestArea} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
            <ProgressChart data={interviews} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Practices</h2>
            <div className="space-y-4">
              {interviews
                .slice(-5)
                .reverse()
                .map((iv) => (
                  <div
                    key={iv._id}
                    className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{iv.jobRole}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(iv.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {iv.score}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
