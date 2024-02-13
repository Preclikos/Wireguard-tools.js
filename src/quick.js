"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = void 0;
const net_1 = require("net");
const util_1 = require("util");
/**
 * Parse wireguard quick config and return QuickConfig object
 * @param configString - Config string
 * @returns QuickConfig object
 */
function parse(configString) {
    const config = Object.create({}), PostPre = /^(post|pre)(up|down)$/, Sep = /^\[([a-zA-Z]+)\]$/, Key = /^([a-zA-Z0-9\._\-]+)(\s+|\t+)?=/;
    const splits = configString.trim().split(/\r?\n/).filter(s => !((s = s.trim()).length === 0 || s[0] === "#")).reduce((acc, line) => {
        if (line.match(Sep)) {
            const [, k] = line.match(Sep);
            acc.push([k.toLowerCase(), []]);
        }
        else if (line.match(Key)) {
            acc.at(-1)[1].push([
                line.slice(0, line.indexOf("=")).trim().toLowerCase(),
                line.slice(line.indexOf("=") + 1).trim(),
            ]);
        }
        return acc;
    }, []);
    const interfaceConfig = splits.filter(([k]) => k === "interface")[0][1].reduce((acc, [k, v]) => {
        if (k === "address")
            acc.address = (acc.address || []).concat(...(v.split(",").map(s => s.trim()).filter(s => (0, net_1.isIP)(s.split("/")[0]) !== 0)));
        else if (k === "dns")
            acc.dns = (acc.dns || []).concat(...(v.split(",").map(s => s.trim()).filter(s => (0, net_1.isIP)(s.split("/")[0]) !== 0)));
        else if (PostPre.test(k))
            acc[k] = (acc[k] || []).concat(...(v.split(/;|&&/).map(s => s.trim())));
        else if (k === "listenport" || k === "table")
            acc[k] = parseInt(v);
        else
            acc[k] = v;
        return acc;
    }, {}), peers = splits.filter(([k]) => k === "peer").map(([, p]) => (p.reduce((acc, [k, v]) => {
        if (k === "allowedips")
            acc.allowedips = [...(acc.allowedips || []), ...(v.split(",").map(s => s.trim()).filter(s => (0, net_1.isIP)(s.split("/")[0]) !== 0))];
        else if (k === "endpoint")
            acc.endpoint = v;
        else if (k === "keepinterval")
            acc[k] = v;
        else
            acc[k] = v;
        return acc;
    }, {})));
    if (interfaceConfig.privatekey)
        config.privateKey = interfaceConfig.privatekey;
    if (interfaceConfig.publickey)
        config.publicKey = interfaceConfig.publickey;
    if (interfaceConfig.listenport >= 0)
        config.portListen = interfaceConfig.listenport;
    if (interfaceConfig.table > 0)
        config.Table = interfaceConfig.table;
    if (interfaceConfig.mtu > 0)
        config.MTU = interfaceConfig.mtu;
    if (interfaceConfig.fwmark > 0)
        config.fwmark = interfaceConfig.fwmark;
    if (Array.isArray(interfaceConfig.postup))
        config.PostUp = interfaceConfig.postup;
    if (Array.isArray(interfaceConfig.postdown))
        config.PostDown = interfaceConfig.postdown;
    if (Array.isArray(interfaceConfig.preup))
        config.PreUp = interfaceConfig.preup;
    if (Array.isArray(interfaceConfig.predown))
        config.PreDown = interfaceConfig.predown;
    if (Array.isArray(interfaceConfig.address))
        config.Address = interfaceConfig.address;
    config.peers = {};
    peers.forEach(({ publickey, presharedkey, endpoint, keepinterval, allowedips }) => {
        if (publickey.length !== 44)
            return;
        config.peers[publickey] = {};
        if (typeof presharedkey === "string")
            config.peers[publickey].presharedKey = presharedkey;
        if (typeof endpoint === "string")
            config.peers[publickey].endpoint = endpoint;
        if (keepinterval > 0)
            config.peers[publickey].keepInterval = keepinterval;
        if (allowedips && Array.isArray(allowedips))
            config.peers[publickey].allowedIPs = allowedips;
    });
    return config;
}
exports.parse = parse;
/**
 * Convert quick config to String
 * @param wgConfig - Quick config Object
 */
function stringify(wgConfig) {
    let configStr = ["[Interface]"];
    if (wgConfig.portListen >= 0)
        configStr.push((0, util_1.format)("ListenPort = %s", wgConfig.portListen));
    if (wgConfig.Address)
        configStr.push((0, util_1.format)("Address = %s", wgConfig.Address.join(", ")));
    if (wgConfig.privateKey)
        configStr.push((0, util_1.format)("PrivateKey = %s", wgConfig.privateKey));
    if (wgConfig.publicKey)
        configStr.push((0, util_1.format)("PublicKey = %s", wgConfig.publicKey));
    if (wgConfig.Table > 0)
        configStr.push((0, util_1.format)("Table = %s", wgConfig.Table));
    if (wgConfig.fwmark > 0)
        configStr.push((0, util_1.format)("Fwmark = %s", wgConfig.fwmark));
    if (wgConfig.MTU > 0)
        configStr.push((0, util_1.format)("MTU = %s", wgConfig.MTU));
    if (wgConfig.DNS)
        configStr.push((0, util_1.format)("DNS = %s", wgConfig.DNS.join(", ")));
    if (wgConfig.PreUp)
        configStr.push((0, util_1.format)("PreUp = %s", wgConfig.PreUp.join(", ")));
    if (wgConfig.PreDown)
        configStr.push((0, util_1.format)("PreDown = %s", wgConfig.PreDown.join("; ")));
    if (wgConfig.PostUp)
        configStr.push((0, util_1.format)("PostUp = %s", wgConfig.PostUp.join("; ")));
    if (wgConfig.PostDown)
        configStr.push((0, util_1.format)("PostDown = %s", wgConfig.PostDown.join("; ")));
    if (Object.keys(wgConfig.peers || {}).length > 0)
        for (const pubKey in wgConfig.peers) {
            const peerConfig = wgConfig.peers[pubKey];
            configStr.push("", "[Peer]", (0, util_1.format)("PublicKey = %s", pubKey));
            if (peerConfig.presharedKey)
                configStr.push((0, util_1.format)("PresharedKey = %s", peerConfig.presharedKey));
            if (peerConfig.keepInterval > 0)
                configStr.push((0, util_1.format)("PersistentKeepalive = %n", peerConfig.keepInterval));
            if (peerConfig.endpoint)
                configStr.push((0, util_1.format)("Endpoint = %s", peerConfig.endpoint));
            if (peerConfig.allowedIPs)
                configStr.push((0, util_1.format)("AllowedIPs = %s", peerConfig.allowedIPs.join(", ")));
        }
    return configStr.join("\n").trim();
}
exports.stringify = stringify;
