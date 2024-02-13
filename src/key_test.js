"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = __importDefault(require("node:test"));
const key_1 = require("./key");
const max = 100, keysArray = Array(max).fill(null);
(0, node_test_1.default)("Generate key in javascript", async (t) => {
    const PrivateKey = "yI7j4HI5kBKp+uDIsiKTGYdZooeyzF9i49yKRbmq1n8=";
    t.test("Generate Preshared key", async () => { await (0, key_1.presharedKey)(); });
    t.test("Generate Private key", async () => { await (0, key_1.privateKey)(); });
    t.test("Get public key", () => node_assert_1.default.strictEqual((0, key_1.publicKey)(PrivateKey), "utkYO/qP/pxLaRCoPsZnpPx5G9hz/9DnBc3OTmk8uX0="));
    await t.test(`Generate key ${max}`, async () => {
        await Promise.all(keysArray.map(async () => {
            const _presharedKey = await (0, key_1.presharedKey)();
            const _privateKey = await (0, key_1.privateKey)();
            const _publicKey = (0, key_1.publicKey)(_privateKey);
            return [_privateKey, { preshared: _presharedKey, pub: _publicKey }];
        }));
    });
});
