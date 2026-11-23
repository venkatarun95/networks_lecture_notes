function simulateIncident(budget = 90) {
  const capacityByInterval = [100, 100, 40, 40, 100, 100, 100, 100, 100];
  const fresh = 70;
  let missed = 0;
  return capacityByInterval.map((capacity, interval) => {
    const allowed = interval >= 6 ? budget : 90;
    const retries = Math.min(allowed, 2 * missed);
    const useful = Math.min(fresh, capacity - Math.min(capacity, retries));
    missed = fresh - useful;
    return { interval, capacity, fresh, retries, useful };
  });
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const budget = Number(form.elements.namedItem('budget').value);
    const rows = simulateIncident(budget);
    document.querySelector('tbody').replaceChildren(...rows.map(row => {
      const element = document.createElement('tr');
      for (const value of Object.values(row)) element.insertCell().textContent = value;
      return element;
    }));
    const recovered = rows.find(row => row.interval >= 4 && row.useful === row.fresh);
    document.querySelector('output').textContent = recovered ?
      `All fresh requests meet the deadline again in interval ${recovered.interval}.` :
      'Useful responses remain below fresh demand through interval 8.';
  });
  form.requestSubmit();
}

if (typeof module !== 'undefined') module.exports = { simulateIncident };
