import { NextResponse } from "next/server";
import { supabaseAdminRequest } from "@/lib/supabase-admin";

export async function GET() {
  const meals = await supabaseAdminRequest(
    "meals?select=id,name,description,price,image,category&available=eq.true&order=id.asc"
  );

  return NextResponse.json(meals);
}
