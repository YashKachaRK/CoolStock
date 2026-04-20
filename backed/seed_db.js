const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Matches user's recent change
    database: "coolstock"
});

const seed = async () => {
    try {
        // 1. Seed Staff (Admin)
        const hashedPassword = await bcrypt.hash("2026", 10);
        const adminEmail = "admin2026@gmail.com";

        db.query("SELECT * FROM staff WHERE email = ?", [adminEmail], (err, result) => {
            if (result && result.length === 0) {
                db.query("INSERT INTO staff (name, email, password, role) VALUES (?, ?, ?, ?)",
                    ["Main Admin", adminEmail, hashedPassword, "Admin"], (err) => {
                        if (err) console.error("Error seeding admin:", err);
                        else console.log("Admin seeded successfully.");
                    });
            } else {
                console.log("Admin already exists.");
            }
        });

        // 2. Seed Products
        const products = [
            ["Chocolate Cone", 45.00, 150, 50],
            ["Vanilla Cup", 25.00, 200, 40],
            ["Mango Bar", 30.00, 120, 30],
            ["Strawberry Family Pack", 150.00, 40, 10]
        ];

        db.query("SELECT COUNT(*) as count FROM products", (err, result) => {
            if (result[0].count === 0) {
                db.query("INSERT INTO products (name, price, stock, lowThreshold) VALUES ?", [products], (err) => {
                    if (err) console.error("Error seeding products:", err);
                    else console.log("Sample products seeded.");
                });
            } else {
                console.log("Products already exist.");
            }
        });

        // 3. Seed Sample Customer
        db.query("SELECT COUNT(*) as count FROM customers", (err, result) => {
            if (result[0].count === 0) {
                db.query("INSERT INTO customers (name, shop, addr, phone, email) VALUES (?, ?, ?, ?, ?)",
                    ["Rajesh Patel", "Royal Ice Cream Parlor", "Main Bazaar, Anand", "9876543210", "rajesh@example.com"], (err) => {
                        if (err) console.error("Error seeding customer:", err);
                        else console.log("Sample customer seeded.");
                    });
            } else {
                console.log("Customers already exist.");
            }
        });

    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

seed();
