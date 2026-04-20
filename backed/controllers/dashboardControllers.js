const db = require("../config/db");

exports.getAdminStats = async (req, res) => {
    const queries = {
        totalRevenue: "SELECT SUM(amount) as revenue FROM orders WHERE status='Paid'",
        totalOrders: "SELECT COUNT(*) as count FROM orders",
        activeCustomers: "SELECT COUNT(*) as count FROM customers WHERE status='Active'",
        totalStaff: "SELECT COUNT(*) as count FROM staff",
        lowStock: "SELECT COUNT(*) as count FROM products WHERE stock < 50",
        recentOrders: "SELECT o.*, c.shop FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY date DESC LIMIT 5"
    };

    try {
        const stats = {};
        const keys = Object.keys(queries);

        // Wrap db.query in promises
        const promises = keys.map(key => {
            return new Promise((resolve, reject) => {
                db.query(queries[key], (err, result) => {
                    if (err) reject(err);
                    else resolve({ key, result });
                });
            });
        });

        const results = await Promise.all(promises);

        results.forEach(({ key, result }) => {
            if (key === 'recentOrders') {
                stats[key] = result;
            } else if (key === 'totalRevenue') {
                stats[key] = result[0].revenue || 0;
            } else {
                stats[key] = result[0].count || 0;
            }
        });

        res.json(stats);
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        if (!res.headersSent) {
            res.status(500).send("Error fetching dashboard stats");
        }
    }
};

exports.getManagerStats = (req, res) => {
    const sql = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};
