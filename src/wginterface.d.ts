export declare const constants: {
    WG_B64_LENGTH: number;
    WG_LENGTH: number;
    MAX_NAME_LENGTH: number;
    driveVersion: string;
};
export interface Peer {
    /** Preshared key to peer */
    presharedKey?: string;
    /** keepInterval specifies the persistent keepalive interval for this peer */
    keepInterval?: number;
    /** Remote address or hostname to Wireguard connect or endpoint is the most recent source address used for communication by peer. */
    endpoint?: string;
    /** AllowedIPs specifies a list of allowed IP addresses in CIDR notation (`0.0.0.0/0`, `::/0`) */
    allowedIPs?: string[];
}
export interface PeerSet extends Peer {
    /** Mark this peer to be removed, any changes remove this option */
    removeMe?: boolean;
}
export interface PeerGet extends Peer {
    /** ReceiveBytes indicates the number of bytes received from this peer. */
    rxBytes?: number;
    /** TransmitBytes indicates the number of bytes transmitted to this peer. */
    txBytes?: number;
    /** Last peer Handshake */
    lastHandshake?: Date;
}
export interface WgConfigBase<T extends Peer> {
    /** privateKey specifies a private key configuration */
    privateKey?: string;
    /** publicKey specifies a public key configuration */
    publicKey?: string;
    /** ListenPort specifies a device's listening port, 0 is random */
    portListen?: number;
    /** FirewallMark specifies a device's firewall mark */
    fwmark?: number;
    /** Interface IP address'es */
    Address?: string[];
    /** Interface peers */
    peers: Record<string, T>;
}
export interface WgConfigGet extends WgConfigBase<PeerGet> {
}
export interface WgConfigSet extends WgConfigBase<PeerSet> {
    /** this option will remove all peers if `true` and add new peers */
    replacePeers?: boolean;
}
/**
 * Get Wireguard devices and locations
 */
export declare function listDevices(): Promise<{
    from: "userspace" | "kernel";
    name: string;
    path?: string;
}[]>;
/**
 * Delete wireguard interface if present
 * @param wgName - Interface name
 * @returns
 */
export declare function deleteInterface(wgName: string): Promise<void>;
/**
 * Set Wireguard config in interface
 *
 * in the Linux and Windows create if not exist interface
 *
 * @param wgName - Interface name
 * @param config - Interface config
 */
export declare function setConfig(wgName: string, config: WgConfigSet): Promise<void>;
/**
 * Get wireguard interface config
 * @param wgName - Interface name
 * @returns
 */
export declare function getConfig(wgName: string): Promise<WgConfigGet>;
