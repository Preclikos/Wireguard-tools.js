export type { wgInterface as wgInterfaceStatus, peerInfo as peerInfoStatus } from "./getStatus";
export type { keyObject, keyObjectPreshered } from "./genKey";
import getStatus from "./getStatus";
import getConfig from "./getConfig";
import genKey from "./genKey";

export {getConfig, getStatus, genKey};