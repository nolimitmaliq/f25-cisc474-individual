// the <T> means you can run any type
export function backendFetcher<T>(endpoint: string): () => Promise<T> {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL_local_host
  return () =>
    fetch(baseUrl + endpoint,{
      credentials: 'include'
    }).then((res) =>
      res.json(),
    );
}
