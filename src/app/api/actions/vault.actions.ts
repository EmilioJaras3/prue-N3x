'use server';

import { db } from '@/lib/db';
import { action_logs } from '@/services/postgres/schema';
import { getCurrentUser } from './auth.actions';

export async function saveVaultSecret(secretText: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRes = await getCurrentUser();
    if (!userRes.success || !userRes.data) {
      return { success: false, error: 'No autorizado' };
    }

    if (!secretText || secretText.trim().length === 0) {
      return { success: false, error: 'El secreto no puede estar vacío' };
    }

    await db.insert(action_logs).values({
      user_id: userRes.data.id,
      action_type: 'VAULT_SECRET',
      action_details: `Secreto guardado: ${secretText.substring(0, 50)}${secretText.length > 50 ? '...' : ''}`,
      ip_address: 'Encrypted',
      user_agent: 'Vault Pro System',
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving secret:', error);
    return { success: false, error: 'Error al asegurar el dato' };
  }
}
