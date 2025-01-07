"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// Create a new order
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, orderController_1.createOrder)(req, res);
}));
// Get all orders
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, orderController_1.getAllOrders)(req, res);
}));
// Get a single order by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, orderController_1.getOrderById)(req, res);
}));
// Update an order
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, orderController_1.updateOrder)(req, res);
}));
// Delete an order
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, orderController_1.deleteOrder)(req, res);
}));
exports.default = router;
