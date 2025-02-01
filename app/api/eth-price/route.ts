// api/eht-price/route.ts

export async function GET() {
    const apiKey = "kiln_DBmNa8Y4Eu7O1ZCx9QMdTS4fQckBnWOEuwEqw9IM";
    const url = "https://api.kiln.fi/v1/eth/network-stats";
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();
      return new Response(JSON.stringify({ eth_price_usd: data.data.eth_price_usd }), {
        status: 200,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du prix de l'ETH", error);
      return new Response("Erreur lors de la récupération du prix de l'ETH", { status: 500 });
    }
  }
  