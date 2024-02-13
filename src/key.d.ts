/**
 * Generate preshared key blocking loop event
 *
 * @deprecated - use presharedKey
 */
export declare function presharedKeySync(): string;
/**
 * Generate preshared key
 */
export declare function presharedKey(): Promise<string>;
/**
 * Create private key
 *
 * @deprecated - Use privateKey
 */
export declare function privateKeySync(): string;
/**
 * Create private key
 */
export declare function privateKey(): Promise<string>;
export declare function keyToBase64(key: Uint8Array): string;
export declare function Base64ToKey(keyInput: string): Uint8Array;
/**
 * Get Public key from Private key
 *
 * @param privateKey - Private key
 */
export declare function publicKey(privKey: string): string;
