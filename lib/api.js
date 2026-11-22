import { authClient } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Server-er protected route call korar jonno.
// Success hole JSON dey, fail hole ApiError throw kore.
export async function apiFetch(
  path,
  { method = "GET", body, auth = true } = {}
) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  if (auth) {
    const { data } = await authClient.token();
    if (!data?.token) {
      throw new ApiError("Please sign in again", 401);
    }
    headers.Authorization = `Bearer ${data.token}`;
  }

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(json.message || "Something went wrong", res.status);
  }
  return json;
}