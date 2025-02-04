import { cookies } from 'next/headers';

export async function fetchWithToken(url, options = {}) {
  let token = await getAuthTokenFromCookie();

  let headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Trying to refresh the token
    token = await getRefreshTokenFromCookie();
    headers.set("Authorization", `Bearer ${token}`);

    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh-token`, {
        method: "POST",
        credentials: "include",
    });

    if (refreshResponse.ok) {
        // Retry the original request
        const res = await refreshResponse.json();
        token = res.token;
        headers.set("Authorization", `Bearer ${token}`);

        response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
        });
    }
  }
  return response;
}

async function getAuthTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

async function getRefreshTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value;
}
