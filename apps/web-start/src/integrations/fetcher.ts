// the <T> means you can run any type
export function backendFetcher<T>(endpoint: string): () => Promise<T> {
  return () => {
    const baseUrl = import.meta.env.DEV 
      // ? 'http://localhost:3000'  // Development
      // : 'https://individual-webapp.onrender.com'
       ?  import.meta.env.VITE_BACKEND_URL_LocalHost
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
    // hello
  };
}
