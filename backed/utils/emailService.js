const nodemailer = require('nodemailer');

// Configure the transporter
// For development, you can use Mailtrap, Gmail (with App Password), or Ethereal
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP server
    auth: {
        user: process.env.EMAIL_USER || 'rshiyal632@rku.ac.in',
        pass: process.env.EMAIL_PASS || 'gzdcezaspoqwzpso'
    }
});

// Helper to send email
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"CoolStock" <${process.env.EMAIL_USER || 'noreply@coolstock.com'}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        // We don't throw error here to avoid breaking the main request flow
        return null;
    }
};

exports.sendEmail = sendEmail;

// ── Order Templates ──────────────────────────────────────────────────

exports.sendOrderConfirmation = async (customer, order) => {
    const subject = `Order Confirmed - ${order.order_number}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #6366f1;">🍦 Order Confirmed!</h2>
            <p>Hello <b>${customer.name}</b>,</p>
            <p>Your order <b>${order.order_number}</b> has been received and is being processed.</p>
            <hr/>
            <p><b>Order Details:</b></p>
            <p>Total Amount: ₹${order.amount}</p>
            <p>Urgency: ${order.urgency}</p>
            <hr/>
            <p>We will notify you when your order is assigned to a delivery boy.</p>
            <p>Thanks,<br/>CoolStock Team</p>
        </div>
    `;
    return sendEmail(customer.email, subject, html);
};

exports.sendAssignmentNotification = async (deliveryBoy, order) => {
    const subject = `New Delivery Assigned - ${order.order_number}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #2563eb;">🛵 New Assignment</h2>
            <p>Hello <b>${deliveryBoy.name}</b>,</p>
            <p>You have been assigned a new delivery: <b>${order.order_number}</b>.</p>
            <hr/>
            <p><b>Delivery Info:</b></p>
            <p>Customer: ${order.customer_id.shop || order.customer_id.name}</p>
            <p>Address: ${order.customer_id.addr}</p>
            <hr/>
            <p>Please pick up the order from the warehouse as soon as possible.</p>
        </div>
    `;
    return sendEmail(deliveryBoy.email, subject, html);
};

exports.sendPaymentVerification = async (customer, order) => {
    const subject = `Payment Verified - ${order.order_number}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #059669;">✅ Payment Verified</h2>
            <p>Hello <b>${customer.name}</b>,</p>
            <p>Payment for your order <b>${order.order_number}</b> has been verified by our cashier.</p>
            <p>The order is now marked as <b>Paid</b>. You can download your invoice from the Track Orders panel.</p>
            <hr/>
            <p>Total Paid: ₹${order.amount}</p>
            <p>Verified by: ${order.payment_verified_by.name}</p>
            <hr/>
            <p>Thank you for shopping with CoolStock!</p>
        </div>
    `;
    return sendEmail(customer.email, subject, html);
};

exports.sendExpiryAlert = async (managerEmail, product, batch) => {
    const subject = `⚠️ Expiry Alert: ${product.name}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-top: 5px solid #ef4444;">
            <h2 style="color: #ef4444;">⚠️ Stock Expiry Alert</h2>
            <p>A batch of <b>${product.name}</b> is expiring soon.</p>
            <hr/>
            <p><b>Batch Details:</b></p>
            <p>Batch Number: ${batch.batch_number}</p>
            <p>Quantity: ${batch.quantity}</p>
            <p>Expiry Date: ${new Date(batch.expiry_date).toLocaleDateString()}</p>
            <hr/>
            <p>Please take necessary action to clear the stock.</p>
        </div>
    `;
    return sendEmail(managerEmail, subject, html);
};

