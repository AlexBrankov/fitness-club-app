const API_URL = 'http://localhost:4000/api';

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Нещо се обърка.');
  }
  return data;
}
