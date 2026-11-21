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

const playbackFigure = document.getElementById('playback-lab');
if (playbackFigure) mountPlayback(playbackFigure);
const sharedLinkFigure = document.getElementById('shared-link-lab');
if (sharedLinkFigure) {
  mountSharedLink(sharedLinkFigure).catch(error => {
    console.error('The shared-link simulation could not start.', error);
  });
}
