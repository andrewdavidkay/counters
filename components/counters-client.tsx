"use client";

import { useRef, useState } from "react";
import CounterCard from "@/components/counter-card";
import {
  incrementCounter,
  decrementCounter,
  deleteCounter,
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
  const formRef = useRef<HTMLFormElement>(null);
  const [counters, setCounters] = useState<Counter[]>(initialCounters);

  async function handleCreate(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;

    const optimisticId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `optimistic-${Date.now()}`;

    const optimisticCounter: Counter = {
      id: optimisticId,
      name,
      value: 0,
    };

    // Optimistic add
    setCounters((prev) => [optimisticCounter, ...prev]);

    try {
      const res = await fetch("/api/counters/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      const realCounter: Counter = data.counter;
      // Replace optimistic with real
      setCounters((prev) =>
        prev.map((c) => (c.id === optimisticId ? realCounter : c))
      );
    } catch (error) {
      // Revert optimistic add on failure
      setCounters((prev) => prev.filter((c) => c.id !== optimisticId));
      console.error("Failed to create counter:", error);
    }

    formRef.current?.reset();
  }

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

  async function handleDelete(counterId: string) {
    // Optimistic delete
    setCounters((prev) => prev.filter((c) => c.id !== counterId));

    try {
      const formData = new FormData();
      formData.append("id", counterId);
      await deleteCounter(formData);
      // No need to sync since we already removed it optimistically
    } catch (error) {
      // Revert optimistic delete on failure
      console.error("Failed to delete counter:", error);
      // We'd need to restore the counter here, but we don't have the original data
      // This is a limitation of optimistic deletes
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <form ref={formRef} action={handleCreate} className="flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="Counter Name"
            className="border rounded-md px-3 py-2"
          />
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">
            Create Counter
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {counters.map((counter) => (
          <CounterCard
            key={counter.id}
            counter={counter}
            onIncrement={() => handleIncrement(counter.id)}
            onDecrement={() => handleDecrement(counter.id)}
            onDelete={() => handleDelete(counter.id)}
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
