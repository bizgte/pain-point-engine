/**
 * Upload a URL or buffer to Cloudinary using unsigned preset.
 * Returns a permanent Cloudinary URL.
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
    return { url: sourceUrl, publicId: "", error: "CLOUDINARY_CLOUD_NAME not set — returning original URL" };
  }

  try {
    const formData = new FormData();
    formData.append("file", sourceUrl);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const text = await res.text();
      return { url: sourceUrl, publicId: "", error: `Cloudinary error: ${text}` };
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
  folder: string = "contengine/videos"
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? "alma_unsigned";

  if (!cloudName) {
    return { url: sourceUrl, publicId: "", error: "CLOUDINARY_CLOUD_NAME not set" };
  }

  try {
    const formData = new FormData();
    formData.append("file", sourceUrl);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
    formData.append("resource_type", "video");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const text = await res.text();
      return { url: sourceUrl, publicId: "", error: `Cloudinary video error: ${text}` };
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
