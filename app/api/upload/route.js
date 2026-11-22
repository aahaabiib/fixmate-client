import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Please sign in first" }, { status: 401 });
  }

  const key = process.env.IMGBB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { message: "Image upload is not configured" },
      { status: 500 }
    );
  }

  let file;
  try {
    const formData = await request.formData();
    file = formData.get("image");
  } catch {
    return NextResponse.json({ message: "Invalid upload request" }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "Please choose an image" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Only JPG, PNG, WEBP or GIF images are allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "Image must be smaller than 5MB" },
      { status: 400 }
    );
  }

  try {
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body,
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json?.success) {
      return NextResponse.json(
        { message: "Image upload failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: json.data.url });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the image service" },
      { status: 502 }
    );
  }
}