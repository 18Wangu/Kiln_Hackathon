"use client";
import { useState } from "react";

interface DatePickerProps {
  onDateChange: (date: string) => void;
}

const DatePicker = ({ onDateChange }: DatePickerProps) => {
  const [date, setDate] = useState("2025-01-28");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onDateChange(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-white mb-2">Sélectionnez une date :</label>
      <input
        type="date"
        value={date}
        onChange={handleChange}
        className="border border-orange-500 text-black p-2 rounded-lg bg-white"
      />
    </div>
  );
};

export default DatePicker;
