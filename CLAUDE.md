# Touchwall Server

## What This Is
A Node.js app that bridges a **Bare Conductive Touch Board** (USB HID keyboard device) with **Resolume Arena** to create an interactive touchwall installation.

## How It Works
1. Touch Board connects via USB and sends keyboard keystrokes (one key per electrode)
2. Node.js app captures keyboard input via stdin (raw TTY mode)
3. App maps keys to Resolume Arena clips via its REST API (`http://localhost:9999/api/v1`)
4. Up to 3 clips can play simultaneously (3-person interaction)
5. Background clip always plays on layer 1
6. Overlay clips trigger on layer 2 (clips 1-5 mapped to keys a-e)
7. App polls Resolume every 500ms to detect when clips finish → frees the slot

## Architecture
```
Touch Board (USB HID) → OS Keyboard Input → Node.js stdin → Resolume REST API
```

## Files
- `index.js` — Main entry: starts BG clip, listens for keyboard, triggers clips
- `config.js` — Key mappings, Resolume URL, max concurrent slots (3)
- `resolume.js` — Resolume Arena REST API client (trigger, clear, status)
- `slot-manager.js` — Manages concurrent clip slots, polls for clip completion
- `listen-keyboard.js` — Utility to detect what keys the Touch Board sends
- `detect-devices.js` — Utility to list all HID devices (for debugging)

## Setup
1. Install Resolume Arena, set web server to port 9999
2. Load composition: Layer 1 = background clip, Layer 2 = 5 overlay clips
3. Connect Touch Board via USB
4. `npm install && node index.js` (must run in a real terminal for keyboard input)

## TODO / Next Steps
- **KEY MAPPING**: Run `node listen-keyboard.js`, touch each electrode, record which key each sends. Update `config.js` triggers with the real keys
- **Windows**: The app must run on Windows for final deployment. stdin keyboard capture works the same way. Test `node-hid` and keyboard input on Windows
- **Touch Board has 12 electrodes** but we only use 5 (a-e). Unused electrodes should be ignored
- **Clip looping/stop behavior** is set in Resolume directly, not controlled by the app
- **Consider**: running as a Windows service (node-windows or NSSM) for production

## Resolume API Reference
- Trigger clip: `POST /api/v1/composition/layers/{layer}/clips/{clip}/connect`
- Clear layer: `POST /api/v1/composition/layers/{layer}/clear`
- Get clip status: `GET /api/v1/composition/layers/{layer}/clips/{clip}`
- Clip connected = playing, disconnected = stopped

## Hardware
- **Touch Board**: Bare Conductive (VendorID: 0x2a6e, ProductID: 0x8003)
- Presents as USB keyboard (HID UsagePage 1, Usage 6)
- macOS grabs keyboard HID devices exclusively — cannot use node-hid, must use stdin
