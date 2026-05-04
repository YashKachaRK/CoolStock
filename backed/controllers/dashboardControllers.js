const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Staff = require("../models/Staff");
const Product = require("../models/Product");

exports.getAdminStats = async (req, res) => {
    try {
        const [
            revenueResult,
            totalOrders,
            activeCustomers,
            totalStaff,
            lowStock,
            recentOrdersData
        ] = await Promise.all([
            Order.aggregate([
                { $match: { status: 'Paid' } },
                { $group: { _id: null, revenue: { $sum: "$amount" } } }
            ]),
            Order.countDocuments(),
            Customer.countDocuments({ status: 'Active' }),
            Staff.countDocuments(),
            Product.countDocuments({ stock: { $lt: 50 } }), // assuming 50 is the hardcoded threshold from original
            Order.find()
                .populate('customer_id', 'shop name')
                .sort({ date: -1, _id: -1 })
                .limit(5)
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].revenue : 0;
        
        // Format recent orders
        const recentOrders = recentOrdersData.map(order => {
            const o = order.toObject();
            return {
                ...o,
                id: o._id,
                shop: o.customer_id ? (o.customer_id.shop || o.customer_id.name) : 'Unknown'
            };
        });

        res.json({
            totalRevenue,
            totalOrders,
            activeCustomers,
            totalStaff,
            lowStock,
            recentOrders
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        if (!res.headersSent) {
            res.status(500).send("Error fetching dashboard stats");
        }
    }
};

exports.getManagerStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        // Format to match old output [{ status: 'Pending', count: 5 }]
        const formattedStats = stats.map(s => ({ status: s._id, count: s.count }));
        res.json(formattedStats);
    } catch (err) {
        res.status(500).send(err);
    }
};
