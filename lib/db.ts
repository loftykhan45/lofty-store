import Database from "better-sqlite3";
import path from "path";

// Single SQLite file on disk — real persistent storage, no separate DB server
// needed on the VPS. This is the actual "backend" milestone: orders survive
// server restarts and are no longer just a browser localStorage fiction.
const dbPath = path.join(process.cwd(), "data", "lofty.db");

declare global {
  // eslint-disable-next-line no-var
  var __loftyDb: Database.Database | undefined;
}

function init(): Database.Database {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL,
      email TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_price INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      lines_json TEXT NOT NULL,
      placed_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
    );
  `);

  // Orders tables created before the admin portal won't have this column yet.
  const cols = db.prepare("PRAGMA table_info(orders)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "status")) {
    db.exec("ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'");
  }

  return db;
}

export function getDb(): Database.Database {
  if (!global.__loftyDb) {
    global.__loftyDb = init();
  }
  return global.__loftyDb;
}
