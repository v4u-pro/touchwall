const HID = require("node-hid");

console.log("=== All Connected HID Devices ===\n");

const devices = HID.devices();

if (devices.length === 0) {
  console.log("No HID devices found.");
} else {
  devices.forEach((d, i) => {
    console.log(`--- Device ${i + 1} ---`);
    console.log(`  Product:      ${d.product || "(unknown)"}`);
    console.log(`  Manufacturer: ${d.manufacturer || "(unknown)"}`);
    console.log(`  VendorID:     0x${d.vendorId.toString(16).padStart(4, "0")}`);
    console.log(`  ProductID:    0x${d.productId.toString(16).padStart(4, "0")}`);
    console.log(`  Path:         ${d.path}`);
    console.log(`  Usage:        ${d.usage}`);
    console.log(`  UsagePage:    ${d.usagePage}`);
    console.log(`  Interface:    ${d.interface}`);
    console.log();
  });
  console.log(`Total: ${devices.length} devices`);
}
