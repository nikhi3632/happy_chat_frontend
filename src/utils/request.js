const baseUrl = process.env.REACT_APP_API_URL;

export async function apiFetch(path, options = {}) {
  const url = `${baseUrl}${path}`;
  console.log(url);
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}
