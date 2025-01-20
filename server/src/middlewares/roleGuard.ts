import { Request, Response, NextFunction } from 'express';

const roleGuard = (roles: string[], hierarchical = false, roleHierarchy: string[] = ['ADMIN', 'VENDOR', 'CUSTOMER']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access, no user found in request" });
    }

    const userRole = req.user.role;

    if (hierarchical) {
      const userRoleIndex = roleHierarchy.indexOf(userRole);
      const allowedRoleIndex = Math.max(...roles.map(role => roleHierarchy.indexOf(role)));
      
      if (userRoleIndex === -1) {
        return res.status(400).json({ message: "Invalid role in request" }); // If the role is not part of the hierarchy
      }
      if (userRoleIndex < allowedRoleIndex) {
        return res.status(403).json({ message: `Forbidden: ${userRole} is not authorized to access this resource` });
      }
    } else {
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: `Forbidden: ${userRole} is not authorized to access this resource` });
      }
    }

    next();
  };
};

export default roleGuard;
