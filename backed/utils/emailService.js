const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "rshiyal632@rku.ac.in",
        pass: process.env.EMAIL_PASS || "gzdcezaspoqwzpso",
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📡 Attempting to send email to: ${to} | Subject: ${subject}`);
        const mailOptions = {
            from: `"CoolStock Ice Cream" <${process.env.EMAIL_USER || "rshiyal632@rku.ac.in"}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
        throw error;
    }
};

const templates = {
    applicationReceived: (name) => ({
        subject: "Job Application Received - CoolStock Ice Cream",
        html: `
            <h1>Hello ${name},</h1>
            <p>Thank you for applying to join the CoolStock team!</p>
            <p>We have received your application and are currently reviewing it.</p>
            <br/>
            <p>Stay Cool,</p>
            <p>The CoolStock Team</p>
        `
    }),
    orderStatusUpdate: (orderNumber, status) => ({
        subject: `Order Status Update: ${orderNumber}`,
        html: `
            <h1>Your order status has changed!</h1>
            <p>Order <strong>${orderNumber}</strong> is now: <strong>${status}</strong>.</p>
            <br/>
            <p>Thank you for choosing CoolStock!</p>
        `
    }),
    orderCancelled: (orderNumber) => ({
        subject: `Order Cancelled: ${orderNumber}`,
        html: `
            <h1>Your order has been cancelled</h1>
            <p>We regret to inform you that order <strong>${orderNumber}</strong> has been cancelled.</p>
        `
    }),
    lowStockAlert: (productName, currentStock) => ({
        subject: `Low Stock Alert: ${productName}`,
        html: `<h1 style="color: #e11d48;">⚠️ Low Stock Alert</h1><p>Product <strong>${productName}</strong> current stock: ${currentStock}</p>`
    }),
    expiryAlert: (productName, expiryDate, qty) => ({
        subject: `Upcoming Expiry Alert: ${productName}`,
        html: `<h1 style="color: #f59e0b;">⏳ Expiry Alert</h1><p>Product <strong>${productName}</strong> expires on ${expiryDate}. Qty: ${qty}</p>`
    }),
    staffCredentials: (name, username, password) => ({
        subject: "Welcome to the CoolStock Team!",
        html: `
            <h1>Welcome aboard, ${name}!</h1>
            <p>Your staff account has been created. Here are your login credentials:</p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
            <p>Please log in and change your password as soon as possible.</p>
            <br/>
            <a href="http://localhost:5173/login" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 10px; font-weight: bold;">Login to Portal</a>
        `
    })
};

module.exports = { sendEmail, templates };
