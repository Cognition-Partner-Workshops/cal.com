import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM products WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
    const params: (string | number)[] = [];
    const countParams: (string | number)[] = [];

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      countQuery += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += " AND category = ?";
      countQuery += " AND category = ?";
      params.push(category);
      countParams.push(category);
    }

    if (minPrice) {
      query += " AND price >= ?";
      countQuery += " AND price >= ?";
      params.push(parseFloat(minPrice));
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += " AND price <= ?";
      countQuery += " AND price <= ?";
      params.push(parseFloat(maxPrice));
      countParams.push(parseFloat(maxPrice));
    }

    const validSortFields = ["price", "name", "rating", "created_at"];
    const validSortOrders = ["asc", "desc"];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const safeSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "desc";

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const products = db.prepare(query).all(...params);
    const { total } = db.prepare(countQuery).get(...countParams) as { total: number };

    const categories = db
      .prepare("SELECT DISTINCT category FROM products ORDER BY category")
      .all() as { category: string }[];

    return NextResponse.json({
      success: true,
      data: {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        categories: categories.map((c) => c.category),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
