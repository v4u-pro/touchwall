const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

console.log("=== Keyboard Input Listener ===");
console.log("Listening for ALL keypress events (from any keyboard/HID device)...");
console.log("Send input from the Pi now. Press Ctrl+C to stop.\n");

process.stdin.on("keypress", (str, key) => {
  // Ctrl+C to exit
  if (key && key.ctrl && key.name === "c") {
    console.log("\nStopping...");
    process.exit(0);
  }

  const timestamp = new Date().toISOString();
  const charCode = str ? str.charCodeAt(0) : null;

  console.log(`[${timestamp}]`);
  console.log(`  Key name:  ${key ? key.name : "(none)"}`);
  console.log(`  Char:      "${str || "(none)"}"`);
  console.log(`  CharCode:  ${charCode}`);
  console.log(`  Ctrl:      ${key ? key.ctrl : false}`);
  console.log(`  Shift:     ${key ? key.shift : false}`);
  console.log(`  Meta:      ${key ? key.meta : false}`);
  console.log(`  Sequence:  ${key ? JSON.stringify(key.sequence) : "(none)"}`);
  console.log();
});
