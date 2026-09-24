import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdminRequest } from "@/lib/supabase-admin";
import { createCustomerSession, customerCookieName, hashPassword } from "@/lib/customer-auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: unknown; phone?: unknown; email?: unknown; password?: unknown };

  if (
    typeof body.name !== "string" || !body.name.trim() ||
    typeof body.phone !== "string" || !body.phone.trim() ||
    typeof body.password !== "string" || body.password.length < 6
  ) {
    return NextResponse.json({ error: "Name, phone, and a password of at least 6 characters are required" }, { status: 400 });
  }

  try {
    const [existing] = await supabaseAdminRequest<Array<{ id: number }>>(
      `customers?select=id&phone=eq.${encodeURIComponent(body.phone)}`
    );

    if (existing) {
      return NextResponse.json({ error: "An account with this phone number already exists" }, { status: 409 });
    }

    const [customer] = await supabaseAdminRequest<Array<{ id: number }>>("customers", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        name: body.name,
        phone: body.phone,
        email: typeof body.email === "string" ? body.email : null,
        password_hash: hashPassword(body.password),
      }),
    });

    if (typeof body.email === "string" && body.email.trim()) {
      void sendWelcomeEmail(body.email, body.name);
    }

    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(customerCookieName, createCustomerSession(customer.id, body.phone), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Customer signup failed", error);
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }
}

export async function GET() {
  const session = (await cookies()).get(customerCookieName)?.value;
  return NextResponse.json({ signedIn: Boolean(session) });
}
