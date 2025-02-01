// components/KilnApyCalculator.tsx
import { useState } from "react";

export default function KilnApyCalculator({
  onSearch,
}: {
  onSearch: (date: string) => void;
}) {
  const [date, setDate] = useState("");

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white mb-4"
      />
      <button
        onClick={() => onSearch(date)}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full"
      >
        Search Kiln APY
      </button>
    </div>
  );
}