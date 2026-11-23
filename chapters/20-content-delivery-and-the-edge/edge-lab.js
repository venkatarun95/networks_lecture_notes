'use strict';

const sizes = { i: 1, a: 8, b: 8, c: 8 };

function simulate(requests, capacity, freshness, admitAfter) {
  // Map iteration order records recency. The first entry is least recent.
  const cache = new Map();
  const seen = new Map();
  let used = 0;
  let upstream = 0;
  let hits = 0;

  function remove(object) {
    cache.delete(object);
    used -= sizes[object];
  }

  const trace = Array.from(requests, (object, step) => {
    for (const [stored, filledAt] of cache) {
      if (step - filledAt >= freshness) remove(stored);
    }
    const count = (seen.get(object) ?? 0) + 1;
    seen.set(object, count);
    const hit = cache.has(object);
    if (hit) {
      const filledAt = cache.get(object);
      cache.delete(object);
      cache.set(object, filledAt);
      hits++;
    } else {
      const size = sizes[object];
      upstream += size;
      if (count >= admitAfter && size <= capacity && freshness > 0) {
        while (used + size > capacity) remove(cache.keys().next().value);
        cache.set(object, step);
        used += size;
      }
    }
    return { hit, cached: Array.from(cache.keys()), upstream };
  });
  return { trace, upstream, hits };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#settings');
  const table = document.querySelector('#trace');
  const summary = document.querySelector('#summary');

  function describe(entry) {
    const stored = entry.cached.join(', ') || 'empty';
    return (entry.hit ? 'Hit' : 'Miss') + ' · cache ' + stored + ' · ' + entry.upstream + ' MB fetched';
  }

  function render() {
    const sequence = document.querySelector('#sequence').value.replace(/\s/g, '');
    const capacity = Number(document.querySelector('#capacity').value);
    const freshness = Number(document.querySelector('#freshness').value);
    const first = simulate(sequence, capacity, freshness, 1);
    const second = simulate(sequence, capacity, freshness, 2);
    table.replaceChildren();
    Array.from(sequence).forEach((object, i) => {
      const row = table.insertRow();
      for (const value of [i + 1, object, describe(first.trace[i]), describe(second.trace[i])]) {
        row.insertCell().textContent = value;
      }
    });
    summary.textContent = 'First request: ' + first.hits + ' hits, ' + first.upstream
      + ' MB upstream. Second request: ' + second.hits + ' hits, ' + second.upstream + ' MB upstream.';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  render();
}

if (typeof module !== 'undefined') module.exports = { simulate };