exports.sendOrderStatusUpdate = async (customer, order, status) => {
    const subject = `Order Status Update: ${status} - ${order.order_number}`;
    const icons = {
        'In Transit': '🛵',
        'Deposited': '💰',
        'Assigned': '📌'
    };
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #6366f1;">${icons[status] || '📋'} Status Update</h2>
            <p>Hello <b>${customer.name}</b>,</p>
            <p>The status of your order <b>${order.order_number}</b> has changed to: <b>${status}</b>.</p>
            <p>You can track the live progress in your dashboard.</p>
            <br/>
            <p>Thanks,<br/>CoolStock Team</p>
        </div>
    `;
    return sendEmail(customer.email, subject, html);
};

exports.sendOrderCancellation = async (customer, order, remarks) => {
    const subject = `Order Cancelled - ${order.order_number}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-top: 5px solid #ef4444;">
            <h2 style="color: #ef4444;">❌ Order Cancelled</h2>
            <p>Hello <b>${customer.name}</b>,</p>
            <p>We regret to inform you that your order <b>${order.order_number}</b> has been cancelled.</p>
            <p><b>Reason:</b> ${remarks || 'Administrative reasons'}</p>
            <p>If you have any questions, please contact us.</p>
        </div>
    `;
    return sendEmail(customer.email, subject, html);
};

exports.sendApplicationReceived = async (applicant) => {
    const subject = `Application Received - CoolStock Careers`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #6366f1;">📝 Application Received</h2>
            <p>Hello <b>${applicant.full_name}</b>,</p>
            <p>Thank you for applying for the position of <b>${applicant.role}</b> at CoolStock.</p>
            <p>Our HR team is reviewing your profile and will contact you if you are shortlisted.</p>
            <br/>
            <p>Best Regards,<br/>CoolStock Careers</p>
        </div>
    `;
    return sendEmail(applicant.email, subject, html);
};

exports.sendApplicationAccepted = async (applicant, credentials) => {
    const subject = `Congratulations! Application Accepted - CoolStock`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-top: 5px solid #059669;">
            <h2 style="color: #059669;">🎉 Congratulations!</h2>
            <p>Hello <b>${applicant.full_name}</b>,</p>
            <p>We are excited to inform you that your application for <b>${applicant.role}</b> has been **Accepted**.</p>
            <p>You can now log in to the CoolStock Management Portal using the following credentials:</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="margin: 5px 0;"><b>Login URL:</b> Management Portal</p>
                <p style="margin: 5px 0;"><b>Username:</b> ${credentials.email}</p>
                <p style="margin: 5px 0;"><b>Temporary Password:</b> <code style="background: #e2e8f0; padding: 2px 5px; border-radius: 4px;">${credentials.password}</code></p>
            </div>
            <p style="color: #64748b; font-size: 12px;">*Please change your password immediately after your first login for security reasons.</p>
            <br/>
            <p>Welcome to the team!<br/>CoolStock HR</p>
        </div>
    `;
    return sendEmail(applicant.email, subject, html);
};

exports.sendLowStockAlert = async (managerEmail, product) => {
    const subject = `⚠️ Low Stock Alert: ${product.name}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-top: 5px solid #f59e0b;">
            <h2 style="color: #f59e0b;">⚠️ Low Stock Alert</h2>
            <p>Stock for <b>${product.name}</b> is running low.</p>
            <hr/>
            <p>Current Stock: <b>${product.stock} ${product.unit}</b></p>
            <p>Threshold: ${product.lowThreshold} ${product.unit}</p>
            <hr/>
            <p>Please restock this item soon to avoid out-of-stock situations.</p>
        </div>
    `;
    return sendEmail(managerEmail, subject, html);
};

exports.sendPasswordReset = async (user, resetCode) => {
    const subject = `Password Reset Code - CoolStock`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #6366f1;">🔑 Password Reset</h2>
            <p>Hello <b>${user.name}</b>,</p>
            <p>You requested to reset your password. Use the following code to proceed:</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; text-align: center;">
                <h1 style="letter-spacing: 5px; color: #1e293b; margin: 0;">${resetCode}</h1>
            </div>
            <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
            <br/>
            <p>Thanks,<br/>CoolStock Team</p>
        </div>
    `;
    return sendEmail(user.email, subject, html);
};

exports.sendCustomerWelcome = async (customer, username, tempPassword) => {
    const subject = `Welcome to CoolStock - Your Portal Credentials`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-top: 5px solid #6366f1;">
            <h2 style="color: #6366f1;">🍦 Welcome to CoolStock!</h2>
            <p>Hello <b>${customer.name}</b>,</p>
            <p>Your business account has been created. You can now log in to the Customer Portal to place orders and track deliveries.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="margin: 5px 0;"><b>Login URL:</b> Customer Portal</p>
                <p style="margin: 5px 0;"><b>Username/Email:</b> ${customer.email}</p>
                <p style="margin: 5px 0;"><b>Temporary Password:</b> <code style="background: #e2e8f0; padding: 2px 5px; border-radius: 4px;">${tempPassword}</code></p>
            </div>
            <p style="color: #64748b; font-size: 12px;">*Please change your password after your first login.</p>
            <br/>
            <p>Best Regards,<br/>CoolStock Team</p>
        </div>
    `;
    return sendEmail(customer.email, subject, html);
};
