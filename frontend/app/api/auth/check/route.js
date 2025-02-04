import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return Response.json({ isUser: false });
  }

  return Response.json({ isUser: true });
}
