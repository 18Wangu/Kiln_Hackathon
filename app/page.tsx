"use client";

import { useState } from "react";
import WalletInput from "./components/WalletInput";
import Slider from "./components/Slider";
import DatePicker from "./components/DatePicker";
import Chart from "./components/Chart";

export default function Home() {
  // State pour la première recherche (APY moyen des validateurs)
  const [averageGrossApy, setAverageGrossApy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State pour la deuxième recherche (ETH Rewards)
  const [date, setDate] = useState("2025-01-28");
  const [ethAmount, setEthAmount] = useState(1);
  const [kilnData, setKilnData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [networkData, setNetworkData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [ethPrice, setEthPrice] = useState(0);

  // Fonction pour gérer la première recherche (APY)
  const handleSearchApy = async (wallet: string, date: string) => {
    setLoading(true);
    setError(null);
    setAverageGrossApy(null);

    try {
      const response = await fetch(`/api/wallet?wallet=${wallet}&date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();

      // Calcul de la moyenne des gross_apy
      if (result.data && result.data.length > 0) {
        const totalApy = result.data.reduce((sum: number, item: { gross_apy: number }) => sum + item.gross_apy, 0);
        const averageApy = totalApy / result.data.length;
        setAverageGrossApy(averageApy);
      } else {
        setError("No data found for the selected period");
      }
    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer la deuxième recherche (ETH Rewards)
  const handleSearchRewards = async () => {
    try {
      // Appel API pour récupérer les données de Kiln et Network
      const kilnResult = await fetch(`/api/kiln?date=${date}&scope=kiln`).then((res) => res.json());
      const networkResult = await fetch(`/api/kiln?date=${date}&scope=network`).then((res) => res.json());

      // Appel API pour récupérer le prix de l'ETH
      const ethPriceResponse = await fetch("/api/eth-price");
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
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Find the best place to stake your ETH</h1>

        {/* Première section : APY moyen */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Validator Average APY</h2>
          <WalletInput onSearch={handleSearchApy} />
          {loading && <p className="mt-4">Loading...</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {averageGrossApy !== null && (
            <div className="mt-6">
              <p className="text-xl text-center">{averageGrossApy.toFixed(4)}%</p>
            </div>
          )}
        </div>

        {/* Deuxième section : ETH Rewards */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">ETH Rewards</h2>
          <DatePicker onDateChange={setDate} />
          <Slider onValueChange={setEthAmount} />

          <button
            onClick={handleSearchRewards}
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
      </div>
    </div>
  );
}
