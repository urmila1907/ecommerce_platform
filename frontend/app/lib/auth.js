import { cookies } from "next/headers";

export async function isAuthenticated() {
    const token = await cookies().get("authToken"); // Read token from cookies
    return !!token; // Return true if token exists
}
