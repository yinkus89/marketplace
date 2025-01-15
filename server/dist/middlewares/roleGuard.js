"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleGuard = (roles, hierarchical = false) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access, no user found in request" });
        }
        const userRole = req.user.role;
        if (hierarchical) {
            // Assuming a role hierarchy where "ADMIN" > "VENDOR" > "CUSTOMER"
            const roleHierarchy = ['ADMIN', 'VENDOR', 'CUSTOMER'];
            const userRoleIndex = roleHierarchy.indexOf(userRole);
            const allowedRoleIndex = Math.max(...roles.map(role => roleHierarchy.indexOf(role)));
            if (userRoleIndex === -1 || userRoleIndex < allowedRoleIndex) {
                return res.status(403).json({ message: "Forbidden: Insufficient role" });
            }
        }
        else {
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: "Forbidden: Insufficient role" });
            }
        }
        next();
    };
};
exports.default = roleGuard;
