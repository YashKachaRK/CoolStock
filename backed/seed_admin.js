const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Staff = require("./models/Staff");

mongoose.connect("mongodb://localhost:27017/coolstock").then(async () => {
  console.log("Connected to MongoDB");

  const email = "admin@coolstock.com";
  const password = "password123";

  const existingAdmin = await Staff.findOne({ email });
  if (existingAdmin) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Staff({
    name: "Super Admin",
    email: email,
    password: hashedPassword,
    role: "Admin",
    status: "Active",
    phone: "1234567890"
  });

  await admin.save();
  console.log("Admin user seeded successfully:");
  console.log("Email: " + email);
  console.log("Password: " + password);
  
  process.exit(0);
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
  process.exit(1);
});
