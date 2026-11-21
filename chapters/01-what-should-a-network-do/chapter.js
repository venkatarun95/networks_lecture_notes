const PLAYBACK_END = 18;
const EPSILON = 1e-8;

// Advance directly to a rate change, threshold crossing, or empty buffer.
function playbackTrace(bitrate, threshold, outageStart, outageLength) {
  const outageEnd = outageStart + outageLength;
  const schedule = [[outageStart, 8], [outageEnd, 0], [14, 8], [PLAYBACK_END, 4]];
  let time = 0;
  let buffer = 0;
  let playhead = 0;
  let state = 'Building the startup buffer';
  let totalMegabits = 0;
  const points = [{ time, buffer, playhead }];
  const events = [];

  function changeState(kind, nextState) {
    events.push({ kind, time, buffer });
    state = nextState;
  }

  for (const [end, rate] of schedule) {
    if (end <= time) continue;
    const incoming = rate / bitrate;
    totalMegabits += (end - time) * rate;
    if (state === 'Playing' && buffer <= EPSILON && incoming < 1) {
      changeState('stall', 'Stalled');
    }

    while (time < end - EPSILON) {
      const playing = state === 'Playing';
      const slope = incoming - Number(playing);
      let toEvent = Infinity;
      if (playing && slope < 0) toEvent = -buffer / slope;
      if (!playing && slope > 0) toEvent = (threshold - buffer) / slope;

      const interval = Math.min(end - time, toEvent);
      time += interval;
      if (Math.abs(end - time) <= EPSILON) time = end;
      buffer = Math.max(0, buffer + interval * slope);
      if (playing) playhead += interval;

      if (toEvent <= interval + EPSILON) {
        if (!playing) {
          const kind = state === 'Stalled' ? 'resume' : 'start';
          changeState(kind, 'Playing');
        } else if (time < end) {
          changeState('stall', 'Stalled');
        }
        // At a rate change, the next segment decides whether play can continue.
      }
      points.push({ time, buffer, playhead });
    }
  }

  const stallTime = events.reduce((total, event, index) => {
    if (event.kind !== 'stall') return total;
    return total + (events[index + 1]?.time ?? PLAYBACK_END) - event.time;
  }, 0);
  return { points, events, stallTime, totalMegabits, outageEnd, state };
}

const formatNumber = number => String(Number(number.toFixed(2)));

function numberChoices(name, selected, choices, suffix) {
  return `<select name="${name}">${choices.map(value =>
    `<option value="${value}"${value === selected ? ' selected' : ''}>${value}${suffix}</option>`
  ).join('')}</select>`;
}

function playbackPlot(trace, threshold, outageStart) {
  const { points, events, outageEnd } = trace;
  const maxBuffer = Math.max(threshold, ...points.map(point => point.buffer));
  const tick = Math.max(1, Math.ceil(maxBuffer / 4));
  const timeX = time => 59 + time * 32;
  const bufferY = value => 228 - value * (180 / (tick * 4));
  const coordinates = points.map(point => `${timeX(point.time)},${bufferY(point.buffer)}`).join(' ');
  const tickLabels = [0, 1, 2, 3, 4].map(index => {
    const value = index * tick;
    return `<line x1="59" y1="${bufferY(value)}" x2="635" y2="${bufferY(value)}" class="lab-grid"/>
      <text x="50" y="${bufferY(value) + 5}" text-anchor="end">${value}</text>`;
  }).join('');
  const timeLabels = [0, 3, 6, 9, 12, 15, 18].map(value =>
    `<text x="${timeX(value)}" y="253" text-anchor="middle">${value}</text>`
  ).join('');
  const markers = events.map((event, index) => {
    const x = timeX(event.time);
    const y = bufferY(event.buffer);
    return `<circle cx="${x}" cy="${y}" r="11" class="lab-marker"/>
      <text x="${x}" y="${y + 4}" text-anchor="middle" class="lab-marker-text">${index + 1}</text>`;
  }).join('');
  const outageX = timeX(outageStart);
  const outageWidth = timeX(outageEnd) - outageX;
  return `<svg viewBox="0 0 665 283" role="img" aria-label="Video seconds in the buffer versus wall-clock time. Numbered events are explained below the plot.">
    <rect x="${outageX}" y="48" width="${outageWidth}" height="180" class="lab-outage"/>
    <text x="59" y="25" class="lab-axis-title">Buffered video (s)</text>
    <text x="635" y="25" text-anchor="end" class="lab-outage-label">Shaded delivery outage · ${outageStart}–${outageEnd} s</text>
    ${tickLabels}
    <line x1="59" y1="48" x2="59" y2="228" class="lab-grid"/>
    <line x1="59" y1="${bufferY(threshold)}" x2="635" y2="${bufferY(threshold)}" class="lab-threshold"/>
    <polyline points="${coordinates}" class="lab-trace"/>
    ${markers}
    ${timeLabels}
    <text x="347" y="276" text-anchor="middle" class="lab-axis-title">Wall-clock time (s)</text>
  </svg>`;
}

