function sampleClock(period) {
  const bits = [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1];
  return bits.map((expected, index) => {
    const time = 0.5 + index * period;
    return { expected, time, observed: bits[Math.floor(time)] };
  });
}

function sampleVoltage(levels, bound) {
  const disturbances = [0.83, -0.62, 0.94, -0.97, -0.49, 0.17, -0.93, 0.55];
  const spacing = 2 / (levels - 1);
  return disturbances.map((noise, index) => {
    const sent = index % levels;
    const voltage = sent * spacing + noise * bound;
    const decoded = Math.max(0, Math.min(levels - 1, Math.round(voltage / spacing)));
    return { sent, nominal: sent * spacing, voltage, decoded };
  });
}

if (typeof document !== 'undefined') {
  function renderRows(selector, rows) {
    const body = document.querySelector(selector);
    body.replaceChildren(...rows.map(values => {
      const row = document.createElement('tr');
      for (const value of values) row.insertCell().textContent = value;
      return row;
    }));
  }

  const period = document.querySelector('#period');
  const levels = document.querySelector('#levels');
  const noise = document.querySelector('#noise');
  const number = value => value.toFixed(2);
  function render() {
    const interval = Number(period.value);
    document.querySelector('#clock-value').textContent = `${number(interval)} transmitter slots`;
    document.querySelector('#noise-value').textContent = `±${number(Number(noise.value))} V`;
    renderRows('#clock', sampleClock(interval).map(({ expected, time, observed }, index) => [
      index + 1, number(time), expected, observed ?? 'past signal',
      observed === expected ? 'Correct' : 'Miss',
    ]));
    renderRows('#voltage', sampleVoltage(Number(levels.value), Number(noise.value)).map(({ sent, nominal, voltage, decoded }) => [
      sent, number(nominal), number(voltage), decoded, decoded === sent ? 'Correct' : 'Error',
    ]));
  }
  document.querySelector('main').addEventListener('input', render);
  render();
}

if (typeof module !== 'undefined') module.exports = { sampleClock, sampleVoltage };
