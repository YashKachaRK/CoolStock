const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Try empty first, then 'root' if it fails
  database: "coolstock"
};

const tables = ["products", "orders", "order_items", "staff", "customers", "applications"];

const dumpData = async (config) => {
  return new Promise((resolve, reject) => {
    const db = mysql.createConnection(config);
    db.connect(async (err) => {
      if (err) return reject(err);
      
      console.log("Connected to MySQL with password:", config.password || "(empty)");
      const dumpedData = {};
      
      for (const table of tables) {
        try {
          const rows = await new Promise((res, rej) => {
            db.query(`SELECT * FROM ${table}`, (err, results) => {
              if (err) return rej(err);
              res(results);
            });
          });
          dumpedData[table] = rows;
          console.log(`Table ${table} has ${rows.length} rows.`);
        } catch (e) {
          console.log(`Table ${table} might not exist or error:`, e.message);
        }
      }
      
      fs.writeFileSync(path.join(__dirname, "mysql_dump.json"), JSON.stringify(dumpedData, null, 2));
      console.log("Data dumped to mysql_dump.json");
      db.end();
      resolve(true);
    });
  });
};

(async () => {
  try {
    await dumpData(dbConfig);
  } catch (err) {
    console.log("Connection failed with empty password. Trying with 'root'...");
    dbConfig.password = "root";
    try {
      await dumpData(dbConfig);
    } catch (err2) {
      console.error("Failed to connect with 'root' password as well:", err2.message);
    }
  }
})();
