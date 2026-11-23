"use strict";

const windowRules = {
  aimd: (window, overload) => overload ? window / 2 : window + 1,
  miad: (window, overload) => overload ? window - 1 : window * 2,
};

function simulateWindows({ initial, bdp, buffer, rounds, update }) {
  let windows = initial;
  return Array.from({ length: rounds }, (_, round) => {
    const total = windows[0] + windows[1];
    const overload = total > bdp + buffer;
    const queue = Math.max(0, Math.min(buffer, total - bdp));
    const utilization = Math.min(1, total / bdp);
    const step = { round, windows, total, overload, queue, utilization };
    windows = windows.map(window => Math.max(1, update(window, overload)));
    return step;
  });
}
