"use client";
import { useState } from "react";
import Slider from "./components/Slider";
import DatePicker from "./components/DatePicker";
import { fetchRewards } from "./api/kiln/route";

export default function Home() {
  const [date, setDate] = useState("2025-01-28");
  const [data, setData] = useState<{ date: string; gross_apy: number }[]>([]);

  const handleSearch = async () => {
    const result = await fetchRewards(date);
    setData(result);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">ETH Rewards</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <DatePicker onDateChange={setDate} />
        <Slider />

        <button
          onClick={handleSearch}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Search
        </button>

        <div className="mt-6">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg mb-2">
                <p className="text-lg">📅 Date: {item.date}</p>
                <p className="text-lg">🔥 Gross APY: {item.gross_apy}%</p>
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
