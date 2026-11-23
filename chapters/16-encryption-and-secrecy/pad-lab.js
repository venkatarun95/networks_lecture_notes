function likelihoods(ciphertext, policy) {
  return Array.from({ length: 8 }, (_, message) => {
    const pad = ciphertext ^ message;
    const high = pad >> 2;
    const probability = policy === 'biased' ? (high ? 1 / 16 : 3 / 16) : 1 / 8;
    return { message, pad, probability };
  });
}

if (typeof document !== 'undefined') {
  const ciphertext = document.querySelector('#ciphertext');
  const policy = document.querySelector('#policy');
  const bits = value => value.toString(2).padStart(3, '0');
  for (let value = 0; value < 8; value += 1) {
    ciphertext.add(new Option(bits(value), value, value === 6, value === 6));
  }
  function render() {
    const table = document.querySelector('tbody');
    table.replaceChildren(...likelihoods(Number(ciphertext.value), policy.value).map(row => {
      const element = document.createElement('tr');
      element.insertCell().textContent = bits(row.message);
      element.insertCell().textContent = bits(row.pad);
      const fractions = { [1 / 8]: '1/8', [1 / 16]: '1/16', [3 / 16]: '3/16' };
      element.insertCell().textContent = fractions[row.probability];
      return element;
    }));
  }
  document.querySelector('main').addEventListener('change', render);
  render();
}

if (typeof module !== 'undefined') module.exports = { likelihoods };
