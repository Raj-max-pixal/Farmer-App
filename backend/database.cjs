const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'agridirect.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database file:', DB_PATH);
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON;');

// Helper wrappers
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

const crypto = require('crypto');

function hashPassword(password) {
  const salt = 'agridirect_sih_2026_salt';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password, storedHash) {
  return hashPassword(password) === storedHash;
}

function generateAuthToken(user) {
  const payload = `${user.id}:${user.role}:${Date.now()}`;
  return crypto.createHmac('sha256', 'agridirect_secret_key').update(payload).digest('hex');
}

async function initDatabaseSchema() {
  console.log('⚙️ Initializing SQLite database schema (22+ tables)...');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      role TEXT CHECK(role IN ('FARMER', 'BUYER', 'ADMIN')),
      password_hash TEXT,
      token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try { await dbRun(`ALTER TABLE users ADD COLUMN uuid TEXT;`); } catch (e) {}
  try { await dbRun(`ALTER TABLE users ADD COLUMN token TEXT;`); } catch (e) {}
  try { await dbRun(`ALTER TABLE users ADD COLUMN avatar_url TEXT;`); } catch (e) {}
  try { await dbRun(`ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'light';`); } catch (e) {}

  await dbRun(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      listing_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, listing_id)
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS agriguide_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_query TEXT,
      bot_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS farmer_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      farmer_code TEXT UNIQUE,
      farm_name TEXT,
      village TEXT,
      district TEXT,
      state TEXT,
      farm_size_acres REAL,
      main_crops TEXT,
      aadhaar_status TEXT DEFAULT 'VERIFIED',
      rating REAL DEFAULT 4.8,
      orders_count INTEGER DEFAULT 32,
      total_earnings REAL DEFAULT 48260.0,
      social_links_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS buyer_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      company_name TEXT,
      buyer_type TEXT,
      location TEXT,
      avatar TEXT,
      match_reliability_score REAL DEFAULT 98.0,
      social_links_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      farm_name TEXT,
      location_lat_lng TEXT,
      address TEXT,
      size_acres REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS produce_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      farmer_name TEXT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      grade TEXT,
      quantity REAL NOT NULL,
      available_qty REAL NOT NULL,
      price REAL NOT NULL,
      mandi_benchmark_price REAL,
      location TEXT,
      distance TEXT,
      rating REAL DEFAULT 4.8,
      buyers_count INTEGER DEFAULT 2,
      image TEXT,
      status TEXT DEFAULT 'Active',
      organic BOOLEAN DEFAULT 1,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS buyer_requirements (
      id TEXT PRIMARY KEY,
      buyer_name TEXT NOT NULL,
      crop TEXT NOT NULL,
      quantity REAL NOT NULL,
      grade TEXT,
      max_price REAL NOT NULL,
      required_by TEXT,
      location TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requirement_id TEXT,
      buyer_name TEXT,
      farmer_name TEXT,
      listing_id INTEGER,
      crop TEXT,
      offered_price REAL,
      quantity REAL,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS offer_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      offer_id INTEGER,
      sender_role TEXT,
      sender_name TEXT,
      message TEXT,
      price REAL,
      quantity REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      buyer_name TEXT,
      farmer_name TEXT,
      product_id INTEGER,
      product_name TEXT,
      quantity REAL,
      unit_price REAL,
      logistics_fee REAL DEFAULT 3.0,
      platform_fee REAL DEFAULT 1.0,
      ops_fee REAL DEFAULT 1.0,
      total_buyer_price REAL,
      total_amount REAL,
      escrow_state TEXT DEFAULT 'HELD',
      delivery_stage TEXT DEFAULT 'PROCESSING',
      tracking_number TEXT,
      logistics_partner TEXT DEFAULT 'Ravi Agro Logistics',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      listing_id INTEGER,
      farmer_name TEXT,
      quantity REAL,
      unit_price REAL,
      subtotal REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      buyer_name TEXT,
      farmer_name TEXT,
      amount REAL,
      payment_method TEXT,
      escrow_status TEXT DEFAULT 'HELD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      released_at DATETIME
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS deliveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      driver_name TEXT,
      vehicle_no TEXT,
      pickup_route_json TEXT,
      total_distance_km REAL,
      distance_saved_km REAL,
      delivery_status TEXT DEFAULT 'IN_TRANSIT',
      eta_minutes INTEGER DEFAULT 45,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS delivery_stops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      delivery_id INTEGER,
      farm_id INTEGER,
      farmer_name TEXT,
      stop_sequence INTEGER,
      pickup_qty_kg REAL,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      vehicle_number TEXT,
      rating REAL DEFAULT 4.9,
      status TEXT DEFAULT 'AVAILABLE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER,
      vehicle_type TEXT,
      capacity_kg REAL,
      registration_no TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS market_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      market_name TEXT,
      crop TEXT,
      price_per_kg REAL,
      min_price REAL,
      max_price REAL,
      modal_price REAL,
      distance TEXT,
      trend TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop TEXT,
      market_name TEXT,
      date TEXT,
      price_per_kg REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS demand_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop TEXT,
      region TEXT,
      demand_level TEXT,
      demand_percentage_change REAL,
      recommendation_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      reviewer_role TEXT,
      reviewer_name TEXT,
      reviewee_name TEXT,
      rating REAL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_role TEXT,
      user_name TEXT,
      title TEXT,
      message TEXT,
      read_status INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS verification_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      document_type TEXT,
      document_url TEXT,
      status TEXT DEFAULT 'VERIFIED',
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      verified_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS disputes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      reporter_name TEXT,
      issue_type TEXT,
      description TEXT,
      status TEXT DEFAULT 'OPEN',
      resolution TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Schema initialization complete.');
  await seedDatabaseIfEmpty();
}

async function seedDatabaseIfEmpty() {
  const existingListings = await dbAll('SELECT COUNT(*) as cnt FROM produce_listings');
  if (existingListings[0].cnt > 0) {
    console.log(`🌱 Database already seeded (${existingListings[0].cnt} produce listings existing).`);
    return;
  }

  console.log('🌱 Seeding database with realistic Tamil Nadu agricultural data...');

  // Seed Users
  await dbRun(`INSERT INTO users (name, email, phone, role) VALUES 
    ('R. Selvam', 'selvam@agridirect.in', '+91 98421 10001', 'FARMER'),
    ('Kumar Farms', 'kumar@agridirect.in', '+91 98421 10002', 'FARMER'),
    ('Green Valley Farm', 'greenvalley@agridirect.in', '+91 98421 10003', 'FARMER'),
    ('Murugan Agro', 'murugan@agridirect.in', '+91 98421 10004', 'FARMER'),
    ('Lakshmi Farms', 'lakshmi@agridirect.in', '+91 98421 10005', 'FARMER'),
    ('FreshMart Supermarket', 'procurement@freshmart.in', '+91 98421 20001', 'BUYER'),
    ('GreenLeaf Restaurant', 'procurement@greenleaf.in', '+91 98421 20002', 'BUYER'),
    ('Daily Basket Stores', 'purchasing@dailybasket.in', '+91 98421 20003', 'BUYER'),
    ('AgriDirect Operations Admin', 'admin@agridirect.in', '+91 98421 90000', 'ADMIN');
  `);

  // Seed Farmer Profiles
  await dbRun(`INSERT INTO farmer_profiles (user_id, farmer_code, farm_name, village, district, state, farm_size_acres, main_crops, social_links_json) VALUES
    (1, 'F-101', 'Selvam Agro Haven', 'Thovalai', 'Kanyakumari', 'Tamil Nadu', 4.5, 'Tomato, Banana, Milk', '{"instagram":"@selvam_farms","whatsapp":"9842110001"}'),
    (2, 'F-102', 'Kumar Highland Produce', 'Vadasery', 'Nagercoil', 'Tamil Nadu', 6.0, 'Carrot, Potato, Beans', '{"facebook":"kumarfarms"}'),
    (3, 'F-103', 'Green Valley Organic', 'Thiruvattar', 'Kanyakumari', 'Tamil Nadu', 8.2, 'Brinjal, Ladies Finger, Coconut', '{}'),
    (4, 'F-104', 'Murugan Agro Fields', 'Melapalayam', 'Tirunelveli', 'Tamil Nadu', 5.0, 'Beans, Rice, Onion', '{}'),
    (5, 'F-105', 'Lakshmi Coastal Orchards', 'Agasteeswaram', 'Kanyakumari', 'Tamil Nadu', 7.5, 'Banana, Mango, Coconut', '{}');
  `);

  // Seed Produce Listings (Extended Catalog: 12+ items)
  const seedListings = [
    [1, 'R. Selvam', 'Tomato', 'Vegetables', 'Grade A', 500, 500, 31, 28, 'Kanyakumari, TN', '6 km', 4.8, 4, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Fresh organic tomatoes harvested this morning in Kanyakumari. Zero chemical pesticides.'],
    [2, 'Kumar Farms', 'Carrot', 'Vegetables', 'Grade A', 800, 800, 29, 26, 'Nagercoil, TN', '12 km', 4.7, 2, 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Crisp crunchy carrots from Nagercoil highlands.'],
    [3, 'Green Valley Farm', 'Brinjal', 'Vegetables', 'Grade B', 700, 700, 20, 18, 'Thiruvattar, TN', '15 km', 4.5, 1, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=85', 'Active', 0, 'Fresh purple brinjal directly from farm.'],
    [4, 'Murugan Agro', 'Beans', 'Vegetables', 'Grade A', 450, 450, 34, 30, 'Tirunelveli, TN', '22 km', 4.9, 3, 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Green string beans, tender and handpicked.'],
    [5, 'Lakshmi Farms', 'Banana', 'Fruits', 'Grade A', 600, 600, 25, 22, 'Kanyakumari, TN', '10 km', 4.8, 5, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Sweet Nendran bananas directly from coastal orchards.'],
    [1, 'R. Selvam', 'Onion', 'Vegetables', 'Grade A', 1200, 1200, 26, 24, 'Kanyakumari, TN', '6 km', 4.8, 6, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Premium Red Shallots & Small Onions harvested fresh.'],
    [2, 'Kumar Farms', 'Potato', 'Vegetables', 'Grade A', 1500, 1500, 22, 20, 'Nagercoil, TN', '14 km', 4.6, 3, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85', 'Active', 0, 'Farm-fresh golden potatoes, clean and graded.'],
    [3, 'Green Valley Farm', 'Ladies Finger', 'Vegetables', 'Grade A', 650, 650, 28, 25, 'Thiruvattar, TN', '16 km', 4.7, 4, 'https://images.unsplash.com/photo-1628773822503-930a8586c0c2?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Tender green Okra / Ladies finger.'],
    [4, 'Murugan Agro', 'Ponni Rice', 'Grains', 'Grade A+', 2000, 2000, 52, 48, 'Tirunelveli, TN', '25 km', 4.9, 8, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Aged organic Ponni raw rice direct from Tirunelveli paddy fields.'],
    [5, 'Lakshmi Farms', 'Tender Coconut', 'Fruits', 'Grade A', 900, 900, 35, 30, 'Kanyakumari, TN', '8 km', 4.9, 7, 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Naturally sweet fresh green tender coconut.'],
    [1, 'R. Selvam', 'Farm Milk', 'Dairy', 'Grade A+', 300, 300, 44, 40, 'Kanyakumari, TN', '5 km', 5.0, 9, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Pure unadulterated Gir cow milk from free-range dairy.'],
    [2, 'Kumar Farms', 'Alphonso Mango', 'Fruits', 'Grade A+', 500, 500, 85, 75, 'Nagercoil, TN', '18 km', 4.9, 12, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=85', 'Active', 1, 'Naturally ripened Alphonso mangoes, rich aroma.']
  ];

  for (const item of seedListings) {
    await dbRun(`INSERT INTO produce_listings 
      (farmer_id, farmer_name, name, category, grade, quantity, available_qty, price, mandi_benchmark_price, location, distance, rating, buyers_count, image, status, organic, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, item);
  }

  // Seed Requirements
  await dbRun(`INSERT INTO buyer_requirements (id, buyer_name, crop, quantity, grade, max_price, required_by, location, status) VALUES
    ('REQ-101', 'FreshMart Supermarket', 'Tomato', 2000, 'Grade A', 32, '2026-09-15', 'Kanyakumari, TN', 'Active'),
    ('REQ-102', 'GreenLeaf Restaurant', 'Onion', 1500, 'Grade A', 28, '2026-09-16', 'Nagercoil, TN', 'Active');
  `);

  // Seed Mandi Prices
  await dbRun(`INSERT INTO market_prices (market_name, crop, price_per_kg, min_price, max_price, modal_price, distance, trend) VALUES
    ('Nagercoil Mandi', 'Tomato', 28.0, 26.0, 30.0, 28.0, '12 km', '+8%'),
    ('Thiruvattar Mandi', 'Tomato', 27.0, 25.0, 29.0, 27.0, '15 km', '+5%'),
    ('Kanyakumari Mandi', 'Tomato', 28.0, 27.0, 30.0, 28.0, '6 km', '+8%'),
    ('Madurai Mandi', 'Tomato', 31.0, 29.0, 33.0, 31.0, '120 km', '+12%'),
    ('Nagercoil Mandi', 'Onion', 24.0, 22.0, 26.0, 24.0, '12 km', '+4%'),
    ('Tirunelveli Mandi', 'Ponni Rice', 48.0, 45.0, 50.0, 48.0, '25 km', '+3%');
  `);

  // Seed Initial Order
  await dbRun(`INSERT INTO orders (id, buyer_name, farmer_name, product_id, product_name, quantity, unit_price, logistics_fee, platform_fee, ops_fee, total_buyer_price, total_amount, escrow_state, delivery_stage, tracking_number, logistics_partner) VALUES
    ('ORD-89421', 'FreshMart Supermarket', 'R. Selvam', 1, 'Tomato', 500, 31, 3.0, 1.0, 1.0, 36, 18000, 'HELD', 'ON_THE_WAY', 'FL-321456', 'Ravi Agro Logistics');
  `);

  await dbRun(`INSERT INTO order_items (order_id, listing_id, farmer_name, quantity, unit_price, subtotal) VALUES
    ('ORD-89421', 1, 'R. Selvam', 500, 31, 15500);
  `);

  await dbRun(`INSERT INTO payments (order_id, buyer_name, farmer_name, amount, payment_method, escrow_status) VALUES
    ('ORD-89421', 'FreshMart Supermarket', 'R. Selvam', 18000, 'UPI Escrow Direct', 'HELD');
  `);

  console.log('✅ Database successfully seeded with Tamil Nadu produce catalog!');
}

module.exports = {
  dbRun,
  dbGet,
  dbAll,
  initDatabaseSchema,
  hashPassword,
  verifyPassword,
  generateAuthToken
};
