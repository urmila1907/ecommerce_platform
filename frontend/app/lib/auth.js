import { cookies } from "next/headers";

export async function isAuthenticated() {
    const cookie = await cookies(); // Read token from cookies
    const token = cookie.get("authToken");
    return !!token; // Return true if token exists
}
