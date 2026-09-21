
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const bucket = "Sales-Platform_product-images";

export const uploadProductImage = async (file) => {

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase Storage is not configured in the frontend environment."
    );
  }

  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5 MB.");
  }

  const safeName = file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "-"
  );

  const filePath =
    `products/${crypto.randomUUID()}-${safeName}`;

  const projectUrl = supabaseUrl.replace(/\/$/, "");

  const uploadUrl =
    `${projectUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${filePath}`;

  const response = await fetch(uploadUrl, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
      "Content-Type": file.type,
      "x-upsert": "false"
    },

    body: file
  });

  if (!response.ok) {

    const message = await response.text();

    let details = message;

    try {
      const payload = JSON.parse(message);

      details =
        payload.message ||
        payload.error ||
        message;

    } catch {
      // Keep original response
    }

    throw new Error(
      details || "Supabase image upload failed."
    );
  }

  return (
    `${projectUrl}/storage/v1/object/public/` +
    `${encodeURIComponent(bucket)}/${filePath}`
  );
};
