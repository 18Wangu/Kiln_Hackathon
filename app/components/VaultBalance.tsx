// Define proper types for ethereum methods and callbacks
declare global {
    interface Window {
      ethereum?: {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        on: (eventName: string, callback: (params: unknown[]) => void) => void;
        removeListener: (eventName: string, callback: (params: unknown[]) => void) => void;
      };
    }
  }
  
  "use client";
  
  import { useState, useEffect } from "react";
  import { ethers } from "ethers";
  
  const VAULT_ADDRESS = "0xDea01Fc5289aF2c440Ca65582e3C44767C0fcf08";
  const ABI = [
    {
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
      "stateMutability": "view",
      "type": "function",
    },
  ];
  
  export default function VaultBalance() {
    const [balance, setBalance] = useState<string | null>(null);
    const [account, setAccount] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchBalance = async () => {
        if (!window.ethereum) {
          console.error("MetaMask is required");
          return;
        }
  
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setAccount(userAddress);
  
          const contract = new ethers.Contract(VAULT_ADDRESS, ABI, provider);
          const balanceRaw = await contract.balanceOf(userAddress);
          setBalance(ethers.formatUnits(balanceRaw, 18)); // Adapter si la décimale diffère
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
  
      fetchBalance();
    }, []);
  
    return (
      <div className="text-white p-4 bg-gray-900 rounded-lg shadow-lg flex flex-col items-center">
        {account ? (
          <p className="mt-2 text-center">Connected Wallet: {account}</p>
        ) : (
          <p className="mt-2 text-red-500">Not connected</p>
        )}
        <p className="mt-2">Balance: {balance !== null ? `${balance} tokens` : "Loading..."}</p>
      </div>
    );
  }