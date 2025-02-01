// app/api/eth-price/route.ts

export const fetchEthPrice = async () => {
    const apiKey = "kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM";
    const url = "https://api.kiln.fi/v1/eth/network-stats";
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();
      return data.data.eth_price_usd;
    } catch (error) {
      console.error("Erreur lors de la récupération du prix de l'ETH", error);
      return 0; // Retourne 0 en cas d'erreur
    }
  };