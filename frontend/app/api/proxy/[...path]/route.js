import { cookies } from "next/headers";

export async function GET(req) {
  const cookie = await cookies();
  const token = cookie.get("authToken")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Extract the dynamic path from the request
  const path = req.nextUrl.pathname.replace("/api/proxy", ""); // Remove `/api/proxy`
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": req.headers.get("content-type") || "application/json",
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
    });
  } catch (error) {
    console.error("Error in proxy route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PATCH(req) {
  const cookie = await cookies();
  const token = cookie.get("authToken")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Extract the dynamic path from the request
  const path = req.nextUrl.pathname.replace("/api/proxy", ""); // Remove `/api/proxy`
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": req.headers.get("content-type") || "application/json",
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
    });
  } catch (error) {
    console.error("Error in proxy route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
