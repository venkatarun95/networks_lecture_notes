"use strict";

function slotProbabilities(radios, attemptChance) {
  const idle = (1 - attemptChance) ** radios;
  const success = radios * attemptChance * (1 - attemptChance) ** (radios - 1);
  return { idle, success, collision: Math.max(0, 1 - idle - success) };
}

function simulateSlots({ radios, attemptChance, slots, seed }) {
  let state = seed >>> 0;
  const counts = { idle: 0, success: 0, collision: 0 };
  const trace = [];
  for (let slot = 0; slot < slots; slot++) {
    let attempts = 0;
    for (let radio = 0; radio < radios; radio++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      if (state / 4294967296 < attemptChance) attempts++;
    }
    const result = attempts === 0 ? "idle" : attempts === 1 ? "success" : "collision";
    counts[result]++;
    trace.push({ slot: slot + 1, attempts, result });
  }
  return { counts, trace };
}
