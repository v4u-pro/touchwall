const config = require("./config");

const BASE = `${config.resolume.host}${config.resolume.api}`;

async function triggerClip(layer, clip) {
  const url = `${BASE}/composition/layers/${layer}/clips/${clip}/connect`;
  const res = await fetch(url, { method: "POST" });
  return res.status === 204;
}

async function clearLayer(layer) {
  const url = `${BASE}/composition/layers/${layer}/clear`;
  const res = await fetch(url, { method: "POST" });
  return res.status === 204;
}

async function getClipStatus(layer, clip) {
  const url = `${BASE}/composition/layers/${layer}/clips/${clip}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    name: data.name?.value || "unknown",
    connected: data.connected?.value === "Connected",
    position: data.transport?.position?.value || 0,
  };
}

async function isClipPlaying(layer, clip) {
  const status = await getClipStatus(layer, clip);
  return status ? status.connected : false;
}

module.exports = { triggerClip, clearLayer, getClipStatus, isClipPlaying };
