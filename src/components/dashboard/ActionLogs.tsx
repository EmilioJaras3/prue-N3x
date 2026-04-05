'use client';

import { useEffect, useState } from 'react';
import type { ActionLog } from '@/types';
import { saveVaultSecret } from '@/app/api/actions/vault.actions';
import { LockIcon, PlusIcon } from 'lucide-react';

export default function ActionLogs() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [secretText, setSecretText] = useState('');
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSaveSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretText.trim()) return;
    setSaving(true);
    const res = await saveVaultSecret(secretText);
    if (res.success) {
      setSecretText('');
      fetchLogs(); // Recargar lista
    }
    setSaving(false);
  };

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
    <div className="space-y-4 flex flex-col h-full">
      {/* Formulario Add Secret */}
      <form onSubmit={handleSaveSecret} className="flex flex-col sm:flex-row gap-2 mb-2 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
        <input 
          type="text" 
          value={secretText}
          onChange={(e) => setSecretText(e.target.value)}
          placeholder="Escribe un dato clasificado..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          disabled={saving}
        />
        <button 
          type="submit" 
          disabled={saving || !secretText.trim()}
          className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? <LockIcon size={14} className="animate-pulse" /> : <PlusIcon size={14} />}
          {saving ? 'Cifrando...' : 'Guardar'}
        </button>
      </form>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg gap-2"
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
                    : log.action_type === 'VAULT_SECRET'
                    ? 'bg-purple-400 animate-pulse'
                    : 'bg-white/40'
                }`}
              />
              <span className="text-white/80 text-sm font-medium whitespace-nowrap">
                {log.action_type}
              </span>
            </div>
            {log.action_type === 'VAULT_SECRET' && log.action_details ? (
              <div className="text-purple-300/80 text-sm font-mono flex-1 overflow-hidden text-ellipsis whitespace-nowrap lg:ml-2 border-l border-white/10 lg:pl-3">
                {log.action_details}
              </div>
            ) : null}
            <div className="flex items-center gap-4 text-right justify-end ml-auto">
              <span className="text-white/40 text-xs whitespace-nowrap">
                {log.created_at
                  ? new Date(log.created_at).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
                  : '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
