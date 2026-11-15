import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var globalArchMysqlPool: mysql.Pool | undefined;
}

let dbHost = process.env.MYSQL_HOST || process.env.DB_HOST || "localhost";
let dbPort = parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || "3306", 10);
let dbUser = process.env.MYSQL_USER || process.env.DB_USER || "root";
let dbPassword = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "";
let dbDatabase = process.env.MYSQL_DATABASE || process.env.DB_NAME || "arch_tech";

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysql://")) {
  try {
    const parsed = new URL(process.env.DATABASE_URL);
    dbHost = parsed.hostname || dbHost;
    dbPort = parsed.port ? parseInt(parsed.port, 10) : dbPort;
    dbUser = decodeURIComponent(parsed.username || dbUser);
    dbPassword = decodeURIComponent(parsed.password || dbPassword);
    dbDatabase = decodeURIComponent(parsed.pathname.replace(/^\//, "")) || dbDatabase;
  } catch (err) {
    console.warn("Failed to parse DATABASE_URL, using individual env vars:", err);
  }
}

export const pool: mysql.Pool =
  global.globalArchMysqlPool ||
  mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 800,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") {
  global.globalArchMysqlPool = pool;
}

let isMysqlOnline = false;
let lastCheckTime = 0;
let connectionCheckPromise: Promise<boolean> | null = null;
const CHECK_INTERVAL_MS = 120000; // 2 minutes cooldown when offline to prevent any hangs

export async function checkMysqlConnection(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL_MS) {
    return isMysqlOnline;
  }
  if (connectionCheckPromise) {
    return connectionCheckPromise;
  }
  connectionCheckPromise = (async () => {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      isMysqlOnline = true;
      lastCheckTime = Date.now();
      return true;
    } catch {
      isMysqlOnline = false;
      lastCheckTime = Date.now();
      return false;
    } finally {
      connectionCheckPromise = null;
    }
  })();
  return connectionCheckPromise;
}

export function isMysqlAvailable(): boolean {
  if (Date.now() - lastCheckTime < CHECK_INTERVAL_MS) {
    return isMysqlOnline;
  }
  return true;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const online = await checkMysqlConnection();
  if (!online) {
    throw new Error("MySQL offline");
  }
  try {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  } catch (err: any) {
    isMysqlOnline = false;
    lastCheckTime = Date.now();
    throw err;
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  const online = await checkMysqlConnection();
  if (!online) {
    throw new Error("MySQL offline");
  }
  try {
    const [result] = await pool.execute(sql, params);
    return result as mysql.ResultSetHeader;
  } catch (err: any) {
    isMysqlOnline = false;
    lastCheckTime = Date.now();
    throw err;
  }
}
