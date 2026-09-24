import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdminRequest } from "@/lib/supabase-admin";
import { readCustomerSession, customerCookieName } from "@/lib/customer-auth";

export async function GET() {
  const session = readCustomerSession((await cookies()).get(customerCookieName)?.value);

  if (!session) {
    return NextResponse.json({ error: "Please sign in to view your orders" }, { status: 401 });
  }

  try {
    const orders = await supabaseAdminRequest(
      `orders?select=*&customer_phone=eq.${encodeURIComponent(session.phone)}&order=created_at.desc`
    );
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetching customer orders failed", error);
    return NextResponse.json({ error: "Could not load order history" }, { status: 500 });
  }
}
