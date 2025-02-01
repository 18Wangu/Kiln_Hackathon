"use client";
import { useState } from "react";

const Slider = () => {
  const [value, setValue] = useState(1);

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min="1"
        max="1000"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
      <span className="text-orange-500 font-bold">{value} ETH</span>
    </div>
  );
};

export default Slider;
