"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Token verification middleware
const settingsController = __importStar(require("../controllers/settingsController")); // Controller import
const router = express_1.default.Router();
// Get all settings (Admin only)
router.get("/settings", authMiddleware_1.verifyToken, authMiddleware_1.adminMiddleware, settingsController.getAllSettings);
// Get a specific setting by key (Admin only)
router.get("/settings/:key", authMiddleware_1.verifyToken, authMiddleware_1.adminMiddleware, settingsController.getSettingByKey);
// Update a setting by key (Admin only)
router.put("/settings/:key", authMiddleware_1.verifyToken, authMiddleware_1.adminMiddleware, settingsController.updateSettingByKey);
// Create a new setting (Admin only)
router.post("/settings", authMiddleware_1.verifyToken, authMiddleware_1.adminMiddleware, settingsController.createSetting);
// Delete a setting (Admin only)
router.delete("/settings/:key", authMiddleware_1.verifyToken, authMiddleware_1.adminMiddleware, settingsController.deleteSetting);
exports.default = router;
