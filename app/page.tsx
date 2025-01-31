"use client"; // Indique que ce composant est côté client

import { useState } from "react";

// Définir le type de la réponse de l'API
type ApiResponse = {
  data: {
    date: string;
    consensus_rewards: string;
    execution_rewards: string;
    mev_execution_rewards: string;
    non_mev_execution_rewards: string;
    median_execution_reward: string;
    active_validator_count: number;
    rewards: string;
    stake_balance: string;
    gross_apy: number;
    cl_apy: number;
    el_apy: number;
  }[];
};

export default function Home() {
  const [ethAmount, setEthAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!ethAmount || !startDate) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/kiln?start_date=${startDate}&scope=kiln`,
        {
          headers: {
            Authorization: `Bearer kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data: ApiResponse = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Calculateur de récompenses Kiln
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Montant d'ETH à staker :
            </label>
            <input
              type="number"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="Ex: 10"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de début :
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Recherche en cours..." : "Rechercher"}
          </button>
        </div>

        {apiResponse && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Résultats :</h2>
            <pre className="text-sm bg-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}