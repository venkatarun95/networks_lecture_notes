function pageLoad({ linkReady, dnsWarm, connectionOpen, assetsFresh, apiTime }) {
  const rows = [];
  function add(label, start, duration) {
    const end = start + duration;
    rows.push({ label, start, end });
    return end;
  }

  let time = 0;
  if (!linkReady) {
    time = add('Join Wi-Fi', time, 25);
    time = add('DHCP lease', time, 20);
    time = add('ARP for gateway', time, 2);
  }
  if (!(linkReady && connectionOpen)) {
    if (!dnsWarm) time = add('DNS resolution', time, 30);
    time = add('TCP setup', time, 40);
    time = add('TLS setup', time, 40);
  }
  const html = add('HTML response', time, 45);
  const css = add('Stylesheet', html, assetsFresh ? 0 : 44);
  add('Logo', html, assetsFresh ? 0 : 60);
  const script = add('Script response', html, assetsFresh ? 0 : 48);
  const startedApi = add('Script execution', script, 5);
  const api = add('Departures response', startedApi, apiTime);
  return { rows, ready: Math.max(css, api) };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('form');
  const fetchControl = name => form.elements.namedItem(name);
  const link = fetchControl('linkReady');
  const connection = fetchControl('connectionOpen');
  function render() {
    connection.disabled = !link.checked;
    const result = pageLoad({
      linkReady: link.checked,
      dnsWarm: fetchControl('dnsWarm').checked,
      connectionOpen: connection.checked,
      assetsFresh: fetchControl('assetsFresh').checked,
      apiTime: Number(fetchControl('apiTime').value),
    });
    const scale = Math.max(...result.rows.map(row => row.end));
    document.querySelector('output').textContent = `Styled departures ready at ${result.ready} ms.`;
    document.querySelector('tbody').replaceChildren(...result.rows.map(({ label, start, end }) => {
      const row = document.createElement('tr');
      row.insertCell().textContent = label;
      row.insertCell().textContent = `${start} ms`;
      row.insertCell().textContent = `${end} ms`;
      const cell = row.insertCell();
      cell.className = 'track';
      cell.setAttribute('aria-hidden', 'true');
      const bar = document.createElement('span');
      bar.style.insetInlineStart = `${100 * start / scale}%`;
      bar.style.width = `${100 * (end - start) / scale}%`;
      cell.append(bar);
      return row;
    }));
  }

  form.addEventListener('input', render);
  for (const button of form.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      const warm = button.value === 'warm';
      for (const checkbox of form.querySelectorAll('[type=checkbox]')) checkbox.checked = warm;
      fetchControl('apiTime').value = 55;
      render();
    });
  }
  render();
}

if (typeof module !== 'undefined') module.exports = { pageLoad };
