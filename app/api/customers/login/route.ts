import { NextResponse } from "next/server";
import { supabaseAdminRequest } from "@/lib/supabase-admin";
import { createCustomerSession, customerCookieName, verifyPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: unknown; password?: unknown };

  if (typeof body.phone !== "string" || !body.phone.trim() || typeof body.password !== "string") {
    return NextResponse.json({ error: "Phone number and password are required" }, { status: 400 });
  }

  try {
    const [customer] = await supabaseAdminRequest<Array<{ id: number; password_hash: string }>>(
      `customers?select=id,password_hash&phone=eq.${encodeURIComponent(body.phone)}`
    );

    if (!customer || !verifyPassword(body.password, customer.password_hash)) {
      return NextResponse.json({ error: "Invalid phone number or password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(customerCookieName, createCustomerSession(customer.id, body.phone), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Customer login failed", error);
    return NextResponse.json({ error: "Could not sign in" }, { status: 500 });
  }
}
