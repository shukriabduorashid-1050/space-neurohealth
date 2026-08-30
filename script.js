// script.js — UI logic for Space NeuroHealth prototype
(() => {
  'use strict';

  const DEMO_SCENARIOS = {
    baseline: { label: 'Baseline', color: '#3CB371', initialCO2: 1200, initialPerf: 240 },
    elevated: { label: 'Elevated', color: '#FFA500', initialCO2: 2500, initialPerf: 295 },
    high: { label: 'High Exposure', color: '#FF3B30', initialCO2: 5000, initialPerf: 380 }
  };

  const dom = {};
  let environmentChart = null;
  let performanceChart = null;
  let currentScenarioKey = 'baseline';

  function formatNumber(n) {
    return new Intl.NumberFormat().format(Math.round(n));
  }

  function generateDemoSeries(initialCo2, initialPerf, points = 8) {
    const labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const env = [];
    const perf = [];
    for (let i = 0; i < points; i++) {
      const noise = (Math.random() - 0.5) * 0.05;
      initialCo2 = initialCo2 * (1 + noise);
      initialPerf = initialPerf * (1 + noise / 1.5);
      env.push(Math.round(initialCo2));
      perf.push(Math.round(initialPerf));
    }
    return { labels, env, perf };
  }

  function createCharts(labels, envData, perfData, scenarioColor) {
    if (environmentChart) {
      environmentChart.data.labels = labels;
      environmentChart.data.datasets[0].data = envData;
      environmentChart.data.datasets[0].borderColor = scenarioColor;
      environmentChart.update();
    } else if (dom.environmentChartCtx) {
      environmentChart = new Chart(dom.environmentChartCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'CO₂ Level (ppm)',
            data: envData,
            borderColor: scenarioColor,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    if (performanceChart) {
      performanceChart.data.labels = labels;
      performanceChart.data.datasets[0].data = perfData;
      performanceChart.update();
    } else if (dom.performanceChartCtx) {
      performanceChart = new Chart(dom.performanceChartCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Reaction Time (ms)',
            data: perfData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  function updateMetricDisplays(envLatest, perfLatest, baselineEnv) {
    if (dom.environmentValue) dom.environmentValue.textContent = formatNumber(envLatest);
    if (dom.performanceValue) dom.performanceValue.textContent = formatNumber(perfLatest);
    const change = baselineEnv ? ((envLatest - baselineEnv) / baselineEnv) * 100 : 0;
    if (dom.changeValue) dom.changeValue.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  }

  function onNavClick(e) {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    const section = btn.dataset.section;
    if (!section) return;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.section').forEach(s => s.classList.toggle('active-section', s.id === section));
  }

  function onScenarioClick(e) {
    const btn = e.target.closest('.scenario-btn');
    if (!btn) return;
    const key = btn.dataset.scenario;
    if (!DEMO_SCENARIOS[key]) return;
    currentScenarioKey = key;
    document.querySelectorAll('.scenario-btn').forEach(b => b.classList.toggle('active', b === btn));
    const cfg = DEMO_SCENARIOS[key];
    const { labels, env, perf } = generateDemoSeries(cfg.initialCO2, cfg.initialPerf);
    createCharts(labels, env, perf, cfg.color);
    updateMetricDisplays(env[env.length - 1], perf[perf.length - 1], DEMO_SCENARIOS.baseline.initialCO2);
  }

  function cacheDom() {
    dom.environmentValue = document.getElementById('environment-value');
    dom.performanceValue = document.getElementById('performance-value');
    dom.changeValue = document.getElementById('change-value');
    
    const envEl = document.getElementById('environmentChart');
    if (envEl) dom.environmentChartCtx = envEl.getContext('2d');
    
    const perfEl = document.getElementById('performanceChart');
    if (perfEl) dom.performanceChartCtx = perfEl.getContext('2d');
  }

  function init() {
    cacheDom();
    document.addEventListener('click', onNavClick);
    document.addEventListener('click', onScenarioClick);

    const cfg = DEMO_SCENARIOS[currentScenarioKey];
    const { labels, env, perf } = generateDemoSeries(cfg.initialCO2, cfg.initialPerf);
    createCharts(labels, env, perf, cfg.color);
    updateMetricDisplays(env[env.length - 1], perf[perf.length - 1], DEMO_SCENARIOS.baseline.initialCO2);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
