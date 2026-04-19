const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
            req.user = decoded;
            console.log(`🔐 Auth Check: User ${req.user.email} (Role: ${req.user.role}) accessing ${req.originalUrl}`);

            // Check role if roles are specified
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                console.warn(`🚨 Access Denied for ${req.user.email}: Role ${req.user.role} not in [${roles.join(', ')}]`);
                return res.status(403).json({ msg: "Access denied: insufficient permissions" });
            }

            next();
        } catch (err) {
            console.error("❌ Token Validation Failed:", err.message);
            res.status(401).json({ msg: "Token is not valid" });
        }
    };
};

module.exports = auth;
