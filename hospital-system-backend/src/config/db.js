import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hospital_management",
  password: "DMHAdmin",
  port: 5432,
});

export default pool;