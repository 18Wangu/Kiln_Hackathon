// app/page.tsx
"use client";

import { useState } from "react";
import WalletInput from "./components/WalletInput";
import KilnApyCalculator from "./components/KilnApyCalculator"; // Nouveau composant
import Slider from "./components/Slider";
import Chart from "./components/Chart";
import VaultBalance from "./components/VaultBalance";

export default function Home() {
  // State pour la première recherche (APY moyen des validateurs)
  const [averageGrossApy, setAverageGrossApy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State pour la deuxième recherche (ETH Rewards)
  const [date, setDate] = useState("");
  const [ethAmount, setEthAmount] = useState(1);
  const [kilnData, setKilnData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [networkData, setNetworkData] = useState<{ date: string; gross_apy: number }[]>([]);
  const [ethPrice, setEthPrice] = useState(0);

  // Nouveau state pour l'APY moyen de Kiln
  const [kilnAverageApy, setKilnAverageApy] = useState<number | null>(null);

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

  // Nouvelle fonction pour gérer la recherche de l'APY moyen de Kiln
  const handleSearchKilnApy = async (date: string) => {
    setLoading(true);
    setError(null);
    setKilnAverageApy(null);

    try {
      const response = await fetch(`/api/kiln?date=${date}&scope=kiln`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();

      // Calcul de la moyenne des gross_apy
      if (result.length > 0) {
        const totalApy = result.reduce((sum: number, item: { gross_apy: number }) => sum + item.gross_apy, 0);
        const averageApy = totalApy / result.length;
        setKilnAverageApy(averageApy);
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

        {/* Section du dashboard avec les APY côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Première section : APY moyen du wallet */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
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

          {/* Deuxième section : APY moyen de Kiln */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Kiln Validators Average APY</h2>
            <div className="flex justify-center">
              <KilnApyCalculator onSearch={handleSearchKilnApy} />
            </div>
            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {kilnAverageApy !== null && (
              <div className="mt-6">
                <p className="text-xl text-center">{kilnAverageApy.toFixed(4)}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Affichage de la différence entre les deux APY */}
        {averageGrossApy !== null && kilnAverageApy !== null && (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">APY Difference</h2>
            <p className="text-xl text-center">
              {(averageGrossApy - kilnAverageApy).toFixed(4)}%
            </p>
          </div>
        )}

        {/* Section ETH Rewards avec les récompenses USD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ETH Rewards Input */}
          <div className="bg-gray-900 p-24 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4 text-center">ETH Rewards</h2>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white mb-4"
            />
            <Slider onValueChange={setEthAmount} />

            <button
              onClick={handleSearchRewards}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Search
            </button>
          </div>

          {/* USD Rewards Comparison */}
          {(updatedKilnData.length > 0 || updatedNetworkData.length > 0) && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Rewards in USD</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Kiln:</span>
                  <span className="font-semibold">${kilnRewardsUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Network:</span>
                  <span className="font-semibold">${networkRewardsUSD.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span>Difference:</span>
                    <span className="font-semibold text-orange-500">
                      ${(kilnRewardsUSD - networkRewardsUSD).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vault Balance */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Vault Balance</h2>
            <VaultBalance />
          </div>
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