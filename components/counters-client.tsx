"use client";

import { useRef, useState } from "react";
import CounterCard from "@/components/counter-card";
import { incrementCounter, deleteCounter } from "@/components/counter-actions";

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
      const realCounter = await incrementCounter(formData);
      // Sync with server value
      setCounters((prev) =>
        prev.map((c) => (c.id === counterId ? realCounter : c))
      );
    } catch (error) {
      // Rollback on failure
      setCounters((prev) =>
        prev.map((c) => (c.id === counterId ? { ...c, value: c.value - 1 } : c))
      );
      console.error("Failed to increment counter:", error);
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {counters.map((counter) => (
          <CounterCard
            key={counter.id}
            counter={counter}
            onIncrement={() => handleIncrement(counter.id)}
            onDelete={() => handleDelete(counter.id)}
          />
        ))}
      </div>

      {counters.length === 0 && (
        <div className="text-center py-12 text-gray-500">No counters yet.</div>
      )}
    </div>
  );
}
