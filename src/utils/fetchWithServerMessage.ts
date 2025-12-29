export async function fetchWithServerMessage(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let serverMsg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.message) serverMsg = data.message;
    } catch {
      /* ignore JSON parse errors */
    }
    throw new Error(serverMsg);
  }
  return res;
}
