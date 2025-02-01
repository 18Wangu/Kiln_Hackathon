"use client";

import KilnWidget from "../components/KilnWidget";

export default function StakeWithKiln() {
  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Stake with Kiln</h1>
        
        {/* Ajoutez ici le contenu de votre page de staking */}
        <div className="flex justify-center mb-8">
          <KilnWidget />
        </div>
        
        {/* Bouton de retour */}
        <div className="mt-6 flex justify-center">
          <a 
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
} 