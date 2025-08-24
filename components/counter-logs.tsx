"use client";

interface CounterLog {
  id: string;
  counterId: string;
  userId: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CounterLogsProps {
  logs: CounterLog[];
  currentValue: number;
}

export default function CounterLogs({ logs, currentValue }: CounterLogsProps) {
  // Calculate the change for each log entry
  const logsWithChanges = logs.map((log, index) => {
    const previousLog = logs[index + 1]; // Next log in the array (since it's ordered by desc)
    const change = previousLog ? log.value - previousLog.value : log.value;

    return {
      ...log,
      change,
      changeType:
        change > 0 ? "increment" : change < 0 ? "decrement" : "no change",
    };
  });

  return (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <p className="text-gray-600 text-sm">{logs.length} log entries</p>
      </div>

      <div className="divide-y divide-slate-200">
        {logs.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No activity logged yet.</p>
          </div>
        ) : (
          logsWithChanges.map((log, index) => (
            <div key={log.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-gray-900">
                      Value: {log.value}
                    </div>
                    {log.change !== 0 && (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          log.changeType === "increment"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.changeType === "increment" ? "+" : ""}
                        {log.change}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-400">#{log.id.slice(-8)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
