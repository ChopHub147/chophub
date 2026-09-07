import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { supabaseAdminStorageUpload } from "@/lib/supabase-admin";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = (await cookies()).get(adminCookieName)?.value;
  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const productId = formData.get("productId");

  if (!(file instanceof File) || !allowedImageTypes.has(file.type)) {
    return NextResponse.json({ error: "Choose a JPG, PNG, WebP, or GIF image." }, { status: 400 });
  }
  if (file.size > maxImageSize) {
    return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 400 });
  }
  if (typeof productId !== "string" || !/^[a-zA-Z0-9_-]+$/.test(productId)) {
    return NextResponse.json({ error: "A valid product ID is required." }, { status: 400 });
  }

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${productId}.${extension}`;
  await supabaseAdminStorageUpload(path, file);

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
  return NextResponse.json({ url });
}