function describePlayback(trace, threshold) {
  const { events, stallTime, state } = trace;
  const descriptions = events.map(({ kind, time }, index) => {
    const when = formatNumber(time);
    const copy = {
      start: ['Playback starts', `The buffer reaches the ${threshold} s startup target.`],
      stall: ['Buffer runs out', 'Video stops while delivery cannot keep up.'],
      resume: ['Playback resumes', `The buffer has refilled to ${threshold} s of video.`],
    }[kind];
    return `<li><span class="lab-marker-label">${index + 1}</span>
      <div><strong>${when} s · ${copy[0]}</strong><br>${copy[1]}</div></li>`;
  });
  if (state === 'Building the startup buffer') {
    descriptions.push('<li><div><strong>Playback never starts</strong><br>The buffer stays below the startup target throughout the trace.</div></li>');
  } else if (!events.some(event => event.kind === 'stall')) {
    descriptions.push('<li><div><strong>No stall</strong><br>The player has video available whenever it needs to play.</div></li>');
  } else if (state === 'Stalled') {
    descriptions.push('<li><div><strong>Still stalled at 18 s</strong><br>The buffer has yet to refill to the restart target.</div></li>');
  }
  const start = events.find(event => event.kind === 'start');
  const startup = start ? `${formatNumber(start.time)} s startup` : 'No playback';
  const stalls = events.filter(event => event.kind === 'stall').length;
  return `<p class="lab-result">${startup} · ${stalls} ${stalls === 1 ? 'stall' : 'stalls'} · ${formatNumber(stallTime)} s stalled</p>
    <ul class="lab-events">${descriptions.join('')}</ul>`;
}

function mountPlayback(figure) {
  figure.innerHTML = `<h3>Design a playback buffer</h3>
    <p>Choose how much video to collect before starting or resuming, then change the delivery interruption.</p>
    <form class="lab-controls">
      <label>Video bitrate ${numberChoices('bitrate', 4, [2, 4, 6], ' Mbit/s')}</label>
      <label>Start and restart target ${numberChoices('threshold', 2, [1, 2, 3, 4, 5, 6], ' s')}</label>
      <label>Outage begins at ${numberChoices('outageStart', 2, [1, 2, 3, 4, 5, 6, 7, 8], ' s')}</label>
      <label>Outage length ${numberChoices('outageLength', 6, [1, 2, 3, 4, 5, 6], ' s')}</label>
      <button type="button">Reset settings</button>
    </form>
    <div class="lab-plot"></div>
    <div class="lab-playback-results" aria-live="polite"></div>`;
  const form = figure.querySelector('form');
  const plot = figure.querySelector('.lab-plot');
  const results = figure.querySelector('.lab-playback-results');

  function render() {
    const settings = new FormData(form);
    const bitrate = Number(settings.get('bitrate'));
    const threshold = Number(settings.get('threshold'));
    const start = Number(settings.get('outageStart'));
    const length = Number(settings.get('outageLength'));
    const trace = playbackTrace(bitrate, threshold, start, length);
    plot.innerHTML = playbackPlot(trace, threshold, start);
    results.innerHTML = describePlayback(trace, threshold);
  }

  form.addEventListener('change', render);
  form.querySelector('button').addEventListener('click', () => {
    form.reset();
    render();
  });
  render();
  figure.hidden = false;
}

