'use strict';

const slots = 66;
const spacing = 2;

// Time zero is the expected arrival of the first original. With fixed
// forward delay, subsequent send slots line up with the arrival slots.
function runRetransmission(lost, roundTrip) {
  const originals = [];
  const pending = [];
  let unseen = [];
  for (let slot = 0; slot < slots; slot++) {
    const time = slot * spacing;
    if (pending.length && pending[0].ready <= time) {
      pending.shift().packet.received = time;
      continue;
    }
    const packet = { number: originals.length + 1, expected: time, received: null };
    originals.push(packet);
    if (lost.has(packet.number)) {
      unseen.push(packet);
      continue;
    }
    packet.received = time;
    for (const missing of unseen) {
      pending.push({ ready: time + roundTrip, packet: missing });
    }
    unseen = [];
  }
  return originals;
}

function runXor(lost, groupSize) {
  const originals = [];
  let missing = [];
  for (let slot = 0; slot < slots; slot++) {
    const time = slot * spacing;
    if (slot % (groupSize + 1) === groupSize) {
      // With one XOR equation, a group has to have at most one unknown.
      if (missing.length === 1) missing[0].received = time;
      missing = [];
      continue;
    }
    const packet = { number: originals.length + 1, expected: time, received: time };
    originals.push(packet);
    if (lost.has(packet.number)) {
      packet.received = null;
      missing.push(packet);
    }
  }
  return originals;
}

function outcome(packet, deadline) {
  if (packet.received === null) return 'Missing when trace ends';
  if (packet.received - packet.expected > deadline) return 'Late';
  return packet.expected === packet.received ? 'Arrived' : 'Repaired on time';
}

if (typeof document !== 'undefined') {
  const controls = document.querySelector('#controls');
  const trace = document.querySelector('#trace');
  const summary = document.querySelector('#summary');

  function render() {
    const groupSize = Number(document.querySelector('#group').value);
    const roundTrip = Number(document.querySelector('#rtt').value);
    const deadline = Number(document.querySelector('#deadline').value);
    const lossText = document.querySelector('#losses').value.trim();
    const lost = new Set(lossText ? lossText.split(',').map(Number) : []);
    const runs = [
      ['Retransmission', runRetransmission(lost, roundTrip)],
      ['XOR', runXor(lost, groupSize)],
    ];
    trace.replaceChildren();
    const totals = [];
    for (const [label, originals] of runs) {
      let onTime = 0;
      for (const packet of originals) {
        const state = outcome(packet, deadline);
        if (state === 'Arrived' || state === 'Repaired on time') onTime++;
        const row = trace.insertRow();
        for (const value of [label, packet.number, packet.expected, packet.received ?? '—', state]) {
          row.insertCell().textContent = value;
        }
      }
      totals.push(label + ' delivered ' + onTime + ' on time out of ' + originals.length + ' originals sent');
    }
    summary.textContent = totals.join('. ') + '.';
  }

  controls.addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  render();
}

if (typeof module !== 'undefined') module.exports = { runRetransmission, runXor, outcome };
