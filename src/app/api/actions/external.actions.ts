'use server';

interface ExternalUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
}

export async function fetchExternalUsers(): Promise<{
  success: boolean;
  data?: ExternalUser[];
  error?: string;
}> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return { success: false, error: 'Error al consultar API externa' };
    }

    const data: ExternalUser[] = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'No se pudo conectar con la API' };
  }
}

export async function fetchExternalUserById(id: number): Promise<{
  success: boolean;
  data?: ExternalUser;
  error?: string;
}> {
  try {
    if (id < 1 || id > 10) {
      return { success: false, error: 'ID debe ser entre 1 y 10' };
    }

    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const data: ExternalUser = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'No se pudo conectar con la API' };
  }
}
