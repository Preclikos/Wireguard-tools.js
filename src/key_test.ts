import assert from "node:assert";
import test from "node:test";
import { presharedKey, privateKey, publicKey } from "./key";

test("Generate key", async (t) => {
  const PrivateKey = "yI7j4HI5kBKp+uDIsiKTGYdZooeyzF9i49yKRbmq1n8=";
  t.test("Get public key", async () => assert.strictEqual(await publicKey(PrivateKey), "utkYO/qP/pxLaRCoPsZnpPx5G9hz/9DnBc3OTmk8uX0="));
  t.test("Generate Preshared key", async () => { await presharedKey() });
  t.test("Generate Private key", async () => { await privateKey() });

  const max = 100;
  await t.test(`Generate key ${max}`, async () => {
    await Promise.all(Array(max).fill(null).map(async () => {
      const _presharedKey = await presharedKey();
      const _privateKey = await privateKey();
      const _publicKey = publicKey(_privateKey);
      return [_privateKey, { preshared: _presharedKey, pub: _publicKey }];
    }));
  });
});
