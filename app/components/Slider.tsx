"use client";
import { useState } from "react";

interface SliderProps {
  onValueChange: (value: number) => void;
}

const Slider = ({ onValueChange }: SliderProps) => {
  const [value, setValue] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min="1"
        max="1000"
        value={value}
        onChange={handleChange}
        className="w-full accent-orange-500"
      />
      <span className="text-orange-500 font-bold">{value} ETH</span>
    </div>
  );
};

export default Slider;
