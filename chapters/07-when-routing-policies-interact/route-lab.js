'use strict';

const routers = [1, 2, 3];
const preferredNeighbor = [0, 2, 3, 1];
const schedules = [
  [1, 3, 2], [1, 2, 3], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1],
];
const assignments = Array.from({ length: 8 }, (_, mask) =>
  routers.map((_, index) => Boolean(mask & (1 << index))));

// A true route choice represents the exact two-hop path. Both allowed
// paths remain physically possible, but a detour requires a direct suffix.
function route(as, detour) {
  return detour ? [as, preferredNeighbor[as], 0] : [as, 0];
}

function select(as, routes, preferDetour) {
  const neighbor = preferredNeighbor[as];
  return preferDetour[as - 1] && !routes[neighbor - 1];
}

function isStable(routes, preferences) {
  return routers.every(as => select(as, routes, preferences) === routes[as - 1]);
}

function stableAssignments(preferences) {
  return assignments.filter(routes => isStable(routes, preferences));
}

function simulate(preferences, schedule) {
  let routes = [false, false, false];
  const trace = [{ routes }];
  const seen = new Map();

  while (true) {
    const step = trace.length - 1;
    if (isStable(routes, preferences)) return { trace, period: 0 };

    const phase = step % schedule.length;
    const state = JSON.stringify([routes, phase]);
    if (seen.has(state)) {
      const cycleStart = seen.get(state);
      return { trace, cycleStart, period: step - cycleStart };
    }
    seen.set(state, step);

    const as = schedule[phase];
    const neighbor = preferredNeighbor[as];
    const advertised = route(neighbor, routes[neighbor - 1]);
    const detour = select(as, routes, preferences);
    const changed = detour !== routes[as - 1];
    routes = routes.map((current, index) => index === as - 1 ? detour : current);
    trace.push({ as, advertised, changed, routes });
  }
}

function mountLab() {
  const form = document.querySelector('#settings');
  const preferenceFields = routers.map(as => document.querySelector(`#prefer-${as}`));
  const scheduleField = document.querySelector('#schedule');
  const traceRows = document.querySelector('#trace-rows');
  const sweepRows = document.querySelector('#sweep-rows');
  const formatPath = path => path.join(' → ');

  function addRow(table, values) {
    const row = table.insertRow();
    for (const value of values) row.insertCell().textContent = value;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const preferences = preferenceFields.map(field => field.checked);
    const schedule = schedules[scheduleField.selectedIndex];
    const { trace, cycleStart, period } = simulate(preferences, schedule);
    const lastStep = trace.length - 1;
    const stableCount = stableAssignments(preferences).length;

    traceRows.replaceChildren();
    trace.forEach(({ as, advertised, changed, routes }, step) => {
      const paths = routers.map(router => formatPath(route(router, routes[router - 1])));
      addRow(traceRows, [
        step, as ? `AS${as}` : 'Start', advertised ? formatPath(advertised) : '—',
        ...paths, as ? (changed ? 'Changed' : 'Kept') : '—',
      ]);
    });

    const outcome = period
      ? `At step ${lastStep}, the routes and the next scheduled AS match step ${cycleStart}. The trace repeats every ${period} activations.`
      : `All three routes are stable at step ${lastStep}.`;
    const count = stableCount === 1 ? '1 stable assignment' : `${stableCount} stable assignments`;
    document.querySelector('#summary').textContent = `${outcome} There are ${count} among the eight possible assignments.`;
    document.querySelector('#results').hidden = false;
  });

  document.querySelector('#run-sweep').addEventListener('click', () => {
    sweepRows.replaceChildren();
    for (const preferences of assignments) {
      const results = schedules.map(schedule => simulate(preferences, schedule));
      const settled = results.filter(result => result.period === 0).length;
      const changes = results.map(result => result.trace.filter(entry => entry.changed).length);
      const detourFirst = routers.filter(as => preferences[as - 1]).map(as => `AS${as}`);
      addRow(sweepRows, [
        detourFirst.join(', ') || 'None', stableAssignments(preferences).length,
        `${settled} / ${schedules.length}`,
        `${Math.min(...changes)}–${Math.max(...changes)}`,
      ]);
    }
    document.querySelector('#sweep').hidden = false;
  });
}

if (typeof document !== 'undefined') mountLab();
if (typeof module !== 'undefined') module.exports = { route, schedules, simulate, stableAssignments };
