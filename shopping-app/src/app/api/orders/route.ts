import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = getDb();
  const orders = db
    .prepare(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`
    )
    .all(payload.userId);

  const ordersWithItems = (orders as Array<{ id: number }>).map((order) => {
    const items = db
      .prepare(
        `SELECT oi.*, p.name, p.image, p.category
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`
      )
      .all(order.id);
    return { ...order, items };
  });

  return NextResponse.json({ success: true, data: ordersWithItems });
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { shippingAddress, paymentMethod = "mock_card" } = await req.json();

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Shipping address is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const cartItems = db
      .prepare(
        `SELECT ci.id, ci.quantity, ci.product_id, p.price, p.stock, p.name
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?`
      )
      .all(payload.userId) as Array<{
      id: number;
      quantity: number;
      product_id: number;
      price: number;
      stock: number;
      name: string;
    }>;

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${item.name}`,
          },
          { status: 400 }
        );
      }
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const createOrder = db.transaction(() => {
      const orderResult = db
        .prepare(
          "INSERT INTO orders (user_id, total, status, shipping_address, payment_method) VALUES (?, ?, 'confirmed', ?, ?)"
        )
        .run(payload.userId, Math.round(total * 100) / 100, shippingAddress, paymentMethod);

      const orderId = orderResult.lastInsertRowid;

      const insertItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
      );

      const updateStock = db.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ?"
      );

      for (const item of cartItems) {
        insertItem.run(orderId, item.product_id, item.quantity, item.price);
        updateStock.run(item.quantity, item.product_id);
      }

      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(payload.userId);

      return orderId;
    });

    const orderId = createOrder();

    return NextResponse.json({
      success: true,
      data: { orderId, total: Math.round(total * 100) / 100 },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
