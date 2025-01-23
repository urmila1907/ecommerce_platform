import { cookies } from 'next/headers';

export async function fetchWithToken(url, options = {}) {
  const token = await getTokenFromCookie();

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    // Trying to refresh the token
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh-token`, {
        method: "POST",
        credentials: "include",
    });

    if (refreshResponse.ok) {
        // Retry the original request
        const refreshedToken = await refreshResponse.json();
        console.log(refreshedToken);
        headers.set("Authorization", `Bearer ${refreshedToken}`);
        response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
        });
    }
  }

  return response;
}

async function getTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}
