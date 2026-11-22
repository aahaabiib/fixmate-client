export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  let res;
  try {
    res = await fetch("/api/upload", { method: "POST", body: formData });
  } catch {
    throw new Error("Image upload failed. Check your internet connection.");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "Image upload failed");
  }
  return json.url;
}