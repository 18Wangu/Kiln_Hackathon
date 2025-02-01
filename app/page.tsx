"use client";
import { useState } from "react";
import Slider from "./components/Slider";
import DatePicker from "./components/DatePicker";
import { fetchRewards } from "./api/kiln/route";

export default function Home() {
  const [date, setDate] = useState("2025-01-28");
  const [ethAmount, setEthAmount] = useState(1);
  const [data, setData] = useState<{ date: string; gross_apy: number }[]>([]);

  const handleSearch = async () => {
    const result = await fetchRewards(date);
    setData(result);
  };

  // Fonction pour calculer le montant total d'ETH cumulé
  const calculateTotalETH = () => {
    let totalETH = ethAmount; // Montant initial d'ETH
    return data.map((item) => {
      totalETH += totalETH * (item.gross_apy / 100 / 365);
      return { ...item, totalETH };
    });
  };

  const updatedData = calculateTotalETH();

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

        <div className="mt-6">
          {updatedData.length > 0 ? (
            updatedData.map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg mb-2">
                <p className="text-lg">📅 Date: {item.date}</p>
                <p className="text-lg">🔥 Gross APY: {item.gross_apy}%</p>
                <p className="text-lg text-orange-400">
                  💰 Total ETH: {item.totalETH.toFixed(8)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Aucune donnée disponible.</p>
          )}
        </div>
      </div>
    </main>
  );
}
