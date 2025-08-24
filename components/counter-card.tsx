"use client";

import { useState } from "react";

interface Counter {
  id: string;
  name: string;
  value: number;
}

interface CounterCardProps {
  counter: Counter;
  onIncrement: () => void;
  onDecrement: () => void;
  onCustomValue: (value: number) => void;
}

export default function CounterCard({
  counter,
  onIncrement,
  onDecrement,
  onCustomValue,
}: CounterCardProps) {
  const [customValue, setCustomValue] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const isDecrementDisabled = counter.value <= 0;

  const handleCustomValueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(customValue);
    if (!isNaN(value)) {
      onCustomValue(value);
      setCustomValue("");
      setIsInputVisible(false);
    }
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, minus sign, and numbers
    if (value === "" || value === "-" || /^-?\d*$/.test(value)) {
      setCustomValue(value);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{counter.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={onIncrement}
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label={`Increment ${counter.name}`}
          >
            +
          </button>
          <button
            onClick={onDecrement}
            disabled={isDecrementDisabled}
            title={
              isDecrementDisabled
                ? "Counter cannot go below 0"
                : `Decrement ${counter.name}`
            }
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isDecrementDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
            aria-label={`Decrement ${counter.name}`}
          >
            −
          </button>
          <button
            onClick={() => setIsInputVisible(!isInputVisible)}
            className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
            aria-label={`Add custom value to ${counter.name}`}
            title="Add custom value"
          >
            ±
          </button>
        </div>
      </div>

      <div className="text-3xl font-bold text-blue-700 mb-3">
        {counter.value}
      </div>

      {isInputVisible && (
        <form onSubmit={handleCustomValueSubmit} className="mt-3">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={customValue}
              onChange={handleCustomValueChange}
              placeholder="Enter value"
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={customValue === "" || customValue === "-"}
                className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsInputVisible(false);
                  setCustomValue("");
                }}
                className="flex-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
