// One bidirectional cut, one destination, unit link costs, and lossless
// delivery of link-state updates over live links.
const grid = [
  [2, 0, 5, 7],
  [6, 3, 10, 1],
  [4, 8, 9, 11],
];

const switches = grid.flat().sort((a, b) => a - b);
const source = 9;
const destination = 2;
const endpoints = [0, 2];
const failureTime = 3000;
const helloInterval = 50;
const advertisementDelay = 10;
const links = grid.flatMap((row, y) => row.flatMap((id, x) => {
  const next = [];
  if (x + 1 < row.length) next.push([id, row[x + 1]]);
  if (y + 1 < grid.length) next.push([id, grid[y + 1][x]]);
  return next;
}));

function isCut(a, b) {
  return a !== b && endpoints.includes(a) && endpoints.includes(b);
}

function neighborsOf(id, withoutCut) {
  return links.filter(([a, b]) => !withoutCut || !isCut(a, b))
    .filter(link => link.includes(id))
    .map(([a, b]) => a === id ? b : a)
    .sort((a, b) => a - b);
}

function nextHop(router, reports) {
  // With unit costs, a breadth-first search from the destination
  // computes the same distances as Dijkstra's algorithm.
  // Either endpoint reporting the cut removes the bidirectional edge.
  const withoutCut = reports.size > 0;
  if (router === destination) return 'host';
  const distances = new Map([[destination, 0]]);
  const toVisit = [destination];

  for (const id of toVisit) {
    for (const neighbor of neighborsOf(id, withoutCut)) {
      if (distances.has(neighbor)) continue;
      distances.set(neighbor, distances.get(id) + 1);
      toVisit.push(neighbor);
    }
  }
  return neighborsOf(router, withoutCut)
    .find(id => distances.get(id) < distances.get(router)) ?? null;
}

function forwardingPath(routes, cut) {
  let current = source;
  const path = [current];
  while (current !== destination) {
    const next = routes.get(current);
    if (next === null) return { path, result: 'No route' };
    if (cut && isCut(current, next)) {
      return { path: [...path, next], result: 'Dropped at cut link' };
    }
    if (path.includes(next)) {
      return { path: [...path, next], result: 'Loop' };
    }
    path.push(next);
    current = next;
  }
  return { path, result: 'Delivered' };
}

function simulate(misses, lastHelloAge) {
  if (!Number.isInteger(misses) || misses < 1 ||
      !Number.isInteger(lastHelloAge) || lastHelloAge < 0 || lastHelloAge >= helloInterval) {
    throw new RangeError('Expected at least one missed HELLO and a last HELLO 0–49 ms before the cut.');
  }

  const detection = failureTime + misses * helloInterval - lastHelloAge;
  // Both endpoints start with the same probe phase in this exercise.
  const events = endpoints.map(origin => ({ time: detection, origin, at: origin, from: null }));
  const seen = new Map(switches.map(id => [id, new Set()]));
  const routes = new Map(switches.map(id => [id, nextHop(id, seen.get(id))]));
  const initialRoutes = new Map(routes);
  const frames = [
    { time: failureTime - 1, description: 'Before the cut', changes: [], ...forwardingPath(routes, false) },
    { time: failureTime, description: 'S0–S2 stops carrying packets', changes: [], ...forwardingPath(routes, true) },
  ];

  while (events.length) {
    // Equal-time deliveries are processed in insertion order and share
    // a snapshot. Each accepted report is forwarded immediately.
    events.sort((a, b) => a.time - b.time);
    const time = events[0].time;
    const accepted = [];
    const changes = [];

    while (events[0]?.time === time) {
      const { origin, at, from } = events.shift();
      const reports = seen.get(at);
      // Each origin generates just one new version in this scenario.
      if (reports.has(origin)) continue;
      reports.add(origin);
      accepted.push({ origin, at, from });

      const previous = routes.get(at);
      const next = nextHop(at, reports);
      if (previous !== next) {
        routes.set(at, next);
        changes.push({ at, previous, next });
      }

      for (const neighbor of neighborsOf(at, true)) {
        if (neighbor === from) continue;
        events.push({ time: time + advertisementDelay, origin, at: neighbor, from: at });
      }
    }

    if (accepted.length) {
      const description = time === detection
        ? `S0 and S2 declare the link down after ${misses} missed HELLOs`
        : accepted.map(({ origin, at, from }) => `S${at} learns S${origin}’s report from S${from}`).join('. ');
      frames.push({ time, description, changes, ...forwardingPath(routes, true) });
    }
  }
  return { frames, initialRoutes, routes };
}

if (typeof module !== 'undefined') module.exports = { simulate };

if (typeof document !== 'undefined') {
  const form = document.querySelector('#parameters');
  const phase = document.querySelector('#phase');
  const phaseLabel = document.querySelector('#phase-value');
  const summary = document.querySelector('#summary');
  const trace = document.querySelector('#trace');
  const sweep = document.querySelector('#sweep');
  const sweepRows = document.querySelector('#sweep-rows');

  const name = id => typeof id === 'number' ? `S${id}` : (id ?? 'none');
  const delay = time => `${time - failureTime} ms`;
  const readMisses = () => Number(document.querySelector('#misses').value);

  function appendRow(table, cells) {
    const row = table.insertRow();
    for (const value of cells) row.insertCell().textContent = value;
  }

  phase.addEventListener('input', () => {
    phaseLabel.textContent = `${phase.value} ms`;
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const lastHelloAge = Number(phase.value);
    const misses = readMisses();
    const { frames, initialRoutes, routes } = simulate(misses, lastHelloAge);
    const firstChange = frames.find(frame => frame.changes.length);
    const recovery = frames.find(frame => frame.time > failureTime && frame.result === 'Delivered');
    const changed = switches.filter(id => routes.get(id) !== initialRoutes.get(id)).map(name);
    document.querySelector('#results').hidden = false;
    summary.textContent = `First forwarding change at +${delay(firstChange.time)}. ` +
      `S9’s path can deliver again at +${delay(recovery.time)}. ` +
      `Next hops differ at the end on ${changed.join(', ')}.`;
    trace.replaceChildren();

    for (const frame of frames) {
      const changes = frame.changes.map(({ at, previous, next }) =>
        `${name(at)}: ${name(previous)} → ${name(next)}`);
      appendRow(trace, [
        `${frame.time.toLocaleString('en-US')} ms`,
        frame.description,
        changes.join('. ') || 'None',
        `${frame.path.map(name).join(' → ')}. ${frame.result}.`,
      ]);
    }
  });

  document.querySelector('#run-sweep').addEventListener('click', () => {
    const misses = readMisses();
    sweepRows.replaceChildren();
    // The phase repeats every 50 ms. The 50 and 100 ms rows represent
    // cuts just after a HELLO that was delivered at the same tick.
    for (let offset = 0; offset <= 100; offset += 5) {
      const { frames } = simulate(misses, offset % helloInterval);
      const firstChange = frames.find(frame => frame.changes.length);
      appendRow(sweepRows, [`${offset} ms`, delay(firstChange.time)]);
    }
    sweep.hidden = false;
  });
}
