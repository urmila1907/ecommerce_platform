import { cookies } from "next/headers";

// Utility function to forward the request to the backend API
async function forwardRequest(apiUrl, method, headers, body = null) {
  try {
    const options = {
      method,
      headers,
      credentials: "include",  
    };

    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(apiUrl, options);
    const setCookie = response.headers.get("set-cookie");
    const data = await response.json();

    return { response, data, setCookie};
  } catch (error) {
    console.error("Error in proxy route:", error);
    return { error: "Internal Server Error" };
  }
}

// Utility function to refresh token
async function refreshToken() {
  try {
    const cookie = await cookies();
    let refreshToken = cookie.get("refreshToken")?.value;
    if (!refreshToken) {
      console.error("No refresh token available.");
      return null;
    }

    const headers = {
      Authorization: `Bearer ${refreshToken}`,
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

  const path = req.nextUrl.pathname.replace("/api/proxy", "");
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

  if (!token) {
    token = await refreshToken();
    if (!token) {
      return new Response(JSON.stringify({ error: "Failed to refresh token" }), {
        status: 401,
      });
    }
  }

  const headers = {
    Authorization: `Bearer ${token}`
  };

  if (req.headers.get("content-type")) {
    headers["Content-Type"] = req.headers.get("content-type");
  }

  let body = null;

  if (["PATCH", "POST"].includes(req.method)) {
    try {
      const text = await req.text();
      body = text.trim() ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const { response, data, setCookie } = await forwardRequest(
    apiUrl,
    req.method,
    headers,
    body
  );
  const responseHeaders = new Headers();
  if (setCookie) {
    responseHeaders.append("set-cookie", setCookie);
  }
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: responseHeaders,
  });
}

// Export the specific handlers for GET, PATCH, POST and DELETE
export async function GET(req) {
  return proxyHandler(req);
}

export async function PATCH(req) {
  return proxyHandler(req);
}

export async function POST(req) {
  return proxyHandler(req);
}

export async function DELETE(req) {
  return proxyHandler(req);
}

