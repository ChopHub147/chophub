import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { supabaseAdminRequest } from "@/lib/supabase-admin";

type MealUpdate = {
  id?: unknown;
  available?: unknown;
};

async function requireAdmin() {
  const session = (await cookies()).get(adminCookieName)?.value;
  return isValidAdminSession(session);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const meals = await supabaseAdminRequest("meals?select=*&order=id.asc");
  return NextResponse.json(meals);
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as MealUpdate;
  const id = typeof body.id === "number" ? body.id : null;
  const available = typeof body.available === "boolean" ? body.available : null;

  if (id === null || available === null) {
    return NextResponse.json({ error: "A meal id and availability are required" }, { status: 400 });
  }

  const meals = await supabaseAdminRequest(`meals?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ available }),
  });

  return NextResponse.json(meals);
}
