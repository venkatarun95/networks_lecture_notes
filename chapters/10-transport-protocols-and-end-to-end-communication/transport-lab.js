function simulate({ scenario, threshold, timeout }) {
  const pending = [];
  const trace = [];
  const buffered = new Set();
  let next = 0;
  let acked = 0;
  let sent = 0;
  let duplicates = 0;
  let timer = Infinity;
  let retryAt = null;
  let deliveryAt = null;
  let retries = 0;

  function log(tick, event) {
    trace.push({ tick, event });
  }

  function send(tick, segment, retry = false) {
    if (retry) {
      retryAt ??= tick;
      retries += 1;
    } else {
      if (acked === sent && timeout) timer = tick + timeout;
      sent += 1;
    }
    const label = segment + 1;
    const lost = !retry && (
      (scenario === 'early loss' && segment === 1) ||
      (scenario === 'tail loss' && segment === 4)
    );
    if (lost) {
      log(tick, `Sent segment ${label}. It was dropped.`);
      return;
    }
    const delay = !retry && scenario === 'detour' && segment === 1 ? 11 : 3;
    pending.push({ tick: tick + delay, segment });
    log(tick, `${retry ? 'Retried' : 'Sent'} segment ${label}${delay === 11 ? ' on the detour' : ''}.`);
  }

  for (let tick = 0; tick <= 80; tick += 1) {
    if (tick < 5) send(tick, tick);
    for (const event of pending.filter(event => event.tick === tick)) {
      if (event.segment !== undefined) {
        if (event.segment >= next) buffered.add(event.segment);
        const previous = next;
        while (buffered.delete(next)) next += 1;
        if (next === 5) deliveryAt ??= tick;
        const delivery = next > previous ? ` Released through segment ${next}.` : '';
        log(tick, `Received segment ${event.segment + 1}, sent ACK ${next}.${delivery}`);
        pending.push({ tick: tick + 3, ack: next });
        continue;
      }
      log(tick, `Sender received ACK ${event.ack}.`);
      if (event.ack > acked) {
        acked = event.ack;
        duplicates = 0;
        timer = timeout && acked < sent ? tick + timeout : Infinity;
      } else if (event.ack === acked && acked < sent) {
        duplicates += 1;
        if (threshold && duplicates === threshold) send(tick, acked, true);
      }
    }
    if (timer === tick) {
      log(tick, 'Timer expired.');
      send(tick, acked, true);
      duplicates = 0;
      timer = tick + timeout;
    }
    if (acked === 5 && !pending.some(event => event.tick > tick)) break;
  }
  return { trace, retryAt, deliveryAt, retries };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const result = simulate({
      scenario: data.get('scenario'),
      threshold: Number(data.get('threshold')),
      timeout: Number(data.get('timeout')),
    });
    document.querySelector('output').textContent =
      `First retry: ${result.retryAt ?? 'none'}. Complete delivery: ${result.deliveryAt ?? 'stalled'}. Retransmissions: ${result.retries}.`;
    document.querySelector('tbody').replaceChildren(...result.trace.map(({ tick, event: message }) => {
      const row = document.createElement('tr');
      row.insertCell().textContent = tick;
      row.insertCell().textContent = message;
      return row;
    }));
  });
  form.requestSubmit();
}

if (typeof module !== "undefined") module.exports = { simulate };
