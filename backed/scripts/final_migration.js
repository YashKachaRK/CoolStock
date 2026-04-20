const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coolstock"
});

const runMigrations = async () => {
    try {
        // 1. Update Products Table
        db.query(`ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS category ENUM('Cone', 'Cup', 'Shake', 'Pack', 'Bar') DEFAULT 'Cone',
            ADD COLUMN IF NOT EXISTS unit VARCHAR(100) DEFAULT 'Carton (24 pcs)'`, (err) => {
            if (err) console.error("Error updating products table:", err.message);
            else console.log("Products table updated with category and unit.");
        });

        // 2. Create Applications Table
        const createApplications = `
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(100),
                description TEXT,
                status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.query(createApplications, (err) => {
            if (err) console.error("Error creating applications table:", err.message);
            else console.log("Applications table verified/created.");

            // End process after queries
            setTimeout(() => {
                db.end();
                process.exit();
            }, 1000);
        });

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

runMigrations();
