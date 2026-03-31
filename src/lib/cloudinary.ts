/**
 * Upload a URL to Cloudinary using unsigned preset.
 * Returns a permanent Cloudinary URL.
 * Uses URLSearchParams (not FormData) for reliable server-side uploads.
 */

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  error?: string;
}

export async function uploadToCloudinary(
  sourceUrl: string,
  folder: string = "contengine"
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? "alma_unsigned";

  if (!cloudName) {
    return { url: sourceUrl, publicId: "", error: "CLOUDINARY_CLOUD_NAME not set" };
  }

  try {
    // Use URLSearchParams — works reliably in Next.js server-side / Node.js
    const params = new URLSearchParams({
      file: sourceUrl,
      upload_preset: uploadPreset,
    });

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return { url: sourceUrl, publicId: "", error: `Cloudinary ${res.status}: ${text.slice(0, 200)}` };
    }

    const data = await res.json();
    return {
      url: data.secure_url ?? sourceUrl,
      publicId: data.public_id ?? "",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { url: sourceUrl, publicId: "", error: msg };
  }
}

export async function uploadVideoToCloudinary(
  sourceUrl: string,
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? "alma_unsigned";

  if (!cloudName) {
    return { url: sourceUrl, publicId: "", error: "CLOUDINARY_CLOUD_NAME not set" };
  }

  try {
    const params = new URLSearchParams({
      file: sourceUrl,
      upload_preset: uploadPreset,
      resource_type: "video",
    });

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return { url: sourceUrl, publicId: "", error: `Cloudinary video ${res.status}: ${text.slice(0, 200)}` };
    }

    const data = await res.json();
    return {
      url: data.secure_url ?? sourceUrl,
      publicId: data.public_id ?? "",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { url: sourceUrl, publicId: "", error: msg };
  }
}
