import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import ProgressChart from "../components/ProgressChart";
import Loader from "../components/Loader"; // Create a loading spinner component
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    data: interviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => api.get("/api/interviews").then((res) => res.data),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Interview Stats</h2>
        <ProgressChart data={interviews} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Interviews</h3>
          {interviews?.slice(0, 5).map((interview) => (
            <div key={interview._id} className="py-2 border-b">
              {interview.jobRole} -{" "}
              {new Date(interview.date).toLocaleDateString()}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
          <button
            onClick={() => navigate("/interview")}
            className="bg-primary text-white px-6 py-3 rounded w-full hover:bg-primary-dark transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
