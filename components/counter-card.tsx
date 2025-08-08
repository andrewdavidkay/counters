"use client";

interface Counter {
  id: string;
  name: string;
  value: number;
}

interface CounterCardProps {
  counter: Counter;
  onIncrement: () => void;
  onDelete: () => void;
}

export default function CounterCard({
  counter,
  onIncrement,
  onDelete,
}: CounterCardProps) {
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
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
            aria-label={`Delete ${counter.name}`}
          >
            ×
          </button>
        </div>
      </div>
      <div className="text-3xl font-bold text-blue-700">{counter.value}</div>
    </div>
  );
}
