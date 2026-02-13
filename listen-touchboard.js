const { GlobalKeyboardListener } = require("node-global-key-listener");

const gkl = new GlobalKeyboardListener();

console.log("=== Touch Board Keyboard Listener ===");
console.log("Listening for global key events from Bare Conductive Touch Board...");
console.log("Touch the electrodes now. Press Ctrl+C to stop.\n");

gkl.addListener((e, down) => {
  if (e.state === "DOWN") {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] KEY DOWN: name="${e.name}" rawKey=${e.rawKey} vKey=${e.vKey}`
    );
  }
});

process.on("SIGINT", () => {
  console.log("\nStopping...");
  process.exit(0);
});
