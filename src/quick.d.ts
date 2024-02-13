import { Peer, WgConfigBase } from "./wginterface";
export interface QuickConfig extends WgConfigBase<Peer>, Partial<Record<`${"Post" | "Pre"}${"Up" | "Down"}`, string[]>> {
    DNS?: string[];
    Table?: number;
    MTU?: number;
}
/**
 * Parse wireguard quick config and return QuickConfig object
 * @param configString - Config string
 * @returns QuickConfig object
 */
export declare function parse(configString: string): QuickConfig;
/**
 * Convert quick config to String
 * @param wgConfig - Quick config Object
 */
export declare function stringify(wgConfig: QuickConfig): string;
