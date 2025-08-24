"use client";

import { useState } from "react";
import CounterCard from "@/components/counter-card";
import {
  incrementCounter,
  decrementCounter,
  addCustomValue,
} from "@/components/counter-actions";

interface Counter {
  id: string;
  name: string;
  value: number;
}

interface CountersClientProps {
  initialCounters: Counter[];
}

export default function CountersClient({
  initialCounters,
}: CountersClientProps) {
  const [counters, setCounters] = useState<Counter[]>(initialCounters);

  async function handleIncrement(counterId: string) {
    // Optimistic increment
    setCounters((prev) =>
      prev.map((c) => (c.id === counterId ? { ...c, value: c.value + 1 } : c))
    );

    try {
      const formData = new FormData();
      formData.append("id", counterId);
      await incrementCounter(formData);
      // No need to sync since we already updated optimistically
    } catch (error) {
      // Rollback on failure
      setCounters((prev) =>
        prev.map((c) => (c.id === counterId ? { ...c, value: c.value - 1 } : c))
      );
      console.error("Failed to increment counter:", error);
    }
  }

  async function handleDecrement(counterId: string) {
    // Check if counter is already at 0
    const currentCounter = counters.find((c) => c.id === counterId);
    if (!currentCounter || currentCounter.value <= 0) {
      // Don't allow decrementing below 0
      return;
    }

    // Optimistic decrement
    setCounters((prev) =>
      prev.map((c) => (c.id === counterId ? { ...c, value: c.value - 1 } : c))
    );

    try {
      const formData = new FormData();
      formData.append("id", counterId);
      await decrementCounter(formData);
      // No need to sync since we already updated optimistically
    } catch (error) {
      // Rollback on failure
      setCounters((prev) =>
        prev.map((c) => (c.id === counterId ? { ...c, value: c.value + 1 } : c))
      );
      console.error("Failed to decrement counter:", error);
    }
  }

  async function handleCustomValue(counterId: string, value: number) {
    // Check if the result would be negative
    const currentCounter = counters.find((c) => c.id === counterId);
    if (!currentCounter || currentCounter.value + value < 0) {
      return;
    }

    // Optimistic update
    setCounters((prev) =>
      prev.map((c) =>
        c.id === counterId ? { ...c, value: c.value + value } : c
      )
    );

    try {
      const formData = new FormData();
      formData.append("id", counterId);
      formData.append("value", value.toString());
      await addCustomValue(formData);
      // No need to sync since we already updated optimistically
    } catch (error) {
      // Rollback on failure
      setCounters((prev) =>
        prev.map((c) =>
          c.id === counterId ? { ...c, value: c.value - value } : c
        )
      );
      console.error("Failed to add custom value:", error);
    }
  }

  return (
    <div>
      <div className="space-y-4">
        {counters.map((counter) => (
          <CounterCard
            key={counter.id}
            counter={counter}
            onIncrement={() => handleIncrement(counter.id)}
            onDecrement={() => handleDecrement(counter.id)}
            onCustomValue={(value) => handleCustomValue(counter.id, value)}
          />
        ))}
      </div>

      {counters.length === 0 && (
        <div className="text-center py-12 text-gray-500">No counters yet.</div>
      )}
    </div>
  );
}
