const HID = require("node-hid");

// Baseline: all Apple vendor IDs we want to ignore
const IGNORE_VENDORS = new Set([0x05ac, 0x0000]);

function findNewDevices() {
  const devices = HID.devices();
  return devices.filter((d) => !IGNORE_VENDORS.has(d.vendorId));
}

console.log("=== Waiting for Raspberry Pi HID device ===");
console.log("Plug in the Pi via USB now...\n");

const poll = setInterval(() => {
  const newDevices = findNewDevices();
  if (newDevices.length > 0) {
    clearInterval(poll);
    console.log("New device(s) detected!\n");
    newDevices.forEach((d, i) => {
      console.log(`--- New Device ${i + 1} ---`);
      console.log(`  Product:      ${d.product || "(unknown)"}`);
      console.log(`  Manufacturer: ${d.manufacturer || "(unknown)"}`);
      console.log(`  VendorID:     0x${d.vendorId.toString(16).padStart(4, "0")}`);
      console.log(`  ProductID:    0x${d.productId.toString(16).padStart(4, "0")}`);
      console.log(`  Path:         ${d.path}`);
      console.log(`  Usage:        ${d.usage}`);
      console.log(`  UsagePage:    ${d.usagePage}`);
      console.log();
    });

    // Try to open each and listen for data
    for (const d of newDevices) {
      try {
        console.log(`Opening device: ${d.product || d.path}...`);
        const device = new HID.HID(d.path);

        device.on("data", (data) => {
          const bytes = Array.from(data);
          const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
          const ascii = bytes
            .filter((b) => b >= 32 && b <= 126)
            .map((b) => String.fromCharCode(b))
            .join("");

          console.log(
            `[${new Date().toISOString()}] Raw: [${hex}] ASCII: "${ascii}" Bytes: [${bytes.join(", ")}]`
          );
        });

        device.on("error", (err) => {
          console.error(`Device error: ${err.message}`);
        });

        console.log("Listening for input... Press Ctrl+C to stop.\n");
      } catch (err) {
        console.error(`Could not open ${d.path}: ${err.message}`);
      }
    }
  }
}, 1000);

process.on("SIGINT", () => {
  console.log("\nStopping...");
  clearInterval(poll);
  process.exit(0);
});
