import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function SaveInterviewButton({ interviewData }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/interviews", interviewData);
      return data;
    },
    onSuccess: () => {
      // Invalidate the interviews query and redirect
      queryClient.invalidateQueries("interviews");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save interview. Please try again.");
    }
  });

  return (
    <button
      onClick={() => saveMutation.mutate()}
      disabled={saveMutation.isPending}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
    >
      {saveMutation.isPending ? "Saving..." : "Save Interview"}
    </button>
  );
}