import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_URL || "./data/shop.db";
const dbPath = path.resolve(DB_PATH);

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    rating REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'mock_card',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`);

db.exec("DELETE FROM order_items");
db.exec("DELETE FROM orders");
db.exec("DELETE FROM cart_items");
db.exec("DELETE FROM products");
db.exec("DELETE FROM users");

const demoPassword = bcrypt.hashSync("password123", 10);
db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(
  "Demo User",
  "demo@shop.com",
  demoPassword
);

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life, comfortable over-ear design, and crystal-clear audio quality.",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 50,
    rating: 4.5,
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water resistant to 50m.",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 30,
    rating: 4.7,
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable organic cotton t-shirt available in multiple colors. Ethically sourced and sustainably produced.",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    stock: 100,
    rating: 4.3,
  },
  {
    name: "Running Shoes Pro",
    description: "Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.",
    price: 129.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 40,
    rating: 4.6,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-walled vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 750ml capacity.",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    stock: 80,
    rating: 4.4,
  },
  {
    name: "Leather Messenger Bag",
    description: "Handcrafted genuine leather messenger bag with padded laptop compartment, multiple pockets, and adjustable shoulder strap.",
    price: 89.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    stock: 25,
    rating: 4.8,
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handmade ceramic coffee mugs in earth tones. Microwave and dishwasher safe. 350ml capacity each.",
    price: 34.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
    stock: 60,
    rating: 4.2,
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek minimalist design with LED indicator.",
    price: 19.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500",
    stock: 70,
    rating: 4.1,
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra thick 6mm eco-friendly yoga mat with non-slip surface, alignment lines, and carrying strap included.",
    price: 49.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    stock: 45,
    rating: 4.5,
  },
  {
    name: "Sunglasses Classic",
    description: "UV400 polarized sunglasses with lightweight titanium frame. Scratch-resistant lenses and spring hinges for comfort.",
    price: 59.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    stock: 55,
    rating: 4.3,
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact waterproof Bluetooth speaker with 360-degree sound, 12-hour playtime, and built-in microphone for calls.",
    price: 44.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    stock: 35,
    rating: 4.4,
  },
  {
    name: "Denim Jacket Classic",
    description: "Timeless classic-fit denim jacket with button closure, chest pockets, and adjustable waist tabs. Vintage wash.",
    price: 69.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
    stock: 30,
    rating: 4.6,
  },
  {
    name: "Scented Candle Set",
    description: "Set of 3 luxury soy wax scented candles: lavender, vanilla, and sandalwood. 40-hour burn time each.",
    price: 27.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602607742457-0e114dab1b73?w=500",
    stock: 90,
    rating: 4.7,
  },
  {
    name: "Backpack Urban Explorer",
    description: "Durable 30L backpack with padded laptop sleeve, water-resistant fabric, USB charging port, and anti-theft zippers.",
    price: 74.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    stock: 40,
    rating: 4.5,
  },
  {
    name: "Cast Iron Skillet",
    description: "Pre-seasoned 12-inch cast iron skillet. Perfect for searing, baking, and frying. Oven safe up to 500F.",
    price: 39.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500",
    stock: 20,
    rating: 4.8,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with Cherry MX switches, aluminum frame, and programmable macro keys.",
    price: 109.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    stock: 25,
    rating: 4.6,
  },
];

const insertProduct = db.prepare(
  "INSERT INTO products (name, description, price, category, image, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

for (const p of products) {
  insertProduct.run(p.name, p.description, p.price, p.category, p.image, p.stock, p.rating);
}

console.log(`Seeded ${products.length} products and 1 demo user (demo@shop.com / password123)`);

db.close();
