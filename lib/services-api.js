import { connection } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

// Server component theke services ane. Error hole crash na kore failed: true dey.
export async function fetchServices(params = {}) {
    await connection();
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.set(key, String(value));
  });

  try {
    const res = await fetch(`${API}/api/services?${qs.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch {
    return {
      services: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
      failed: true,
    };
  }
}
// Ekta service-er details ane. 404 hole { notFound: true }, onno error hole { failed: true }
export async function fetchServiceById(id) {
    await connection();
  try {
    const res = await fetch(`${API}/api/services/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (res.status === 404) return { notFound: true };
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch {
    return { failed: true };
  }
}
// Ekta service er review. Error hole khali list dey, page crash kore na.
export async function fetchServiceReviews(id) {
  await connection();
  try {
    const res = await fetch(
      `${API}/api/services/${encodeURIComponent(id)}/reviews`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch {
    return { average: 0, count: 0, reviews: [] };
  }
}