import { NextResponse } from "next/server";
import { supabaseAdminRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const section = new URL(request.url).searchParams.get("section");
  const path = section === "foodstuff" || section === "fresh-food"
    ? `products?select=*&section=eq.${section}&order=id.asc`
    : "products?select=*&order=id.asc";
  const products = await supabaseAdminRequest(path);

  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
