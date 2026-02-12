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
  const items = db
    .prepare(
      `SELECT ci.id, ci.quantity, ci.product_id, ci.created_at,
              p.name, p.price, p.image, p.stock, p.category
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`
    )
    .all(payload.userId);

  return NextResponse.json({ success: true, data: items });
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
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const product = db.prepare("SELECT id, stock FROM products WHERE id = ?").get(productId) as
      | { id: number; stock: number }
      | undefined;

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    const existing = db
      .prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?")
      .get(payload.userId, productId) as { id: number; quantity: number } | undefined;

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return NextResponse.json(
          { success: false, error: "Insufficient stock" },
          { status: 400 }
        );
      }
      db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(newQty, existing.id);
    } else {
      db.prepare(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)"
      ).run(payload.userId, productId, quantity);
    }

    return NextResponse.json({ success: true, data: { message: "Added to cart" } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = getDb();
  db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(payload.userId);

  return NextResponse.json({ success: true, data: { message: "Cart cleared" } });
}
