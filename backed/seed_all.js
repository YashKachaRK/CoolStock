const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Staff = require("./models/Staff");
const Customer = require("./models/Customer");
const Product = require("./models/Product");
const ProductBatch = require("./models/ProductBatch");
const Order = require("./models/Order");
const OrderHistory = require("./models/OrderHistory");
const Application = require("./models/Application");

mongoose.connect("mongodb://localhost:27017/coolstock").then(async () => {
  console.log("✅ Connected to MongoDB");

  await Staff.deleteMany({});
  await Customer.deleteMany({});
  await Product.deleteMany({});
  await ProductBatch.deleteMany({});
  await Order.deleteMany({});
  await OrderHistory.deleteMany({});
  await Application.deleteMany({});
  console.log("🗑️  Cleared all collections\n");

  const hash = (pw) => bcrypt.hash(pw, 10);

  // ─── 1. STAFF ─────────────────────────────────────────────────────
  const staffData = [
    { name: "Super Admin",   email: "admin@coolstock.com",     password: await hash("admin123"),    role: "Admin",    username: "admin",      phone: "9000000001", status: "Active" },
    { name: "Rahul Manager", email: "manager@coolstock.com",   password: await hash("manager123"),  role: "Manager",  username: "rahul_mgr",  phone: "9000000002", status: "Active" },
    { name: "Priya Cashier", email: "cashier@coolstock.com",   password: await hash("cashier123"),  role: "Cashier",  username: "priya_pos",  phone: "9000000003", status: "Active" },
    { name: "Amit Delivery", email: "delivery@coolstock.com",  password: await hash("delivery123"), role: "Delivery", username: "amit_del",   phone: "9000000004", status: "Active" },
    { name: "Ravi Delivery", email: "delivery2@coolstock.com", password: await hash("delivery123"), role: "Delivery", username: "ravi_del",   phone: "9000000005", status: "Active" },
  ];

  const staffList = await Staff.insertMany(staffData);
  const manager  = staffList.find(s => s.role === 'Manager');
  const cashier  = staffList.find(s => s.role === 'Cashier');
  const delivery1 = staffList.find(s => s.email === 'delivery@coolstock.com');
  const delivery2 = staffList.find(s => s.email === 'delivery2@coolstock.com');
  console.log(`👤 Seeded ${staffList.length} staff (Admin, Manager, Cashier, 2x Delivery)`);

  // ─── 2. PRODUCTS ─────────────────────────────────────────────────
  const productData = [
    { name: "Vanilla Classic",  category: "Ice Cream", unit: "Box",  price: 120, stock: 200, lowThreshold: 30 },
    { name: "Chocolate Fudge",  category: "Ice Cream", unit: "Box",  price: 150, stock: 180, lowThreshold: 30 },
    { name: "Strawberry Bliss", category: "Ice Cream", unit: "Box",  price: 130, stock: 160, lowThreshold: 30 },
    { name: "Mango Delight",    category: "Ice Cream", unit: "Box",  price: 140, stock: 40,  lowThreshold: 30 },
    { name: "Butterscotch",     category: "Ice Cream", unit: "Box",  price: 125, stock: 90,  lowThreshold: 30 },
    { name: "Pista Royale",     category: "Ice Cream", unit: "Box",  price: 160, stock: 70,  lowThreshold: 30 },
    { name: "Black Currant",    category: "Ice Cream", unit: "Box",  price: 155, stock: 25,  lowThreshold: 30 },
    { name: "Kesar Pista",      category: "Ice Cream", unit: "Box",  price: 175, stock: 110, lowThreshold: 30 },
    { name: "Choco Bar",        category: "Bars",      unit: "Pack", price: 80,  stock: 300, lowThreshold: 50 },
    { name: "Creamy Kulfi",     category: "Kulfi",     unit: "Pack", price: 60,  stock: 20,  lowThreshold: 30 },
  ];

  const products = await Product.insertMany(productData);
  console.log(`🍦 Seeded ${products.length} products`);

  // ─── 3. CUSTOMERS ────────────────────────────────────────────────
  const customerData = [
    { name: "Ramesh Shah",  shop: "Shah Ice Cream Palace",    addr: "12, MG Road, Surat",          phone: "9100000001", email: "shah_palace@shop.com",   password: await hash("shop123"), status: "Active" },
    { name: "Meena Patel",  shop: "Patel Cool Corner",        addr: "45, Station Road, Ahmedabad", phone: "9100000002", email: "patel_cool@shop.com",     password: await hash("shop123"), status: "Active" },
    { name: "Kiran Joshi",  shop: "Joshi Sweets & Ice Cream", addr: "8, Market Area, Vadodara",    phone: "9100000003", email: "joshi_sweets@shop.com",   password: await hash("shop123"), status: "Active" },
    { name: "Sonia Mehta",  shop: "Mehta Frost House",        addr: "22, Civil Lines, Rajkot",     phone: "9100000004", email: "mehta_frost@shop.com",    password: await hash("shop123"), status: "Active" },
    { name: "Dinesh Kumar", shop: "Kumar Chill Zone",          addr: "67, Ring Road, Gandhinagar",  phone: "9100000005", email: "kumar_chill@shop.com",    password: await hash("shop123"), status: "Active" },
  ];

  const customers = await Customer.insertMany(customerData);
  console.log(`🏪 Seeded ${customers.length} customers`);

  // ─── 4. PRODUCT BATCHES (product_batches table) ──────────────────
  const expiryFuture = new Date(); expiryFuture.setMonth(expiryFuture.getMonth() + 6);
  const expiryNear   = new Date(); expiryNear.setDate(expiryNear.getDate() + 20); // expiring soon!

  const batchData = [
    { product_id: products[0]._id, batch_number: "BATCH-001", quantity: 100, expiry_date: expiryFuture, expiry_alert_sent: false },
    { product_id: products[1]._id, batch_number: "BATCH-002", quantity: 80,  expiry_date: expiryFuture, expiry_alert_sent: false },
    { product_id: products[6]._id, batch_number: "BATCH-003", quantity: 25,  expiry_date: expiryNear,   expiry_alert_sent: false }, // Black Currant — expiring soon
    { product_id: products[9]._id, batch_number: "BATCH-004", quantity: 20,  expiry_date: expiryNear,   expiry_alert_sent: false }, // Creamy Kulfi — expiring soon
  ];

  const batches = await ProductBatch.insertMany(batchData);
  console.log(`📦 Seeded ${batches.length} product batches (2 expiring soon)`);

  // ─── 5. ORDERS — matching MySQL order_history actions ────────────
  const now = Date.now();
  const day = 86400000;

  // Helper to build item with subtotal
  const item = (product, qty) => ({
    product_id: product._id,
    quantity: qty,
    price_per_unit: product.price,
    subtotal: product.price * qty,
  });

  const ordersData = [
    // ORDER 1: Paid — full lifecycle, all history entries
    {
      customer_id: customers[0]._id,
      order_number: "ORD-2026-001",
      amount: (products[0].price * 10) + (products[1].price * 5),
      urgency: "Normal",
      status: "Paid",
      date: new Date(now - 10 * day),
      items: [ item(products[0], 10), item(products[1], 5) ],
      assigned_to: delivery1._id, assigned_by: manager._id,
      payment_collected_by: delivery1._id,
      payment_verified_by: cashier._id,
      assigned_at:    new Date(now - 9 * day),
      in_transit_at:  new Date(now - 8 * day),
      deposited_at:   new Date(now - 7 * day),
      paid_at:        new Date(now - 6 * day),
      order_history: [
        { action: 'Ordered',    performed_by: null,          performed_by_name: 'Customer',       performed_at: new Date(now - 10 * day), remarks: 'Order placed by customer' },
        { action: 'Assigned',   performed_by: manager._id,   performed_by_name: manager.name,     performed_at: new Date(now - 9 * day),  remarks: `Assigned to ${delivery1.name}` },
        { action: 'In Transit', performed_by: delivery1._id, performed_by_name: delivery1.name,   performed_at: new Date(now - 8 * day),  remarks: 'Status updated to In Transit' },
        { action: 'Deposited',  performed_by: delivery1._id, performed_by_name: delivery1.name,   performed_at: new Date(now - 7 * day),  remarks: `Cash deposited to cashier (ID: ${cashier._id})` },
        { action: 'Paid',       performed_by: cashier._id,   performed_by_name: cashier.name,     performed_at: new Date(now - 6 * day),  remarks: 'Payment verified and order finalized' },
      ]
    },
    // ORDER 2: Deposited — cashier needs to verify
    {
      customer_id: customers[1]._id,
      order_number: "ORD-2026-002",
      amount: (products[2].price * 8) + (products[3].price * 6),
      urgency: "Urgent",
      status: "Deposited",
      date: new Date(now - 4 * day),
      items: [ item(products[2], 8), item(products[3], 6) ],
      assigned_to: delivery2._id, assigned_by: manager._id,
      payment_collected_by: delivery2._id,
      assigned_at:   new Date(now - 3 * day),
      in_transit_at: new Date(now - 2 * day),
      deposited_at:  new Date(now - 1 * day),
      order_history: [
        { action: 'Ordered',    performed_by: null,          performed_by_name: 'Customer',     performed_at: new Date(now - 4 * day),  remarks: 'Order placed by customer' },
        { action: 'Assigned',   performed_by: manager._id,   performed_by_name: manager.name,   performed_at: new Date(now - 3 * day),  remarks: `Assigned to ${delivery2.name}` },
        { action: 'In Transit', performed_by: delivery2._id, performed_by_name: delivery2.name, performed_at: new Date(now - 2 * day),  remarks: 'Status updated to In Transit' },
        { action: 'Deposited',  performed_by: delivery2._id, performed_by_name: delivery2.name, performed_at: new Date(now - 1 * day),  remarks: `Cash deposited to cashier (ID: ${cashier._id})` },
      ]
    },
    // ORDER 3: In Transit — delivery boy on the way
    {
      customer_id: customers[2]._id,
      order_number: "ORD-2026-003",
      amount: products[4].price * 12,
      urgency: "Normal",
      status: "In Transit",
      date: new Date(now - 2 * day),
      items: [ item(products[4], 12) ],
      assigned_to: delivery1._id, assigned_by: manager._id,
      assigned_at:   new Date(now - 1 * day),
      in_transit_at: new Date(now - 6 * 3600000),
      order_history: [
        { action: 'Ordered',    performed_by: null,          performed_by_name: 'Customer',     performed_at: new Date(now - 2 * day),       remarks: 'Order placed by customer' },
        { action: 'Assigned',   performed_by: manager._id,   performed_by_name: manager.name,   performed_at: new Date(now - 1 * day),       remarks: `Assigned to ${delivery1.name}` },
        { action: 'In Transit', performed_by: delivery1._id, performed_by_name: delivery1.name, performed_at: new Date(now - 6 * 3600000),   remarks: 'Status updated to In Transit' },
      ]
    },
    // ORDER 4: Assigned — delivery boy has it, not picked up yet
    {
      customer_id: customers[3]._id,
      order_number: "ORD-2026-004",
      amount: (products[5].price * 7) + (products[6].price * 4),
      urgency: "Urgent",
      status: "Assigned",
      date: new Date(now - 1 * day),
      items: [ item(products[5], 7), item(products[6], 4) ],
      assigned_to: delivery2._id, assigned_by: manager._id,
      assigned_at: new Date(now - 2 * 3600000),
      order_history: [
        { action: 'Ordered',  performed_by: null,        performed_by_name: 'Customer',   performed_at: new Date(now - 1 * day),      remarks: 'Order placed by customer' },
        { action: 'Assigned', performed_by: manager._id, performed_by_name: manager.name, performed_at: new Date(now - 2 * 3600000), remarks: `Assigned to ${delivery2.name}` },
      ]
    },
    // ORDER 5: Ordered — just placed, manager hasn't assigned yet
    {
      customer_id: customers[4]._id,
      order_number: "ORD-2026-005",
      amount: products[7].price * 15,
      urgency: "Normal",
      status: "Ordered",
      date: new Date(now - 1 * 3600000),
      items: [ item(products[7], 15) ],
      order_history: [
        { action: 'Ordered', performed_by: null, performed_by_name: 'Customer', performed_at: new Date(now - 1 * 3600000), remarks: 'Order placed by customer' },
      ]
    },
  ];

  const orders = await Order.insertMany(ordersData);
  console.log(`🧾 Seeded ${orders.length} orders`);

  // ─── 6. Standalone OrderHistory (mirrors MySQL order_history table) ─
  const historyEntries = [];
  orders.forEach(order => {
    order.order_history.forEach(h => {
      historyEntries.push({
        order_id:     order._id,
        action:       h.action,
        performed_by: h.performed_by || null,
        performed_at: h.performed_at,
        remarks:      h.remarks,
      });
    });
  });
  await OrderHistory.insertMany(historyEntries);
  console.log(`📋 Seeded ${historyEntries.length} order_history entries`);

  // ─── 7. Sample job applications ───────────────────────────────────
  await Application.insertMany([
    { full_name: "Neha Singh",   email: "neha@example.com",   phone: "9200000001", role: "Manager",        description: "3 years management experience", status: "Pending",  applied_at: new Date(now - 2 * day) },
    { full_name: "Gracy Thomas", email: "gracy@example.com",  phone: "9200000002", role: "Delivery Person", description: "Own bike, delivery experience",  status: "Accepted", applied_at: new Date(now - 5 * day) },
    { full_name: "Raj Sharma",   email: "raj@example.com",    phone: "9200000003", role: "Cashier",         description: "POS experience at retail",       status: "Pending",  applied_at: new Date(now - 1 * day) },
  ]);
  console.log("📝 Seeded 3 job applications");

  console.log(`
==============================================
🎉  DATABASE SEEDED SUCCESSFULLY!
==============================================

MongoDB Collections → MySQL Tables mapping:
  staff            ← staff
  customers        ← customers
  products         ← products
  productbatches   ← product_batches
  orders           ← orders  (includes order_items embedded)
  orderhistories   ← order_history
  applications     ← job_applications

📋  STAFF LOGIN CREDENTIALS
──────────────────────────────────────────────
Admin      admin@coolstock.com        admin123
Manager    manager@coolstock.com      manager123
Cashier    cashier@coolstock.com      cashier123
Delivery   delivery@coolstock.com     delivery123
Delivery   delivery2@coolstock.com    delivery123

🏪  CUSTOMER LOGIN  (password: shop123)
──────────────────────────────────────────────
shah_palace@shop.com / patel_cool@shop.com
joshi_sweets@shop.com / mehta_frost@shop.com / kumar_chill@shop.com

📦  ORDER STATUS (matching MySQL order_history actions)
──────────────────────────────────────────────
ORD-2026-001  →  Paid          (full lifecycle ✅)
ORD-2026-002  →  Deposited     (cashier to verify 💰)
ORD-2026-003  →  In Transit    (delivery on the way 🛵)
ORD-2026-004  →  Assigned      (delivery boy ready 📌)
ORD-2026-005  →  Ordered       (manager to assign ⏳)
==============================================
`);
  process.exit(0);
}).catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

