const config = require("./config");
const resolume = require("./resolume");

// Active slots — tracks which clips are currently playing
// Map of key -> { layer, clip, name, startedAt }
const activeSlots = new Map();

// Polling interval reference
let pollTimer = null;

function getActiveCount() {
  return activeSlots.size;
}

function isKeyActive(key) {
  return activeSlots.has(key);
}

function getActiveKeys() {
  return Array.from(activeSlots.keys());
}

async function tryTrigger(key) {
  const trigger = config.triggers[key];
  if (!trigger) {
    console.log(`[SlotManager] Unknown key: "${key}"`);
    return false;
  }

  // Already playing this clip — ignore
  if (activeSlots.has(key)) {
    console.log(`[SlotManager] "${key}" (${trigger.name}) already playing, ignoring`);
    return false;
  }

  // Check if we have a free slot
  if (activeSlots.size >= config.maxConcurrent) {
    console.log(
      `[SlotManager] All ${config.maxConcurrent} slots full [${getActiveKeys().join(", ")}], ignoring "${key}"`
    );
    return false;
  }

  // Trigger the clip in Resolume
  const ok = await resolume.triggerClip(trigger.layer, trigger.clip);
  if (!ok) {
    console.log(`[SlotManager] Failed to trigger "${key}" (${trigger.name})`);
    return false;
  }

  activeSlots.set(key, {
    ...trigger,
    startedAt: Date.now(),
  });

  console.log(
    `[SlotManager] TRIGGERED "${key}" (${trigger.name}) on layer ${trigger.layer}, clip ${trigger.clip} ` +
      `[${activeSlots.size}/${config.maxConcurrent} slots used]`
  );
  return true;
}

// Poll Resolume to detect when clips finish playing
async function pollClipStatus() {
  for (const [key, slot] of activeSlots) {
    try {
      const playing = await resolume.isClipPlaying(slot.layer, slot.clip);
      if (!playing) {
        console.log(
          `[SlotManager] "${key}" (${slot.name}) finished playing, freeing slot ` +
            `[${activeSlots.size - 1}/${config.maxConcurrent} slots used]`
        );
        activeSlots.delete(key);
      }
    } catch (err) {
      console.error(`[SlotManager] Error polling "${key}": ${err.message}`);
    }
  }
}

function startPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(pollClipStatus, config.pollInterval);
  console.log(`[SlotManager] Polling clip status every ${config.pollInterval}ms`);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

module.exports = {
  tryTrigger,
  getActiveCount,
  getActiveKeys,
  isKeyActive,
  startPolling,
  stopPolling,
};
