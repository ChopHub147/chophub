const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are not configured");
  }

  return { url, serviceRoleKey };
};

export async function supabaseAdminRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${details.slice(0, 300)}`);
  }

  return response.json() as Promise<T>;
}

export async function supabaseAdminStorageUpload(
  path: string,
  file: File
): Promise<void> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(
    `${url}/storage/v1/object/product-images/${path}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: file,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase storage upload failed with status ${response.status}`);
  }
}
