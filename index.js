const readline = require("readline");
const config = require("./config");
const resolume = require("./resolume");
const slotManager = require("./slot-manager");

const VALID_KEYS = new Set(Object.keys(config.triggers));

async function startBackgroundClip() {
  const { layer, clip } = config.background;
  const ok = await resolume.triggerClip(layer, clip);
  if (ok) {
    console.log(`[Main] Background clip started on layer ${layer}, clip ${clip}`);
  } else {
    console.log(`[Main] Warning: could not start background clip`);
  }
}

function setupKeyboardInput() {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", async (str, key) => {
    // Ctrl+C to exit
    if (key && key.ctrl && key.name === "c") {
      console.log("\n[Main] Shutting down...");
      slotManager.stopPolling();
      process.exit(0);
    }

    const keyName = key ? key.name : str;
    if (!keyName) return;

    const normalized = keyName.toLowerCase();

    if (VALID_KEYS.has(normalized)) {
      await slotManager.tryTrigger(normalized);
    }
  });
}

async function main() {
  console.log("==========================================");
  console.log("  TOUCHWALL SERVER");
  console.log("==========================================");
  console.log(`Resolume:    ${config.resolume.host}`);
  console.log(`Max slots:   ${config.maxConcurrent}`);
  console.log(`Triggers:    ${Object.keys(config.triggers).join(", ")}`);
  console.log("==========================================\n");

  // Test Resolume connection
  try {
    const status = await resolume.getClipStatus(
      config.background.layer,
      config.background.clip
    );
    if (status) {
      console.log(`[Main] Resolume connected. BG clip: "${status.name}"`);
    } else {
      console.log("[Main] Warning: could not read BG clip status");
    }
  } catch (err) {
    console.error(`[Main] ERROR: Cannot connect to Resolume at ${config.resolume.host}`);
    console.error(`       Make sure Arena is running. Error: ${err.message}`);
    process.exit(1);
  }

  // Start background clip
  await startBackgroundClip();

  // Start slot manager polling
  slotManager.startPolling();

  // Start listening for keyboard input
  setupKeyboardInput();

  console.log("\n[Main] Ready! Waiting for Touch Board input...");
  console.log("[Main] Press Ctrl+C to stop.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
