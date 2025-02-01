// app/api/kiln/route.ts

import { NextResponse } from 'next/server';

type RewardEntry = {
  date: string;
  gross_apy: number;
};

const fetchRewards = async (date: string, scope: string): Promise<RewardEntry[]> => {
  const apiKey = "kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM";
  const url = `https://api.kiln.fi/v1/eth/rewards?scope=${scope}&start_date=${date}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    return data.data.map((entry: RewardEntry) => ({
      date: entry.date,
      gross_apy: entry.gross_apy,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    return [];
  }
};

// Définir l'API route handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || '2025-01-28'; // Valeur par défaut
  const scope = url.searchParams.get('scope') || 'kiln'; // Valeur par défaut

  try {
    const rewards = await fetchRewards(date, scope);
    return NextResponse.json(rewards);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des données" }, { status: 500 });
  }
}
