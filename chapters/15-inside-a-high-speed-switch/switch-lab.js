'use strict';

function visibleRequests(queues, discipline) {
  return queues.map(queue => discipline === 'fifo'
    ? queue.slice(0, 1)
    : Array.from(new Set(queue)).sort());
}

function greedy(requests) {
  const used = new Set();
  return requests.map(edges => {
    const output = edges.find(edge => !used.has(edge));
    if (output) used.add(output);
    return output;
  });
}

function maximumSize(requests) {
  let best = [];
  let bestCount = -1;

  function search(index, used, grants, count) {
    if (index === requests.length) {
      if (count > bestCount) {
        best = grants;
        bestCount = count;
      }
      return;
    }
    for (const output of requests[index]) {
      if (!used.has(output)) {
        const nextUsed = new Set(used);
        nextUsed.add(output);
        search(index + 1, nextUsed, [...grants, output], count + 1);
      }
    }
    search(index + 1, used, [...grants, undefined], count);
  }

  search(0, new Set(), [], 0);
  return best;
}

function simulate(inputs, discipline, scheduler) {
  const queues = inputs.map(input => Array.from(input));
  const choose = scheduler === 'maximum' ? maximumSize : greedy;
  const trace = [];
  while (queues.some(queue => queue.length)) {
    const requests = visibleRequests(queues, discipline);
    const grants = choose(requests);
    grants.forEach((output, input) => {
      if (output) queues[input].splice(queues[input].indexOf(output), 1);
    });
    trace.push({ requests, grants, remaining: queues.map(queue => queue.join('')) });
  }
  return trace;
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#settings');
  const summary = document.querySelector('#summary');
  const table = document.querySelector('#trace');

  function render() {
    const inputs = [1, 2, 3].map(i => document.querySelector('#input-' + i).value.toUpperCase());
    const discipline = document.querySelector('#queues').value;
    const scheduler = document.querySelector('#scheduler').value;
    const trace = simulate(inputs, discipline, scheduler);
    table.replaceChildren();
    trace.forEach(({ requests, grants, remaining }, slot) => {
      const row = table.insertRow();
      const visible = requests.map((edges, i) => (i + 1) + ' → ' + (edges.join(', ') || '∅'));
      const sent = grants.flatMap((output, i) => output ? [(i + 1) + ' → ' + output] : []);
      for (const value of [slot + 1, visible.join(' · '), sent.join(' · '), remaining.map(x => x || '∅').join(' | ')]) {
        row.insertCell().textContent = value;
      }
    });
    summary.textContent = trace.length
      ? 'All ' + inputs.join('').length + ' packets transferred in ' + trace.length + ' slots.'
      : 'No packets waiting.';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  render();
}

if (typeof module !== 'undefined') module.exports = { visibleRequests, greedy, maximumSize, simulate };
