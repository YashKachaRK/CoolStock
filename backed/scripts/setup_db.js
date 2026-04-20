const mysql = require("mysql2");

// Initial connection to create database if it doesn't exist
const initialConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

initialConn.query("CREATE DATABASE IF NOT EXISTS coolstock", (err) => {
  if (err) {
    console.error("Error creating database:", err);
    process.exit(1);
  }
  console.log("Database 'coolstock' verified/created.");
  initialConn.end();

  // Now connect to the database to create tables
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coolstock"
  });

  const queries = [
    `CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        shop VARCHAR(255) NOT NULL,
        addr TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        joined DATE DEFAULT CURRENT_TIMESTAMP
      )`,
    `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        lowThreshold INT DEFAULT 50
      )`,
    `CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Manager', 'Delivery', 'Cashier', 'Customer') NOT NULL,
        status ENUM('Active', 'Inactive') DEFAULT 'Active'
      )`,
    `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('Pending', 'Assigned', 'In Transit', 'Delivered', 'Paid') DEFAULT 'Pending',
        urgency ENUM('Regular', 'Urgent', 'Very Urgent') DEFAULT 'Regular',
        date DATE,
        delivery_boy_id INT,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )`,
    `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price_per_unit DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`,
    `CREATE TABLE IF NOT EXISTS product_batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        quantity INT NOT NULL,
        expiry_date DATE NOT NULL,
        batch_code VARCHAR(100),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`,
    `CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(100) NOT NULL,
        description TEXT,
        status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
  ];

  function runQueries(index) {
    if (index >= queries.length) {
      console.log("All tables verified/created.");
      db.end();
      process.exit();
    }

    db.query(queries[index], (err, result) => {
      if (err) {
        console.error("Error running query:", err);
        process.exit(1);
      }
      console.log("Successfully ran query:", queries[index].split('(')[0].trim());
      runQueries(index + 1);
    });
  }

  runQueries(0);
});
