const state = {
  total: 12,
  offered: 9,
  bought: 4,
  revenue: 1520,
  average: 380,
};

const formatRub = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

function renderMetrics() {
  const conversion = state.offered === 0 ? 0 : Math.round((state.bought / state.offered) * 100);
  const average = state.bought === 0 ? 0 : Math.round(state.revenue / state.bought);

  document.querySelector("#metric-total").textContent = state.total;
  document.querySelector("#metric-offered").textContent = state.offered;
  document.querySelector("#metric-bought").textContent = state.bought;
  document.querySelector("#metric-conversion").textContent = `${conversion}%`;
  document.querySelector("#metric-revenue").textContent = formatRub(state.revenue);
  document.querySelector("#metric-average").textContent = formatRub(average);
}

function recordResult(result, amount) {
  state.total += 1;

  if (result === "offered" || result === "bought" || result === "rejected") {
    state.offered += 1;
  }

  if (result === "bought") {
    state.bought += 1;
    state.revenue += amount;
  }

  const messages = {
    offered: "Записано: бармен предложил позицию.",
    bought: `Записано: гость купил, допродажа ${formatRub(amount)}.`,
    rejected: "Записано: гость отказался.",
    not_offered: "Записано: бармен не предложил. Это видно владельцу.",
  };

  document.querySelector("#status-line").textContent = messages[result];
  renderMetrics();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-result]");
  if (!button) {
    return;
  }

  const result = button.dataset.result;
  const amount = Number(button.dataset.amount || 0);
  recordResult(result, amount);
});

renderMetrics();
window.__shamrockStaticReady = true;
