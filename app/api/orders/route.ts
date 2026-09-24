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

const orderStatuses = [
  "new",
  "vendor_confirmation",
  "vendors_confirmed",
  "rider_assigned",
  "pickup_in_progress",
  "items_collected",
  "out_for_delivery",
  "delivered",
  "exception",
  "cancelled",
] as const;

type OrderStatus = (typeof orderStatuses)[number];

export async function POST(request: Request) {
  let body: OrderRequest;

  try {
    body = (await request.json()) as OrderRequest;
  } catch {
    return NextResponse.json(
      { error: "A valid JSON order is required" },
      { status: 400 }
    );
  }

  const requiredText = [
    body.customerName,
    body.customerPhone,
    body.deliveryAddress,
    body.deliveryArea,
  ];

  if (
    requiredText.some(
      (value) => typeof value !== "string" || value.trim() === ""
    ) ||
    typeof body.subtotal !== "number" ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json(
      { error: "Complete customer details and order items are required" },
      { status: 400 }
    );
  }

  try {
    const [order] = await supabaseAdminRequest<Array<{ id: number }>>(
      "orders",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          customer_name: body.customerName,
          customer_phone: body.customerPhone,
          delivery_address: body.deliveryAddress,
          delivery_area: body.deliveryArea,
          food_subtotal: body.subtotal,
          subtotal: body.subtotal,
          status: "new",
          delivery_status: "pending",
        }),
      }
    );

    await supabaseAdminRequest("order_items", {
      method: "POST",
      body: JSON.stringify(
        (
          body.items as Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
          }>
        ).map((item) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          meal_name: item.name,
          unit_price: item.price,
          price: item.price,
          quantity: item.quantity,
        }))
      ),
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Order save failed", error);

    return NextResponse.json(
      { error: "The order could not be saved" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = (await cookies()).get(adminCookieName)?.value;

  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders =
    await supabaseAdminRequest<Array<Record<string, unknown>>>(
      "orders?select=*&order=created_at.desc"
    );

  try {
    const events =
      await supabaseAdminRequest<Array<Record<string, unknown>>>(
        "order_events?select=*&order=created_at.desc"
      );

    return NextResponse.json(
      orders.map((order) => ({
        ...order,
        events: events.filter((event) => event.order_id === order.id),
      }))
    );
  } catch {
    return NextResponse.json(orders);
  }
}

export async function PATCH(request: Request) {
  const session = (await cookies()).get(adminCookieName)?.value;

  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: unknown;
    status?: unknown;
    riderId?: unknown;
    riderName?: unknown;
    riderPhone?: unknown;
    attentionReason?: unknown;
    eventType?: unknown;
    note?: unknown;
  };

  const id = typeof body.id === "number" ? body.id : null;

  const status =
    typeof body.status === "string"
      ? (body.status as OrderStatus)
      : null;

  if (
    id === null ||
    (status !== null && !orderStatuses.includes(status))
  ) {
    return NextResponse.json(
      { error: "A valid order id and operation are required" },
      { status: 400 }
    );
  }

  /*
   * ---------------------------------------------------------
   * RIDER ASSIGNMENT
   * ---------------------------------------------------------
   *
   * We only run this section when riderId was actually
   * included in the request.
   *
   * riderId: number = assign rider
   * riderId: null   = unassign rider
   */

  const hasRiderId = Object.prototype.hasOwnProperty.call(
    body,
    "riderId"
  );

  let riderAssignmentEvent:
    | {
        order_id: number;
        event_type: string;
        note: string;
      }
    | null = null;

  let riderUpdates: Record<string, unknown> = {};

  if (hasRiderId) {
    /*
     * Get the current order so we know whether another
     * rider is already assigned.
     */
    const currentOrders =
      await supabaseAdminRequest<Array<Record<string, unknown>>>(
        `orders?id=eq.${id}&select=id,rider_id,rider_name,rider_phone`
      );

    const currentOrder = currentOrders[0];

    if (!currentOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const previousRiderId =
      typeof currentOrder.rider_id === "number"
        ? currentOrder.rider_id
        : null;

    /*
     * Determine whether the new value is:
     * - null = remove rider
     * - number = assign rider
     */
    const newRiderId =
      body.riderId === null
        ? null
        : typeof body.riderId === "number"
          ? body.riderId
          : null;

    /*
     * -------------------------------------------------------
     * UNASSIGN RIDER
     * -------------------------------------------------------
     */
    if (newRiderId === null) {
      if (previousRiderId !== null) {
        await supabaseAdminRequest(
          `riders?id=eq.${previousRiderId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              availability: "available",
            }),
          }
        );

        riderAssignmentEvent = {
          order_id: id,
          event_type: "rider_unassigned",
          note: "Rider was removed from this order.",
        };
      }

      riderUpdates = {
        rider_id: null,
        rider_name: "",
        rider_phone: "",
      };
    } else {
      /*
       * -------------------------------------------------------
       * GET NEW RIDER
       * -------------------------------------------------------
       */
      const riders =
        await supabaseAdminRequest<
          Array<{
            id: number;
            name: string;
            phone: string;
            availability: "available" | "busy" | "offline";
          }>
        >(
          `riders?id=eq.${newRiderId}&select=id,name,phone,availability`
        );

      const newRider = riders[0];

      if (!newRider) {
        return NextResponse.json(
          { error: "Rider not found" },
          { status: 404 }
        );
      }

      /*
       * Don't allow an unavailable rider to be assigned
       * unless that rider is already assigned to this order.
       */
      if (
        newRider.availability !== "available" &&
        newRider.id !== previousRiderId
      ) {
        return NextResponse.json(
          {
            error: `Rider ${newRider.name} is currently ${newRider.availability}.`,
          },
          { status: 409 }
        );
      }

      /*
       * -------------------------------------------------------
       * FREE OLD RIDER
       * -------------------------------------------------------
       */
      if (
        previousRiderId !== null &&
        previousRiderId !== newRider.id
      ) {
        await supabaseAdminRequest(
          `riders?id=eq.${previousRiderId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              availability: "available",
            }),
          }
        );
      }

      /*
       * -------------------------------------------------------
       * MARK NEW RIDER BUSY
       * -------------------------------------------------------
       */
      await supabaseAdminRequest(
        `riders?id=eq.${newRider.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            availability: "busy",
          }),
        }
      );

      /*
       * -------------------------------------------------------
       * SAVE RIDER ON ORDER
       * -------------------------------------------------------
       *
       * Name and phone are copied onto the order as well.
       * rider_id remains the main relationship.
       */
      riderUpdates = {
        rider_id: newRider.id,
        rider_name: newRider.name,
        rider_phone: newRider.phone,
      };

      /*
       * Automatically move the order into rider_assigned
       * when a rider is assigned, unless the admin explicitly
       * supplied another status.
       */
      if (status === null) {
        riderUpdates.status = "rider_assigned";
      }

      if (previousRiderId !== newRider.id) {
        riderAssignmentEvent = {
          order_id: id,
          event_type: "rider_assigned",
          note: `${newRider.name} (${newRider.phone}) was assigned to this order.`,
        };
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * NORMAL ORDER UPDATES
   * ---------------------------------------------------------
   */

  const updates = {
    ...riderUpdates,

    ...(status ? { status } : {}),

    /*
     * These are retained for compatibility with your
     * existing admin dashboard.
     *
     * When riderId is supplied, the values from the actual
     * rider record above take priority.
     */
    ...(!hasRiderId &&
    typeof body.riderName === "string"
      ? { rider_name: body.riderName.trim() }
      : {}),

    ...(!hasRiderId &&
    typeof body.riderPhone === "string"
      ? { rider_phone: body.riderPhone.trim() }
      : {}),

    ...(typeof body.attentionReason === "string"
      ? { attention_reason: body.attentionReason.trim() }
      : {}),
  };

  if (
    Object.keys(updates).length === 0 &&
    typeof body.eventType !== "string" &&
    riderAssignmentEvent === null
  ) {
    return NextResponse.json(
      { error: "Choose a status or log an operation" },
      { status: 400 }
    );
  }

  /*
   * ---------------------------------------------------------
   * SAVE ORDER
   * ---------------------------------------------------------
   */

  const orders =
    Object.keys(updates).length > 0
      ? await supabaseAdminRequest<Array<Record<string, unknown>>>(
          `orders?id=eq.${id}`,
          {
            method: "PATCH",
            headers: {
              Prefer: "return=representation",
            },
            body: JSON.stringify(updates),
          }
        )
      : [];

  /*
   * ---------------------------------------------------------
   * SAVE MANUAL EVENT
   * ---------------------------------------------------------
   */

  let event;

  if (typeof body.eventType === "string") {
    [event] =
      await supabaseAdminRequest<Array<Record<string, unknown>>>(
        "order_events",
        {
          method: "POST",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            order_id: id,
            event_type: body.eventType,
            note:
              typeof body.note === "string"
                ? body.note.trim()
                : "",
          }),
        }
      );
  }

  /*
   * ---------------------------------------------------------
   * SAVE AUTOMATIC RIDER EVENT
   * ---------------------------------------------------------
   */

  let assignmentEvent;

  if (riderAssignmentEvent) {
    [assignmentEvent] =
      await supabaseAdminRequest<Array<Record<string, unknown>>>(
        "order_events",
        {
          method: "POST",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify(riderAssignmentEvent),
        }
      );
  }

  return NextResponse.json({
    order: orders[0],
    event,
    assignmentEvent,
  });
}