'use client';

import { useEffect, useState } from 'react';
import type { ActionLog } from '@/types';

export default function ActionLogs() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/logs?limit=20');
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
        }
      } catch {
        console.error('Error cargando logs');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-white/40 text-sm text-center py-8">
        Sin actividad registrada
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${
                log.action_type === 'LOGIN'
                  ? 'bg-emerald-400'
                  : log.action_type === 'FAILED_LOGIN'
                  ? 'bg-red-400'
                  : log.action_type === 'REGISTER'
                  ? 'bg-cyan-400'
                  : 'bg-white/40'
              }`}
            />
            <span className="text-white/80 text-sm font-medium">
              {log.action_type}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {log.ip_address && (
              <span className="text-white/30 text-xs">{log.ip_address}</span>
            )}
            <span className="text-white/40 text-xs">
              {log.created_at
                ? new Date(log.created_at).toLocaleString('es-MX')
                : '-'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
