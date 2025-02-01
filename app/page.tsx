"use client";
import { useState } from "react";
import Slider from "./components/Slider";
import DatePicker from "./components/DatePicker";
import Chart from "./components/Chart";
import { fetchRewards } from "./api/kiln/route";

export default function Home() {
  const [date, setDate] = useState("2025-01-28");
  const [ethAmount, setEthAmount] = useState(1);
  const [kilnData, setKilnData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [networkData, setNetworkData] = useState<{ date: string; gross_apy: number }[]>([]);

  const handleSearch = async () => {
    const kilnResult = await fetchRewards(date, "kiln");
    const networkResult = await fetchRewards(date, "network");
    setKilnData(kilnResult);
    setNetworkData(networkResult);
  };

  const calculateTotalETH = (data: { date: string; gross_apy: number }[]) => {
    let totalETH = ethAmount;
    return data.map((item) => {
      totalETH += totalETH * (item.gross_apy / 100 / 365);
      return { ...item, totalETH };
    });
  };

  const updatedKilnData = calculateTotalETH(kilnData);
  const updatedNetworkData = calculateTotalETH(networkData);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">ETH Rewards</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <DatePicker onDateChange={setDate} />
        <Slider onValueChange={setEthAmount} />

        <button
          onClick={handleSearch}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Search
        </button>
      </div>

      {/* Affichage du graphique */}
      <div className="mt-6 w-full max-w-2xl">
        {(updatedKilnData.length > 0 || updatedNetworkData.length > 0) && (
          <Chart kilnData={updatedKilnData} networkData={updatedNetworkData} />
        )}
      </div>
    </main>
  );
}