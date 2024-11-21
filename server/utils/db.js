// Create PostgreSQL Connection Pool here !
import * as pg from "pg";

const { Pool } = pg.default;

const connectionPool = new Pool({
  // ตรงนี้ต้องเปลี่ยน connectionString เป็นของตัวเองด้วยนะ
  connectionString: "postgresql://postgres.kqksryqiitqqjuvhzmoe:ieFJOcjqKWcXoc3s@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
});

export default connectionPool;

