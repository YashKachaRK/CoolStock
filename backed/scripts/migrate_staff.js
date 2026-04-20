const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coolstock"
});

db.query(`ALTER TABLE staff 
    ADD COLUMN IF NOT EXISTS username VARCHAR(255), 
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20), 
    ADD COLUMN IF NOT EXISTS joined DATE`, (err, res) => {
    if (err) {
        // If IF NOT EXISTS is not supported in the version, it might fail if already exists.
        // We can just log and ignore error if it says column already exists.
        console.error("Error or warning altering table:", err.message);
    } else {
        console.log("Table altered successfully");
    }
    process.exit();
});