// Link times use microseconds. Each pace point maps playback milliseconds to simulated microseconds.
const RACE_LINKS = [
  { name: 'A', capacity: '1 Gbit/s', propagation: 500_000, kilobyteTime: 8 },
  { name: 'B', capacity: '10 Mbit/s', propagation: 10_000, kilobyteTime: 800 },
];
const RACE_TRANSFERS = {
  stream: {
    bytes: Infinity,
    blockBytes: 1_000_000,
    pace: [[0, 0], [12_000, 2_000_000]],
    result: 'With data ready the whole time, Link A puts 250 MB onto the wire in 2 seconds and Link B puts 2.5 MB onto the wire. Link B’s first bit arrives sooner. Link A sends 100 times as much in the same time.',
  },
  move: {
    bytes: 1_000,
    blockBytes: 1_000,
    pace: [[0, 0], [1600, 14_000], [6500, 500_008]],
    winner: 'B',
    winnerLabel: 'Faster for this game move',
    result: 'Link B wins for gaming. Its shorter propagation delay gets the whole move across in 10.8 ms, versus 500.008 ms on Link A.',
  },
  update: {
    bytes: 10_000_000,
    blockBytes: 1_000_000,
    pace: [[0, 0], [1600, 20_000], [6500, 625_000], [12_500, 8_010_000]],
    winner: 'A',
    winnerLabel: 'Faster for this download',
    result: 'Link A wins for a large download. Its higher capacity puts the update on the wire in 80 ms. The last bit arrives at 580 ms, versus 8.010 s on Link B.',
  },
};

function raceAmount(bytes, blockBytes) {
  const inMegabytes = blockBytes >= 1_000_000;
  const unit = inMegabytes ? 'MB' : 'kB';
  const unitBytes = inMegabytes ? 1_000_000 : 1_000;
  const amount = Math.round(bytes * 1000 / unitBytes) / 1000;
  return `${amount} ${unit}`;
}

function raceTime(microseconds) {
  return microseconds >= 1_000_000
    ? `${(microseconds / 1_000_000).toFixed(3)} s`
    : `${Number((microseconds / 1000).toFixed(3))} ms`;
}

function racePhase(pace, position, axis) {
  const next = pace.findIndex(point => point[axis] > position);
  const end = next < 0 ? pace.length - 1 : next;
  return [pace[end - 1], pace[end]];
}

