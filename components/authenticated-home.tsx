"use client";

import CreateCounterModal from "@/components/create-counter-modal";
import CountersClient from "@/components/counters-client";

interface Counter {
  id: string;
  name: string;
  value: number;
}

interface AuthenticatedHomeProps {
  initialCounters: Counter[];
}

export default function AuthenticatedHome({
  initialCounters,
}: AuthenticatedHomeProps) {
  const handleCounterCreated = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your counters</h1>
        <CreateCounterModal onCounterCreated={handleCounterCreated} />
      </div>
      <CountersClient initialCounters={initialCounters} />
    </div>
  );
}
