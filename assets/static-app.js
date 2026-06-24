const state = {
  total: 12,
  offered: 9,
  bought: 4,
  revenue: 1520,
};

const formatRub = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

const scenarios = {
  bar: {
    guest: "Гость A",
    average: "1 100 ₽",
    context: "один за баром",
    likes: "IPA, закуски",
    goal: "добавить кухню к напитку",
    title: "Предложить: куриные крылья",
    reason: "Гость берет IPA. Крылья подходят к вкусу и могут увеличить чек на 350 ₽.",
    phrase: "К этому IPA хорошо зайдут крылья. Добавить порцию?",
    amount: 350,
  },
  cafe: {
    guest: "Гость B",
    average: "650 ₽",
    context: "обед в кафе",
    likes: "горячее блюдо, чай",
    goal: "добавить десерт к обеду",
    title: "Предложить: чизкейк",
    reason: "После обеда гостю легко предложить небольшой десерт. Это мягкая допродажа на 290 ₽.",
    phrase: "К чаю могу предложить чизкейк. Добавить кусочек?",
    amount: 290,
  },
  restaurant: {
    guest: "Гость C",
    average: "2 400 ₽",
    context: "компания 3+",
    likes: "мясо, общие закуски",
    goal: "поднять чек через общую позицию",
    title: "Предложить: сет закусок",
    reason: "Для компании общий сет удобнее, чем несколько отдельных закусок. Потенциальная допродажа 1 200 ₽.",
    phrase: "На компанию сет закусок будет удобнее. Поставить один на стол?",
    amount: 1200,
  },
  coffee: {
    guest: "Гость D",
    average: "390 ₽",
    context: "кофе с собой",
    likes: "капучино",
    goal: "добавить недорогую выпечку",
    title: "Предложить: круассан",
    reason: "К кофе хорошо подходит выпечка. Это простая допродажа на 180 ₽.",
    phrase: "К капучино взять круассан? Он свежий и хорошо подходит к кофе.",
    amount: 180,
  },
};

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

function renderScenario(name) {
  const scenario = scenarios[name];
  if (!scenario) {
    return;
  }

  document.querySelector("#guest-name").textContent = scenario.guest;
  document.querySelector("#guest-average").textContent = scenario.average;
  document.querySelector("#guest-context").textContent = scenario.context;
  document.querySelector("#guest-likes").textContent = scenario.likes;
  document.querySelector("#guest-goal").textContent = scenario.goal;
  document.querySelector("#recommendation-title").textContent = scenario.title;
  document.querySelector("#recommendation-reason").textContent = scenario.reason;
  document.querySelector("#recommendation-phrase").textContent = scenario.phrase;
  document.querySelector("#bought-button").dataset.amount = String(scenario.amount);
  document.querySelector("#status-line").textContent = "Нажми результат, чтобы увидеть, как меняются цифры владельца.";

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scenario === name);
  });
}

document.addEventListener("click", (event) => {
  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    renderScenario(scenarioButton.dataset.scenario);
    return;
  }

  const button = event.target.closest("[data-result]");
  if (!button) {
    return;
  }

  const result = button.dataset.result;
  const amount = Number(button.dataset.amount || 0);
  recordResult(result, amount);
});

renderScenario("bar");
renderMetrics();
window.__shamrockStaticReady = true;
