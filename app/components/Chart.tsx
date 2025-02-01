"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartProps {
  kilnData: { date: string; totalETH: number }[];
  networkData: { date: string; totalETH: number }[];
  kilnRewardsUSD: number;
  networkRewardsUSD: number;
}

export default function Chart({ kilnData, networkData, kilnRewardsUSD, networkRewardsUSD }: ChartProps) {
  const chartData = {
    labels: kilnData.map((item) => item.date),
    datasets: [
      {
        label: "Total ETH (Kiln)",
        data: kilnData.map((item) => item.totalETH),
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.5)",
        tension: 0.4,
      },
      {
        label: "Total ETH (Network)",
        data: networkData.map((item) => item.totalETH),
        borderColor: "gray",
        backgroundColor: "rgba(128, 128, 128, 0.5)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg w-full">
      <h2 className="text-xl text-white mb-2">
        📈 Rewards en USD : <strong className="text-orange-500">Kiln</strong> (${kilnRewardsUSD.toFixed(2)}) vs Network (${networkRewardsUSD.toFixed(2)})
      </h2>
      <Line data={chartData} />
    </div>
  );
}