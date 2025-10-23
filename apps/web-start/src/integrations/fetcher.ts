// the <T> means you can run any type
export function backendFetcher<T>(endpoint: string): () => Promise<T> {
  return () => {
    const baseUrl = import.meta.env.DEV 
      ? 'http://localhost:3000'  // Development
      : import.meta.env.VITE_BACKEND_URL; // Production

    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    return fetch(`${baseUrl}${normalizedEndpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return res.json();
    });

  };
}

export async function mutateBackend<T>(
  endpoint: string,
  method: string,
  body?: any,
): Promise<T> {
   const baseUrl = import.meta.env.DEV 
      ? 'http://localhost:3000'  // Development
      : import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(baseUrl + endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}