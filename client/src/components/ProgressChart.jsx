import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressChart({ data }) {
  const chartData = {
    labels: data?.map((_, index) => `Interview ${index + 1}`) || [],
    datasets: [
      {
        label: 'Scores',
        data: data?.map(i => i.score) || [], // Changed from overallScore to score
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
}