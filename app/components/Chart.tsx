"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartProps {
  data: { date: string; totalETH: number }[];
}

export default function Chart({ data }: ChartProps) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Total ETH",
        data: data.map((item) => item.totalETH),
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.5)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg w-full">
      <h2 className="text-xl text-white mb-2">📈 Évolution du Total ETH</h2>
      <Line data={chartData} />
    </div>
  );
}
