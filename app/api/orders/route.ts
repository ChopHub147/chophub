import { NextResponse } from "next/server";
import { supabaseAdminRequest } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";

type OrderRequest = {
  customerName?: unknown;
  customerPhone?: unknown;
  deliveryAddress?: unknown;
  deliveryArea?: unknown;
  subtotal?: unknown;
  items?: unknown;
};

const orderStatuses = ["new", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"] as const;

type OrderStatus = (typeof orderStatuses)[number];

export async function POST(request: Request) {
  const body = (await request.json()) as OrderRequest;
  const requiredText = [body.customerName, body.customerPhone, body.deliveryAddress, body.deliveryArea];

  if (
    requiredText.some((value) => typeof value !== "string" || value.trim() === "") ||
    typeof body.subtotal !== "number" ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json({ error: "Complete customer details and order items are required" }, { status: 400 });
  }

  const [order] = await supabaseAdminRequest<Array<{ id: number }>>("orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      customer_name: body.customerName,
      customer_phone: body.customerPhone,
      delivery_address: body.deliveryAddress,
      delivery_area: body.deliveryArea,
      subtotal: body.subtotal,
      status: "new",
    }),
  });

  await supabaseAdminRequest("order_items", {
    method: "POST",
    body: JSON.stringify(
      (body.items as Array<{ id: string; name: string; price: number; quantity: number }>).map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }))
    ),
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}

export async function GET() {
  const session = (await cookies()).get(adminCookieName)?.value;
  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await supabaseAdminRequest("orders?select=*&order=created_at.desc");
  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  const session = (await cookies()).get(adminCookieName)?.value;
  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: unknown; status?: unknown };
  const id = typeof body.id === "number" ? body.id : null;
  const status = typeof body.status === "string" ? body.status as OrderStatus : null;

  if (id === null || !status || !orderStatuses.includes(status)) {
    return NextResponse.json({ error: "A valid order id and status are required" }, { status: 400 });
  }

  const orders = await supabaseAdminRequest(`orders?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status }),
  });

  return NextResponse.json(orders);
}
