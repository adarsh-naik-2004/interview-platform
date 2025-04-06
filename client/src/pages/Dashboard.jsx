import { useQuery } from "@tanstack/react-query";
import ProgressChart from "../components/ProgressChart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { TrendingUp, Target, Flame, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: interviews = [] } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => api.get("/api/interviews").then((res) => res.data),
  });

  const navigate = useNavigate();
  const { logout } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-6 sm:p-10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-3rem] left-[-3rem] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-[-3rem] right-[-3rem] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] right-[25%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Monitor your growth and track interview prep insights
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/setup-interview")}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-md"
            >
              + New Interview
            </button>
            <button
              onClick={() => navigate("/history")}
              className="bg-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition-all shadow-md flex items-center gap-2"
            >
              <Clock size={18} />
              View History
            </button>
            <button
              onClick={() => {
                logout();
              }}
              className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition-all shadow-md"
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
            icon={<TrendingUp />}
          />
          <StatCard
            label="Average Score"
            value={`${avgScore}%`}
            color="green"
            icon={<Target />}
          />
          <StatCard
            label="Weakest Area"
            value={weakestArea}
            color="red"
            icon={<Flame />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📈 Progress Overview
            </h2>
            <ProgressChart data={interviews} />
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl h-[400px] sm:h-[450px] md:h-[550px] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🕒 Recent Practices
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
              {interviews
                .slice(-10)
                .reverse()
                .map((iv) => (
                  <div
                    key={iv._id}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {iv.jobRole}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(iv.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
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

function StatCard({ label, value, color, icon }) {
  const colorThemes = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-700",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl transition-all flex items-center gap-4 border border-gray-200 hover:scale-[1.02]">
      <div className={`${colorThemes[color].bg} p-3 rounded-full shadow-inner`}>
        <div className={`${colorThemes[color].text} text-2xl`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">{label}</h3>
        <p className={`text-3xl font-bold ${colorThemes[color].text}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
