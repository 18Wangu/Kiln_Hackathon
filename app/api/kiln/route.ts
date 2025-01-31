import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start_date");
  const scope = searchParams.get("scope");

  if (!startDate || !scope) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.kiln.fi/v1/eth/rewards?start_date=${startDate}&scope=${scope}`,
      {
        headers: {
          Authorization: `Bearer kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}