"use client";
import { useState } from "react";
import Slider from "./components/Slider";
import DatePicker from "./components/DatePicker";
import Chart from "./components/Chart";

export default function Home() {
  const [date, setDate] = useState("2025-01-28");
  const [ethAmount, setEthAmount] = useState(1);
  const [kilnData, setKilnData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [networkData, setNetworkData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [ethPrice, setEthPrice] = useState(0);

  const handleSearch = async () => {
    try {
      // Appel API pour récupérer les données de Kiln et Network
      const kilnResult = await fetch(`/api/kiln?date=${date}&scope=kiln`).then((res) => res.json());
      const networkResult = await fetch(`/api/kiln?date=${date}&scope=network`).then((res) => res.json());

      // Appel API pour récupérer le prix de l'ETH
      const ethPriceResponse = await fetch('/api/eth-price');
      const ethPriceData = await ethPriceResponse.json();
      const ethPriceResult = ethPriceData.eth_price_usd;

      setKilnData(kilnResult);
      setNetworkData(networkResult);
      setEthPrice(ethPriceResult);
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
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

  // Calcul des rewards en ETH
  const lastKilnTotalETH = updatedKilnData.length > 0 ? updatedKilnData[updatedKilnData.length - 1].totalETH : 0;
  const lastNetworkTotalETH = updatedNetworkData.length > 0 ? updatedNetworkData[updatedNetworkData.length - 1].totalETH : 0;

  const kilnRewardsETH = lastKilnTotalETH - ethAmount;
  const networkRewardsETH = lastNetworkTotalETH - ethAmount;

  // Conversion des rewards en USD
  const kilnRewardsUSD = kilnRewardsETH * ethPrice;
  const networkRewardsUSD = networkRewardsETH * ethPrice;

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
          <Chart
            kilnData={updatedKilnData}
            networkData={updatedNetworkData}
            kilnRewardsUSD={kilnRewardsUSD}
            networkRewardsUSD={networkRewardsUSD}
          />
        )}
      </div>
    </main>
  );
}
