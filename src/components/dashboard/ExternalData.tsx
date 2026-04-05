'use client';

import { useEffect, useState } from 'react';
import { fetchExternalUsers } from '@/app/api/actions/external.actions';

interface ExtUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  company: { name: string };
}

export default function ExternalData() {
  const [users, setUsers] = useState<ExtUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await fetchExternalUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setError(result.error || 'Error');
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-300 text-sm bg-red-500/10 border border-red-400/20 rounded-lg px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {users.slice(0, 6).map((user) => (
        <div
          key={user.id}
          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-white/90 text-sm font-medium">{user.name}</p>
              <p className="text-white/40 text-xs">@{user.username}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-white/50 text-xs">{user.email}</p>
            <p className="text-white/30 text-xs">{user.company.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