function mountLinkRace(figure) {
  figure.innerHTML = `<h3>How much can each link send?</h3>
    <div class="lab-controls">
      <label>What to send
        <select>
          <option value="stream">Sustained traffic (2 s)</option>
          <option value="move">Game move (1 kB)</option>
          <option value="update">Software update (10 MB)</option>
        </select>
      </label>
      <button type="button" data-race-action="play">Play</button>
      <button type="button" data-race-action="restart">Reset</button>
      <button type="button" data-race-action="next">Jump to 2 s</button>
    </div>
    <div class="race-timeline">
      <label for="link-race-position">Simulated time <span aria-hidden="true">0 ms</span></label>
      <input id="link-race-position" type="range" min="0" step="1" value="0" aria-describedby="link-race-pace">
      <p id="link-race-pace"></p>
    </div>
    ${RACE_LINKS.map(link => `<section class="race-lane" data-link="${link.name}">
      <h4>Link ${link.name} <span>${link.capacity} · ${raceTime(link.propagation)} propagation</span><strong hidden></strong></h4>
      <div class="race-path" aria-hidden="true">
        <div class="race-endpoints"><span>Sender</span><span>Receiver</span></div>
        <div class="race-track"></div>
      </div>
      <div class="race-totals">
        <div class="race-meter" data-meter="sent">
          <p>Sent onto link <strong></strong></p>
          <progress aria-hidden="true" value="0"></progress>
        </div>
        <div class="race-meter" data-meter="received">
          <p>Received <strong></strong></p>
          <progress aria-hidden="true" value="0"></progress>
        </div>
      </div>
      <p class="race-finish" hidden></p>
    </section>`).join('')}
    <p class="race-key"></p>
    <div class="race-announcement" role="status"></div>
    <figcaption aria-live="polite"></figcaption>`;

  const select = figure.querySelector('select');
  const position = figure.querySelector('input');
  const clock = figure.querySelector('.race-timeline label span');
  const scale = figure.querySelector('#link-race-pace');
  const play = figure.querySelector('[data-race-action="play"]');
  const restart = figure.querySelector('[data-race-action="restart"]');
  const next = figure.querySelector('[data-race-action="next"]');
  const key = figure.querySelector('.race-key');
  const announcement = figure.querySelector('.race-announcement');
  const result = figure.querySelector('figcaption');
  const lanes = RACE_LINKS.map(link => {
    const lane = figure.querySelector(`[data-link="${link.name}"]`);
    const track = lane.querySelector('.race-track');
    const bulkBlockTime = RACE_TRANSFERS.stream.blockBytes * link.kilobyteTime / 1000;
    const dots = Array.from({ length: Math.ceil(link.propagation / bulkBlockTime) }, () => {
      const dot = document.createElement('span');
      track.append(dot);
      return dot;
    });
    const meters = ['sent', 'received'].map(name => {
      const meter = lane.querySelector(`[data-meter="${name}"]`);
      return { label: meter.querySelector('strong'), bar: meter.querySelector('progress') };
    });
    return { ...link, dots, meters, finish: lane.querySelector('.race-finish'), winner: lane.querySelector('h4 strong') };
  });
  let transfer;
  let playbackTime = 0;
  let elapsed = 0;
  let frame = null;
  let lastFrame;

  function updateText(element, value) {
    if (element.textContent !== value) element.textContent = value;
  }

  function bytesOnWire(time, link) {
    return Math.min(transfer.bytes, Math.max(0, Math.floor(time * 1000 / link.kilobyteTime)));
  }

  function finishTime(link) {
    return link.propagation + transfer.bytes * link.kilobyteTime / 1000;
  }

  function renderLane(link) {
    const blockTime = transfer.blockBytes * link.kilobyteTime / 1000;
    const first = Math.max(0, Math.floor((elapsed - link.propagation) / blockTime) + 1);
    const last = Math.min(Math.ceil(transfer.bytes / transfer.blockBytes) - 1, Math.floor(elapsed / blockTime));
    link.dots.forEach((dot, index) => {
      const block = first + index;
      dot.hidden = block > last;
      if (!dot.hidden) {
        const distance = (elapsed - block * blockTime) / link.propagation;
        dot.style.left = `${distance * 100}%`;
      }
    });
    const sent = bytesOnWire(elapsed, link);
    const received = bytesOnWire(elapsed - link.propagation, link);
    link.meters.forEach(({ label, bar }, index) => {
      const amount = index === 0 ? sent : received;
      bar.value = amount;
      updateText(label, raceAmount(amount, transfer.blockBytes));
    });
    link.finish.hidden = elapsed < finishTime(link);
  }

  function render() {
    const [start, end] = racePhase(transfer.pace, playbackTime, 0);
    const rate = (end[1] - start[1]) / (end[0] - start[0]);
    elapsed = Math.round(start[1] + (playbackTime - start[0]) * rate);
    position.value = Math.round(playbackTime);
    const displayTime = raceTime(elapsed);
    updateText(clock, displayTime);
    position.setAttribute('aria-valuetext', displayTime);
    updateText(scale, `Current pace: 1 second of playback is about ${raceTime(rate * 1000)} on the links.`);
    lanes.forEach(renderLane);
    const finished = playbackTime >= Number(position.max);
    updateText(play, frame !== null ? 'Pause' : finished ? 'Replay' : 'Play');
    next.setAttribute('aria-disabled', String(finished));
  }

  function pause() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }

  function selectTransfer() {
    pause();
    transfer = RACE_TRANSFERS[select.value];
    position.max = transfer.pace.at(-1)[0];
    playbackTime = 0;
    updateText(announcement, '');
    const end = transfer.pace.at(-1)[1];
    const barMax = bytesOnWire(end, lanes[0]);
    const commonScale = raceAmount(barMax, transfer.blockBytes);
    updateText(key, `Each dot follows the first bit of a ${raceAmount(transfer.blockBytes, transfer.blockBytes)} block on either link. The bars include partial blocks and share a 0 to ${commonScale} scale. Track lengths are schematic.`);
    updateText(next, Number.isFinite(transfer.bytes) ? 'Next finish' : 'Jump to 2 s');
    for (const link of lanes) {
      for (const { bar } of link.meters) bar.max = barMax;
      updateText(link.finish, Number.isFinite(transfer.bytes) ? `Finished at ${raceTime(finishTime(link))}` : '');
      link.winner.hidden = transfer.winner !== link.name;
      updateText(link.winner, link.winner.hidden ? '' : transfer.winnerLabel);
    }
    updateText(result, transfer.result);
    render();
  }

  function tick(now) {
    playbackTime = Math.min(Number(position.max), playbackTime + now - lastFrame);
    lastFrame = now;
    frame = playbackTime < Number(position.max) ? requestAnimationFrame(tick) : null;
    render();
  }

  select.addEventListener('change', selectTransfer);
  restart.addEventListener('click', selectTransfer);
  play.addEventListener('click', () => {
    if (frame === null) {
      if (playbackTime >= Number(position.max)) playbackTime = 0;
      lastFrame = performance.now();
      frame = requestAnimationFrame(tick);
    } else {
      pause();
    }
    render();
  });
  position.addEventListener('input', () => {
    pause();
    playbackTime = Number(position.value);
    render();
  });
  next.addEventListener('click', () => {
    if (playbackTime >= Number(position.max)) return;
    const sustaining = !Number.isFinite(transfer.bytes);
    const finishes = lanes.map(finishTime);
    const time = sustaining ? transfer.pace.at(-1)[1] : Math.min(...finishes.filter(finish => finish > elapsed));
    if (!Number.isFinite(time)) return;
    pause();
    const [start, end] = racePhase(transfer.pace, time, 1);
    playbackTime = start[0] + (time - start[1]) * (end[0] - start[0]) / (end[1] - start[1]);
    render();
    if (sustaining) {
      updateText(announcement, transfer.result);
    } else {
      const link = lanes[finishes.indexOf(time)];
      updateText(announcement, `Link ${link.name} finished at ${raceTime(time)}.`);
    }
  });

  selectTransfer();
  figure.hidden = false;
}

