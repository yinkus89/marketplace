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
exports.createStore = exports.getStores = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const getStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield prismaClient_1.default.store.findMany({
            include: { reviews: true },
        });
        res.status(200).json(stores);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getStores = getStores;
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, logo, sellerId } = req.body;
    try {
        const store = yield prismaClient_1.default.store.create({
            data: { name, description, logo, sellerId },
        });
        res.status(201).json(store);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.createStore = createStore;
