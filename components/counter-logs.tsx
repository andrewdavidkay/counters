"use client";

interface CounterLog {
  id: string;
  counterId: string;
  userId: string;
  name: string;
  value: number; // This is now the change amount, not the total
  createdAt: Date;
  updatedAt: Date;
}

interface CounterLogsProps {
  logs: CounterLog[];
}

export default function CounterLogs({ logs }: CounterLogsProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold">Activity</h2>
        <p className="text-gray-600 text-sm">{logs.length} log entries</p>
      </div>

      <div className="divide-y divide-slate-200">
        {logs.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No activity logged yet.</p>
          </div>
        ) : (
          logs.map((log) => {
            const changeType =
              log.value > 0
                ? "increment"
                : log.value < 0
                ? "decrement"
                : "no change";

            const isCustomValue = Math.abs(log.value) !== 1;

            return (
              <div key={log.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-gray-900">
                        {isCustomValue ? "Custom change:" : "Change:"}{" "}
                        {log.value > 0 ? "+" : ""}
                        {log.value}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          changeType === "increment"
                            ? "bg-green-100 text-green-800"
                            : changeType === "decrement"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isCustomValue ? "custom" : changeType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    #{log.id.slice(-8)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
