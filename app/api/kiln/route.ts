export const fetchRewards = async (date: string, scope: string) => {
  const apiKey = "kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM";
  const url = `https://api.kiln.fi/v1/eth/rewards?scope=${scope}&start_date=${date}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    return data.data.map((entry: any) => ({
      date: entry.date,
      gross_apy: entry.gross_apy,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    return [];
  }
};