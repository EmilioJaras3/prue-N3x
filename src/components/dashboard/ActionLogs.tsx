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
      <form onSubmit={handleSaveSecret} className="flex flex-col sm:flex-row gap-2 mb-4 p-4 bg-black/60 border border-red-500/30 rounded-xl shadow-[inset_0_0_20px_rgba(255,0,0,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 blur-xl group-hover:bg-red-500/20 transition-all" />
        <input 
          type="text" 
          value={secretText}
          onChange={(e) => setSecretText(e.target.value)}
          placeholder="[ INGRESAR ESPECIE ATRAPADA ]"
          className="flex-1 bg-black/80 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 uppercase placeholder:text-white/20"
          disabled={saving}
        />
        <button 
          type="submit" 
          disabled={saving || !secretText.trim()}
          className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 px-6 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap shadow-[0_0_15px_rgba(56,189,248,0.2)]"
        >
          {saving ? <LockIcon size={14} className="animate-pulse" /> : <PlusIcon size={14} />}
          {saving ? 'Transfiriendo...' : 'Transferir a PC'}
        </button>
      </form>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-3 bg-black/40 border border-white/5 hover:border-red-500/20 rounded-lg gap-3 transition-colors group cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-black/80 shadow-inner overflow-hidden">
                <span
                  className={`block w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${
                    log.action_type === 'LOGIN'
                      ? 'bg-cyan-400 text-cyan-400'
                      : log.action_type === 'FAILED_LOGIN'
                      ? 'bg-orange-500 text-orange-500'
                      : log.action_type === 'REGISTER'
                      ? 'bg-slate-400 text-slate-400'
                      : log.action_type === 'VAULT_SECRET'
                      ? 'bg-red-500 text-red-500 animate-[pulse_1s_ease-in-out_infinite]'
                      : 'bg-white/40 text-white/40'
                  }`}
                />
              </div>
              <span className="text-white/60 text-xs font-mono tracking-widest uppercase whitespace-nowrap group-hover:text-white transition-colors">
                {log.action_type === 'VAULT_SECRET' ? 'CAPTURADO' : log.action_type}
              </span>
            </div>
            {log.action_type === 'VAULT_SECRET' && log.action_details ? (
              <div className="text-red-400 font-bold text-sm tracking-widest font-space flex-1 overflow-hidden text-ellipsis whitespace-nowrap lg:ml-2 border-l border-white/5 lg:pl-4 uppercase">
                {log.action_details}
              </div>
            ) : null}
            <div className="flex items-center gap-4 text-right justify-end ml-auto">
              <span className="text-cyan-400/50 text-[10px] uppercase font-mono tracking-widest whitespace-nowrap bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/10">
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