function linkPacket(result, packet, deadline, promise) {
  if (result === 0) return { packet, outcome: 'Declined · deadline', className: 'refused' };
  if (result === 1) {
    const outcome = promise ? 'Declined · buffer full' : 'Dropped · buffer full';
    return { packet, outcome, className: 'refused' };
  }
  const late = result > deadline;
  return { packet, outcome: `${result} ms · ${late ? 'late' : 'on time'}`, className: late ? 'late' : 'timely' };
}

function senderLane(sender, values, deadline, promise) {
  const delivered = values.filter(value => value > 1).length;
  const onTime = values.filter(value => value > 1 && value <= deadline).length;
  return `<div class="lab-sender"><p><strong>Sender ${sender}</strong> · ${onTime}/${values.length} on time · ${delivered}/${values.length} delivered</p>
    <ul class="lab-packets">${Array.from(values, (result, index) => {
      const { packet, outcome, className } = linkPacket(result, `${sender}${index + 1}`, deadline, promise);
      return `<li class="lab-packet ${className}"><strong>${packet}</strong><span>${outcome}</span></li>`;
    }).join('')}</ul></div>`;
}

async function mountSharedLink(figure) {
  const encoded = document.getElementById('chapter-link-wasm').textContent.trim();
  const bytes = Uint8Array.from(atob(encoded), byte => byte.charCodeAt(0));
  const { instance } = await WebAssembly.instantiate(bytes);
  const { run_shared_link: run, memory } = instance.exports;
  const packetsA = 4;
  figure.innerHTML = `<h3>What can a shared link promise?</h3>
    <p>Both senders offer a burst at time zero. A offers four packets and goes first in the tie. The router considers all offers before sending. Its FIFO buffer holds seven packets. A packet takes 1 ms to put on the wire and 2 ms to cross it. The link stays up, and senders make one attempt.</p>
    <form class="lab-controls">
      <label>Packets offered by B ${numberChoices('packetsB', 4, [1, 2, 3, 4, 5, 6, 7, 8], '')}</label>
      <label>Deadline from time zero ${numberChoices('deadline', 8, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ' ms')}</label>
    </form>
    <div class="lab-link-results" aria-live="polite"></div>`;
  const form = figure.querySelector('form');
  const results = figure.querySelector('.lab-link-results');

  function render() {
    const settings = new FormData(form);
    const packetsB = Number(settings.get('packetsB'));
    const deadline = Number(settings.get('deadline'));
    results.innerHTML = [
      { promise: true, title: 'Admit only what can arrive on time' },
      { promise: false, title: 'Best effort · accept packets while there is room' },
    ].map(({ promise, title }) => {
      const address = run(Number(promise), packetsB, deadline);
      const values = new Uint32Array(memory.buffer, address, packetsA + packetsB);
      return `<section class="lab-link-policy"><h4>${title}</h4>
        ${senderLane('A', values.subarray(0, packetsA), deadline, promise)}
        ${senderLane('B', values.subarray(packetsA), deadline, promise)}</section>`;
    }).join('');
  }

  form.addEventListener('change', render);
  render();
  figure.hidden = false;
}

const raceFigure = document.getElementById('link-race');
if (raceFigure) mountLinkRace(raceFigure);
const playbackFigure = document.getElementById('playback-lab');
if (playbackFigure) mountPlayback(playbackFigure);
const sharedLinkFigure = document.getElementById('shared-link-lab');
if (sharedLinkFigure) {
  mountSharedLink(sharedLinkFigure).catch(error => {
    console.error('The shared-link simulation could not start.', error);
  });
}
