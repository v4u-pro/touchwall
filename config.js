module.exports = {
  // Resolume Arena REST API
  resolume: {
    host: "http://localhost:9999",
    api: "/api/v1",
  },

  // Maximum simultaneous clip triggers (3 people at a time)
  maxConcurrent: 3,

  // Key-to-clip mapping from the Bare Conductive Touch Board
  // Each key maps to a layer and clip index in Resolume (1-based)
  // Update these once you know which keys the Touch Board electrodes send
  triggers: {
    a: { layer: 2, clip: 1, name: "Clip A" },
    b: { layer: 2, clip: 2, name: "Clip B" },
    c: { layer: 2, clip: 3, name: "Clip C" },
    d: { layer: 2, clip: 4, name: "Clip D" },
    e: { layer: 2, clip: 5, name: "Clip E" },
  },

  // Background clip (always playing on layer 1)
  background: {
    layer: 1,
    clip: 1,
  },

  // How often to poll Resolume for clip status (ms)
  pollInterval: 500,
};
