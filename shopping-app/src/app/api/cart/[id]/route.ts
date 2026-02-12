import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const db = getDb();
    const item = db
      .prepare(
        `SELECT ci.id, ci.product_id, p.stock
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.id = ? AND ci.user_id = ?`
      )
      .get(parseInt(id), payload.userId) as
      | { id: number; product_id: number; stock: number }
      | undefined;

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (quantity > item.stock) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(quantity, parseInt(id));

    return NextResponse.json({ success: true, data: { message: "Cart updated" } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const db = getDb();
  const result = db
    .prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?")
    .run(parseInt(id), payload.userId);

  if (result.changes === 0) {
    return NextResponse.json(
      { success: false, error: "Cart item not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { message: "Item removed" } });
}
