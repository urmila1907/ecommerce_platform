import { cookies } from "next/headers";

// Utility function to forward the request to the backend API
async function forwardRequest(apiUrl, method, headers, body = null) {
  try {
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(apiUrl, options);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error("Error in proxy route:", error);
    return { error: "Internal Server Error" };
  }
}

// Utility function to refresh token
async function refreshToken() {
  try {
    const cookie = await cookies();
    let token = cookie.get("refreshToken")?.value;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh-token`, {
        method: "GET",
        headers: headers,
        credentials: "include"
    });

    if (refreshResponse.ok) {
      const refreshedToken = await refreshResponse.json();
      return refreshedToken.token; 
    } else {
      console.error("Failed to refresh token");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

// Main handler function
export async function proxyHandler(req) {
  let cookie = await cookies();
  let token = cookie.get("authToken")?.value;

  // Extract dynamic path and API URL
  const path = req.nextUrl.pathname.replace("/api/proxy", ""); // Remove `/api/proxy`
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

  // Define headers for the request
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": req.headers.get("content-type") || "application/json",
  };

  // Handle cases where the token is missing or invalid
  if (!token) {
    token = await refreshToken();

    if (!token) {
      return new Response(JSON.stringify({ error: "Failed to refresh token" }), {
        status: 401,
      });
    }
    headers.Authorization = `Bearer ${token}`;
  }

  // Forward the request based on the method
  const { response, data, error } = await forwardRequest(
    apiUrl,
    req.method,
    headers,
    req.method === "PATCH" ? await req.json() : null
  );

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: response.status,
  });
}

// Export the specific handlers for GET and PATCH
export async function GET(req) {
  return proxyHandler(req);
}

export async function PATCH(req) {
  return proxyHandler(req);
}
