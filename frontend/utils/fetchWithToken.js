import { cookies } from 'next/headers';

export async function fetchWithToken(url, options = {}) {
  const token = await getTokenFromCookie();

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return response;
}

async function getTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}
