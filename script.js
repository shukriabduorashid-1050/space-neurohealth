/* =========================================================
   SPACE NEUROHEALTH
   FINAL APPLICATION JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const DEMO_DATASETS = {

  baseline: {
    name: "ISS Baseline Simulation",

    labels: [
      "T-6h",
      "T-5h",
      "T-4h",
      "T-3h",
      "T-2h",
      "T-1h",
      "Current"
    ],

    environment: [
      1100,
      1150,
      1180,
      1200,
      1210,
      1190,
      1200
    ],

    performance: [
      235,
      238,
      240,
      242,
      244,
      241,
      240
    ]
  },


  elevated: {
    name: "Elevated CO₂ Simulation",

    labels: [
      "T-6h",
      "T-5h",
      "T-4h",
      "T-3h",
      "T-2h",
      "T-1h",
      "Current"
    ],

    environment: [
      1400,
      1550,
      1700,
      1900,
      2100,
      2250,
      2400
    ],

    performance: [
      238,
      242,
      247,
      252,
      258,
      263,
      268
    ]
  },


  sleep: {
    name: "Sleep Deprivation Simulation",

    labels: [
      "T-6h",
      "T-5h",
      "T-4h",
      "T-3h",
      "T-2h",
      "T-1h",
      "Current"
    ],

    environment: [
      1150,
      1170,
      1180,
      1190,
      1200,
      1210,
      1220
    ],

    performance: [
      240,
      248,
      256,
      264,
      272,
      281,
      290
    ]
  }

};


/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = {

  baseline: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  elevated: {
    co2: 2200,
    radiation: 3.5,
    pressure: 98,
    temperature: 25,
    humidity: 60,
    wakefulness: 8
  },

  high: {
    co2: 4000,
    radiation: 6,
    pressure: 92,
    temperature: 28,
    humidity: 72,
    wakefulness: 16
  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  activeScenario: "baseline",

  activeDataset: "baseline",

  source: "demo",

  dataset: {
    name: DEMO_DATASETS.baseline.name,
    labels: [...DEMO_DATASETS.baseline.labels],
    environment: [...DEMO_DATASETS.baseline.environment],
    performance: [...DEMO_DATASETS.baseline.performance]
  },

  environment: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  risk: {
    components: {
      co2: 0,
      radiation: 0,
      pressure: 0,
      temperature: 0,
      humidity: 0,
      wakefulness: 0
    },

    total: 0
  },

  correlation: {
    lag: 0,
    r: null,
    n: 0
  },

  pvt: {
    running: false,
    waiting: false,
    ready: false,

    startTime: 0,
    timer: null,

    trials: [],
    lapses: 0,
    falseStarts: 0
  },

  charts: {
    environment: null,
    performance: null,
    correlation: null
  }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value, decimals = 0) {

  if (!Number.isFinite(value)) {
    return "--";
  }

  return Number(value).toLocaleString(
    undefined,
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  );
}

function average(values) {

  if (!values.length) {
    return NaN;
  }

  return values.reduce(
    (sum, value) => sum + value,
    0
  ) / values.length;
}

function median(values) {

  if (!values.length) {
    return NaN;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const middle = Math.floor(
    sorted.length / 2
  );

  if (sorted.length % 2 === 0) {
    return (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2;
  }

  return sorted[middle];
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {

  const sections =
    document.querySelectorAll(".section");

  const buttons =
    document.querySelectorAll(".nav-btn");

  sections.forEach(section => {

    section.hidden =
      section.id !== sectionId;

  });

  buttons.forEach(button => {

    const active =
      button.dataset.section === sectionId;

    button.classList.toggle(
      "active",
      active
    );

    button.setAttribute(
      "aria-selected",
      String(active)
    );

  });

  const mobileSelect =
    $("mobile-nav-select");

  if (mobileSelect) {
    mobileSelect.value = sectionId;
  }

  requestAnimationFrame(() => {
    resizeAllCharts();
  });
}


function initializeNavigation() {

  document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {
          showSection(
            button.dataset.section
          );
        }
      );

    });


  const mobileSelect =
    $("mobile-nav-select");

  if (mobileSelect) {

    mobileSelect.addEventListener(
      "change",
      () => {
        showSection(
          mobileSelect.value
        );
      }
    );

  }

}


/* =========================================================
   DATASET MANAGEMENT
   ========================================================= */

function loadDataset(datasetKey) {

  const dataset =
    DEMO_DATASETS[datasetKey];

  if (!dataset) {
    return;
  }

  state.activeDataset =
    datasetKey;

  state.source =
    "demo";

  state.dataset = {
    name: dataset.name,

    labels: [...dataset.labels],

    environment: [
      ...dataset.environment
    ],

    performance: [
      ...dataset.performance
    ]
  };

  updateDatasetUI();

  updateDashboard();

  updateStatistics();

  calculateCorrelation();

  drawAllCharts();

  const status =
    $("library-status");

  if (status) {

    status.textContent =
      `${dataset.name} loaded locally.`;

  }

  const badge =
    $("dataset-badge");

  if (badge) {
    badge.textContent =
      "DEMONSTRATION";
  }

  const clearButton =
    $("clear-csv-btn");

  if (clearButton) {
    clearButton.disabled = true;
  }

}


function updateDatasetUI() {

  const dataset =
    state.dataset;

  $("dataset-name").textContent =
    dataset.name;

  $("dataset-rows").textContent =
    dataset.environment.length;

  $("dataset-co2-column").textContent =
    state.source === "user"
      ? "co2_ppm"
      : "environment";

  $("dataset-time-column").textContent =
    state.source === "user"
      ? "timestamp"
      : "labels";

  $("dataset-validation").textContent =
    state.source === "user"
      ? "Validated locally"
      : "Demonstration dataset";

  $("statistics-source").textContent =
    state.source === "user"
      ? "User-supplied CSV dataset"
      : "Demonstration dataset";

  $("analysis-result").textContent =
    state.source === "user"
      ? "User supplied"
      : "Exploratory";

}


/* =========================================================
   ENVIRONMENT CONTROLS
   ========================================================= */

function readEnvironmentControls() {

  state.environment.co2 =
    Number($("co2-slider").value);

  state.environment.radiation =
    Number($("radiation-slider").value);

  state.environment.pressure =
    Number($("pressure-slider").value);

  state.environment.temperature =
    Number($("temperature-slider").value);

  state.environment.humidity =
    Number($("humidity-slider").value);

  state.environment.wakefulness =
    Number($("sleep-slider").value);

}


function updateEnvironmentLabels() {

  const env =
    state.environment;

  $("co2-slider-value").textContent =
    `${formatNumber(env.co2)} ppm`;

  $("radiation-value").textContent =
    env.radiation.toFixed(2);

  $("pressure-value").textContent =
    env.pressure.toFixed(1);

  $("temperature-value").textContent =
    env.temperature.toFixed(1);

  $("humidity-value").textContent =
    env.humidity.toFixed(0);

  $("sleep-value").textContent =
    env.wakefulness.toFixed(0);

}


function setEnvironmentControls(values) {

  $("co2-slider").value =
    values.co2;

  $("radiation-slider").value =
    values.radiation;

  $("pressure-slider").value =
    values.pressure;

  $("temperature-slider").value =
    values.temperature;

  $("humidity-slider").value =
    values.humidity;

  $("sleep-slider").value =
    values.wakefulness;

  readEnvironmentControls();

  updateEnvironmentLabels();

  updateDashboard();

}


function initializeEnvironmentControls() {

  const ids = [
    "co2-slider",
    "radiation-slider",
    "pressure-slider",
    "temperature-slider",
    "humidity-slider",
    "sleep-slider"
  ];

  ids.forEach(id => {

    const input = $(id);

    if (!input) {
      return;
    }

    input.addEventListener(
      "input",
      () => {

        readEnvironmentControls();

        updateEnvironmentLabels();

        updateDashboard();

      }
    );

  });

}


/* =========================================================
   SCENARIOS
   ========================================================= */

function initializeScenarios() {

  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const scenario =
            button.dataset.scenario;

          const values =
            SCENARIOS[scenario];

          if (!values) {
            return;
          }

          state.activeScenario =
            scenario;

          document
            .querySelectorAll(".scenario-btn")
            .forEach(item => {

              item.classList.toggle(
                "active",
                item === button
              );

            });

          setEnvironmentControls(
            values
          );

        }
      );

    });

}


/* =========================================================
   RISK MODEL
   ========================================================= */

/*
   These functions create bounded demonstration scores.

   They are intentionally presented as an interface construct,
   not as clinical or physiological thresholds.
*/

function calculateRiskComponents() {

  const env =
    state.environment;

  const co2Score =
    clamp(
      ((env.co2 - 800) / 3200) * 100,
      0,
      100
    );

  const radiationScore =
    clamp(
      (env.radiation / 8) * 100,
      0,
      100
    );

  const pressureScore =
    clamp(
      Math.abs(
        env.pressure - 101.3
      ) / 21.3 * 100,
      0,
      100
    );

  const temperatureScore =
    clamp(
      Math.abs(
        env.temperature - 22
      ) / 8 * 100,
      0,
      100
    );

  const humidityScore =
    clamp(
      Math.abs(
        env.humidity - 45
      ) / 35 * 100,
      0,
      100
    );

  const wakefulnessScore =
    clamp(
      (env.wakefulness / 24) * 100,
      0,
      100
    );

  return {

    co2: Math.round(co2Score),

    radiation:
      Math.round(radiationScore),

    pressure:
      Math.round(pressureScore),

    temperature:
      Math.round(temperatureScore),

    humidity:
      Math.round(humidityScore),

    wakefulness:
      Math.round(wakefulnessScore)

  };

}


function calculateEnvironmentalRisk() {

  const components =
    calculateRiskComponents();

  /*
     Demonstration weights:
     CO2          30%
     Radiation    20%
     Pressure     10%
     Temperature  15%
     Humidity     10%
     Wakefulness  15%
  */

  const total =
      components.co2 * 0.30
    + components.radiation * 0.20
    + components.pressure * 0.10
    + components.temperature * 0.15
    + components.humidity * 0.10
    + components.wakefulness * 0.15;

  state.risk.components =
    components;

  state.risk.total =
    Math.round(
      clamp(total, 0, 100)
    );

  return state.risk;
}


function updateRiskProfile() {

  const risk =
    calculateEnvironmentalRisk();

  const map = {

    co2: "risk-co2",
    radiation: "risk-radiation",
    pressure: "risk-pressure",
    temperature: "risk-temperature",
    humidity: "risk-humidity",
    wakefulness: "risk-sleep"

  };

  Object.keys(map).forEach(key => {

    const value =
      risk.components[key];

    const bar =
      $(`${map[key]}-bar`);

    const score =
      $(`${map[key]}-score`);

    if (bar) {
      bar.style.width =
        `${value}%`;
    }

    if (score) {
      score.textContent =
        value;
    }

  });


  $("risk-value").textContent =
    risk.total;


  let status =
    "Nominal";

  let badge =
    "NOMINAL";

  if (risk.total >= 60) {

    status =
      "Elevated";

    badge =
      "ELEVATED";

  } else if (risk.total >= 30) {

    status =
      "Caution";

    badge =
      "CAUTION";

  }


  $("risk-status").textContent =
    status;

  $("risk-badge").textContent =
    badge;


  $("risk-status").classList.toggle(
    "safe-text",
    risk.total < 30
  );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

  updateEnvironmentLabels();

  updateRiskProfile();

  const env =
    state.environment;

  $("environment-value").textContent =
    formatNumber(env.co2);

  const latestPerformance =
    state.dataset.performance[
      state.dataset.performance.length - 1
    ];

  $("performance-value").textContent =
    formatNumber(
      latestPerformance
    );


  if (env.co2 < 1500) {

    $("environment-status").textContent =
      "Nominal Demonstration";

    $("environment-status")
      .classList.add("safe-text");

  } else if (env.co2 < 3000) {

    $("environment-status").textContent =
      "Elevated Demonstration";

    $("environment-status")
      .classList.remove("safe-text");

  } else {

    $("environment-status").textContent =
      "High Demonstration";

    $("environment-status")
      .classList.remove("safe-text");

  }


  const baseline =
    DEMO_DATASETS.baseline.environment[
      DEMO_DATASETS.baseline.environment.length - 1
    ];

  const difference =
    ((env.co2 - baseline) / baseline) * 100;

  $("change-value").textContent =
    `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`;


  if (Math.abs(difference) < 0.1) {

    $("change-status").textContent =
      "No change from baseline.";

  } else if (difference > 0) {

    $("change-status").textContent =
      "Current CO₂ is above the demonstration baseline.";

  } else {

    $("change-status").textContent =
      "Current CO₂ is below the demonstration baseline.";

  }


  updateScienceInterpretation();

  updateStatistics();

  drawAllCharts();

}


function updateScienceInterpretation() {

  const risk =
    state.risk.total;

  if (risk < 30) {

    $("science-title").textContent =
      "Nominal demonstration condition";

    $("science-text").textContent =
      "The selected environmental parameters produce a low composite demonstration score. These values are interface references and should not be interpreted as validated physiological predictions.";

  } else if (risk < 60) {

    $("science-title").textContent =
      "Caution demonstration condition";

    $("science-text").textContent =
      "Several environmental parameters contribute to a higher composite demonstration score. The result is intended for exploratory analysis rather than clinical or operational decision-making.";

  } else {

    $("science-title").textContent =
      "Elevated demonstration condition";

    $("science-text").textContent =
      "The selected parameters produce a higher composite demonstration score. This prototype does not establish a medical, physiological, or operational risk prediction.";

  }

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

  const values =
    state.dataset.environment
      .filter(Number.isFinite);

  if (!values.length) {

    $("mean-co2").textContent =
      "--";

    $("peak-co2").textContent =
      "--";

    $("min-co2").textContent =
      "--";

    $("data-points").textContent =
      "0";

    return;
  }

  const mean =
    average(values);

  const peak =
    Math.max(...values);

  const minimum =
    Math.min(...values);

  $("mean-co2").textContent =
    `${formatNumber(mean)} ppm`;

  $("peak-co2").textContent =
    `${formatNumber(peak)} ppm`;

  $("min-co2").textContent =
    `${formatNumber(minimum)} ppm`;

  $("data-points").textContent =
    values.length;


  const first =
    values[0];

  const last =
    values[values.length - 1];

  let trend =
    "Stable";

  if (last > first + 5) {
    trend = "Increasing";
  } else if (last < first - 5) {
    trend = "Decreasing";
  }

  $("trend-result").textContent =
    trend;


  const baseline =
    DEMO_DATASETS.baseline.environment[
      DEMO_DATASETS.baseline.environment.length - 1
    ];

  const current =
    state.environment.co2;

  const offset =
    ((current - baseline) / baseline) * 100;

  $("baseline-result").textContent =
    `${offset >= 0 ? "+" : ""}${offset.toFixed(1)}%`;

}


/* =========================================================
   CANVAS UTILITIES
   ========================================================= */

function prepareCanvas(canvas) {

  if (!canvas) {
    return null;
  }

  const rect =
    canvas.getBoundingClientRect();

  const width =
    Math.max(
      1,
      Math.floor(rect.width)
    );

  const height =
    Math.max(
      1,
      Math.floor(rect.height)
    );

  const dpr =
    window.devicePixelRatio || 1;

  canvas.width =
    width * dpr;

  canvas.height =
    height * dpr;

  const ctx =
    canvas.getContext("2d");

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  return {
    ctx,
    width,
    height
  };

}


function drawGrid(
  ctx,
  width,
  height,
  padding
) {

  ctx.strokeStyle =
    "rgba(143,156,175,0.12)";

  ctx.lineWidth =
    1;

  const horizontalLines =
    4;

  for (
    let i = 0;
    i <= horizontalLines;
    i++
  ) {

    const y =
      padding.top +
      (
        (height -
          padding.top -
          padding.bottom) /
        horizontalLines
      ) * i;

    ctx.beginPath();

    ctx.moveTo(
      padding.left,
      y
    );

    ctx.lineTo(
      width - padding.right,
      y
    );

    ctx.stroke();

  }

}


function drawText(
  ctx,
  text,
  x,
  y,
  options = {}
) {

  ctx.fillStyle =
    options.color ||
    "#8f9caf";

  ctx.font =
    options.font ||
    "12px system-ui";

  ctx.textAlign =
    options.align ||
    "left";

  ctx.textBaseline =
    "middle";

  ctx.fillText(
    text,
    x,
    y
  );

}


/* =========================================================
   LINE CHART
   ========================================================= */

function drawLineChart(
  canvas,
  labels,
  values,
  unit
) {

  const prepared =
    prepareCanvas(canvas);

  if (!prepared) {
    return;
  }

  const {
    ctx,
    width,
    height
  } = prepared;

  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  if (
    !values ||
    values.length < 2
  ) {
    return;
  }


  const padding = {
    top: 25,
    right: 20,
    bottom: 38,
    left: 52
  };


  const min =
    Math.min(...values);

  const max =
    Math.max(...values);

  const range =
    max - min || 1;

  drawGrid(
    ctx,
    width,
    height,
    padding
  );


  const chartWidth =
    width -
    padding.left -
    padding.right;

  const chartHeight =
    height -
    padding.top -
    padding.bottom;


  /* Y labels */

  for (
    let i = 0;
    i <= 4;
    i++
  ) {

    const value =
      max -
      range *
      (i / 4);

    const y =
      padding.top +
      chartHeight *
      (i / 4);

    drawText(
      ctx,
      formatNumber(value),
      padding.left - 9,
      y,
      {
        align: "right"
      }
    );

  }


  /* X labels */

  labels.forEach(
    (label, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          (labels.length - 1)
        );

      drawText(
        ctx,
        label,
        x,
        height - 16,
        {
          align: "center"
        }
      );

    }
  );


  /* Line */

  ctx.beginPath();

  values.forEach(
    (value, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          (values.length - 1)
        );

      const y =
        padding.top +
        chartHeight *
        (
          (max - value) /
          range
        );

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

    }
  );


  ctx.strokeStyle =
    "#51d7e8";

  ctx.lineWidth =
    2.5;

  ctx.lineJoin =
    "round";

  ctx.lineCap =
    "round";

  ctx.stroke();


  /* Points */

  values.forEach(
    (value, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          (values.length - 1)
        );

      const y =
        padding.top +
        chartHeight *
        (
          (max - value) /
          range
        );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        3.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "#51d7e8";

      ctx.fill();

    }
  );


  drawText(
    ctx,
    unit,
    padding.left,
    12,
    {
      color: "#51d7e8",
      font: "700 11px system-ui"
    }
  );

}


function drawEnvironmentChart() {

  const canvas =
    $("environmentChart");

  const empty =
    $("environment-chart-empty");

  const values =
    state.dataset.environment;

  if (!values.length) {

    canvas.classList.add("hidden");

    empty.classList.remove("hidden");

    return;
  }

  canvas.classList.remove("hidden");

  empty.classList.add("hidden");

  drawLineChart(
    canvas,
    state.dataset.labels,
    values,
    "ppm"
  );

}


function drawPerformanceChart() {

  const canvas =
    $("performanceChart");

  const values =
    state.dataset.performance;

  if (!values.length) {
    return;
  }

  drawLineChart(
    canvas,
    state.dataset.labels,
    values,
    "ms"
  );

}


/* =========================================================
   PEARSON CORRELATION
   ========================================================= */

function pearsonCorrelation(
  x,
  y
) {

  if (
    x.length !== y.length ||
    x.length < 2
  ) {
    return NaN;
  }

  const meanX =
    average(x);

  const meanY =
    average(y);

  let numerator = 0;

  let denominatorX = 0;

  let denominatorY = 0;

  for (
    let i = 0;
    i < x.length;
    i++
  ) {

    const dx =
      x[i] - meanX;

    const dy =
      y[i] - meanY;

    numerator +=
      dx * dy;

    denominatorX +=
      dx * dx;

    denominatorY +=
      dy * dy;

  }

  const denominator =
    Math.sqrt(
      denominatorX *
      denominatorY
    );

  if (denominator === 0) {
    return NaN;
  }

  return numerator / denominator;

}


/* =========================================================
   LAGGED PAIRS
   ========================================================= */

function getLaggedPairs(
  environment,
  performance,
  lag
) {

  const env = [];
  const perf = [];

  /*
    Positive lag means environmental observations are shifted
    forward relative to the performance observations.
  */

  const maxLength =
    Math.min(
      environment.length,
      performance.length
    );

  for (
    let i = 0;
    i < maxLength - lag;
    i++
  ) {

    env.push(
      environment[i + lag]
    );

    perf.push(
      performance[i]
    );

  }

  return {
    environment: env,
    performance: perf
  };

}


/* =========================================================
   CORRELATION INTERPRETATION
   ========================================================= */

function interpretCorrelation(r) {

  if (!Number.isFinite(r)) {
    return "Insufficient variation";
  }

  const abs =
    Math.abs(r);

  let strength =
    "Weak";

  if (abs >= 0.8) {
    strength = "Very strong";
  } else if (abs >= 0.6) {
    strength = "Strong";
  } else if (abs >= 0.4) {
    strength = "Moderate";
  } else if (abs >= 0.2) {
    strength = "Weak";
  } else {
    strength = "Very weak";
  }

  if (r > 0.05) {
    return `${strength}, positive`;
  }

  if (r < -0.05) {
    return `${strength}, negative`;
  }

  return `${strength}, near-zero`;
}


/* =========================================================
   CORRELATION CALCULATION
   ========================================================= */

function calculateCorrelation() {

  const lag =
    Number(
      $("lag-select").value
    );

  const pairs =
    getLaggedPairs(
      state.dataset.environment,
      state.dataset.performance,
      lag
    );

  const r =
    pearsonCorrelation(
      pairs.environment,
      pairs.performance
    );

  state.correlation = {
    lag,
    r,
    n: pairs.environment.length
  };


  $("correlation-lag").textContent =
    `${lag} h`;

  $("correlation-n").textContent =
    pairs.environment.length;


  $("correlation-value").textContent =
    Number.isFinite(r)
      ? r.toFixed(3)
      : "--";


  $("correlation-interpretation").textContent =
    interpretCorrelation(r);


  $("visualizer-lag-label").textContent =
    `LAG ${lag} H`;


  drawCorrelationChart(
    pairs.environment,
    pairs.performance,
    lag
  );

}


/* =========================================================
   DUAL AXIS CORRELATION VISUALIZER
   ========================================================= */

function drawCorrelationChart(
  environment,
  performance,
  lag
) {

  const canvas =
    $("correlationChart");

  const empty =
    $("correlation-chart-empty");

  if (
    environment.length < 2 ||
    performance.length < 2
  ) {

    canvas.classList.add("hidden");

    empty.classList.remove("hidden");

    return;

  }

  canvas.classList.remove("hidden");

  empty.classList.add("hidden");


  const prepared =
    prepareCanvas(canvas);

  if (!prepared) {
    return;
  }

  const {
    ctx,
    width,
    height
  } = prepared;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  const padding = {
    top: 30,
    right: 60,
    bottom: 38,
    left: 60
  };


  const chartWidth =
    width -
    padding.left -
    padding.right;

  const chartHeight =
    height -
    padding.top -
    padding.bottom;


  const envMin =
    Math.min(...environment);

  const envMax =
    Math.max(...environment);

  const envRange =
    envMax - envMin || 1;


  const rtMin =
    Math.min(...performance);

  const rtMax =
    Math.max(...performance);

  const rtRange =
    rtMax - rtMin || 1;


  /* Grid */

  drawGrid(
    ctx,
    width,
    height,
    padding
  );


  /* Left axis labels */

  for (
    let i = 0;
    i <= 4;
    i++
  ) {

    const envValue =
      envMax -
      envRange *
      (i / 4);

    const rtValue =
      rtMax -
      rtRange *
      (i / 4);

    const y =
      padding.top +
      chartHeight *
      (i / 4);

    drawText(
      ctx,
      formatNumber(envValue),
      padding.left - 9,
      y,
      {
        align: "right",
        color: "#51d7e8"
      }
    );

    drawText(
      ctx,
      formatNumber(rtValue),
      width - padding.right + 9,
      y,
      {
        align: "left",
        color: "#4ea1ff"
      }
    );

  }


  /* X labels */

  const count =
    environment.length;

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const x =
      padding.left +
      chartWidth *
      (
        i /
        Math.max(count - 1, 1)
      );

    drawText(
      ctx,
      `T-${count - i - 1}`,
      x,
      height - 16,
      {
        align: "center"
      }
    );

  }


  /* CO₂ line */

  ctx.beginPath();

  environment.forEach(
    (value, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          Math.max(count - 1, 1)
        );

      const y =
        padding.top +
        chartHeight *
        (
          (envMax - value) /
          envRange
        );

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

    }
  );

  ctx.strokeStyle =
    "#51d7e8";

  ctx.lineWidth =
    2.5;

  ctx.lineJoin =
    "round";

  ctx.lineCap =
    "round";

  ctx.stroke();


  /* Reaction time line */

  ctx.beginPath();

  performance.forEach(
    (value, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          Math.max(count - 1, 1)
        );

      const y =
        padding.top +
        chartHeight *
        (
          (rtMax - value) /
          rtRange
        );

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

    }
  );

  ctx.strokeStyle =
    "#4ea1ff";

  ctx.lineWidth =
    2.5;

  ctx.stroke();


  /* Points */

  environment.forEach(
    (value, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          Math.max(count - 1, 1)
        );

      const y =
        padding.top +
        chartHeight *
        (
          (envMax - value) /
          envRange
        );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        3,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "#51d7e8";

      ctx.fill();

    }
  );


  performance.forEach(
    (value, index) => {

      const x =
        padding.left +
        chartWidth *
        (
          index /
          Math.max(count - 1, 1)
        );

      const y =
        padding.top +
        chartHeight *
        (
          (rtMax - value) /
          rtRange
        );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        3,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "#4ea1ff";

      ctx.fill();

    }
  );


  /* Axis titles */

  drawText(
    ctx,
    "CO₂ ppm",
    padding.left,
    12,
    {
      color: "#51d7e8",
      font: "700 11px system-ui"
    }
  );

  drawText(
    ctx,
    "RT ms",
    width - padding.right,
    12,
    {
      color: "#4ea1ff",
      font: "700 11px system-ui",
      align: "right"
    }
  );

}


/* =========================================================
   CHART RESIZING
   ========================================================= */

function drawAllCharts() {

  drawEnvironmentChart();

  drawPerformanceChart();

  calculateCorrelation();

}


function resizeAllCharts() {

  requestAnimationFrame(() => {

    drawEnvironmentChart();

    drawPerformanceChart();

    const lag =
      Number(
        $("lag-select")?.value || 0
      );

    const pairs =
      getLaggedPairs(
        state.dataset.environment,
        state.dataset.performance,
        lag
      );

    drawCorrelationChart(
      pairs.environment,
      pairs.performance,
      lag
    );

  });

}


function initializeChartResize() {

  let resizeTimer = null;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(
          resizeAllCharts,
          120
        );

    }
  );


  if (
    "ResizeObserver" in window
  ) {

    const containers =
      document.querySelectorAll(
        ".chart-container, .correlation-chart-container"
      );

    const observer =
      new ResizeObserver(
        () => {
          resizeAllCharts();
        }
      );

    containers.forEach(
      container => {
        observer.observe(container);
      }
    );

  }

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSVLine(line) {

  const result = [];

  let current = "";

  let insideQuotes =
    false;

  for (
    let i = 0;
    i < line.length;
    i++
  ) {

    const char =
      line[i];

    if (
      char === '"' &&
      line[i + 1] === '"'
    ) {

      current += '"';

      i++;

      continue;
    }

    if (char === '"') {

      insideQuotes =
        !insideQuotes;

      continue;
    }

    if (
      char === "," &&
      !insideQuotes
    ) {

      result.push(
        current.trim()
      );

      current = "";

      continue;
    }

    current += char;

  }

  result.push(
    current.trim()
  );

  return result;

}


function parseCSV(text) {

  const lines =
    text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter(
        line => line.trim().length > 0
      );

  if (lines.length < 2) {

    throw new Error(
      "The CSV must contain a header row and at least one data row."
    );

  }


  const headers =
    parseCSVLine(
      lines[0]
    ).map(
      header =>
        header.trim().toLowerCase()
    );


  const requiredHeaders = [
    "timestamp",
    "co2_ppm",
    "rt_ms"
  ];


  const missing =
    requiredHeaders.filter(
      required =>
        !headers.includes(required)
    );


  if (missing.length) {

    throw new Error(
      `Missing required column(s): ${missing.join(", ")}.`
    );

  }


  const timestampIndex =
    headers.indexOf("timestamp");

  const co2Index =
    headers.indexOf("co2_ppm");

  const rtIndex =
    headers.indexOf("rt_ms");


  const labels = [];

  const environment = [];

  const performance = [];


  for (
    let rowIndex = 1;
    rowIndex < lines.length;
    rowIndex++
  ) {

    const row =
      parseCSVLine(
        lines[rowIndex]
      );


    const timestamp =
      row[timestampIndex]?.trim();


    const co2Text =
      row[co2Index]?.trim();


    const rtText =
      row[rtIndex]?.trim();


    if (!timestamp) {

      throw new Error(
        `Row ${rowIndex + 1}: timestamp is missing.`
      );

    }


    const co2 =
      Number(co2Text);

    if (
      co2Text === "" ||
      !Number.isFinite(co2)
    ) {

      throw new Error(
        `Row ${rowIndex + 1}: co2_ppm must be numeric.`
      );

    }


    const rt =
      Number(rtText);

    if (
      rtText === "" ||
      !Number.isFinite(rt)
    ) {

      throw new Error(
        `Row ${rowIndex + 1}: rt_ms must be numeric.`
      );

    }


    if (co2 < 0) {

      throw new Error(
        `Row ${rowIndex + 1}: co2_ppm cannot be negative.`
      );

    }


    if (rt <= 0) {

      throw new Error(
        `Row ${rowIndex + 1}: rt_ms must be greater than zero.`
      );

    }


    labels.push(timestamp);

    environment.push(co2);

    performance.push(rt);

  }


  if (environment.length < 2) {

    throw new Error(
      "At least two valid observations are required."
    );

  }


  return {
    labels,
    environment,
    performance
  };

}


/* =========================================================
   CSV UPLOAD
   ========================================================= */

function handleCSVFile(file) {

  if (!file) {
    return;
  }


  const status =
    $("file-status-msg");


  if (
    !file.name
      .toLowerCase()
      .endsWith(".csv")
  ) {

    showFileError(
      "Please select a CSV file."
    );

    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    event => {

      try {

        const parsed =
          parseCSV(
            event.target.result
          );


        state.dataset = {

          name:
            file.name,

          labels:
            parsed.labels,

          environment:
            parsed.environment,

          performance:
            parsed.performance

        };


        state.source =
          "user";

        state.activeDataset =
          "custom";


        updateDatasetUI();

        updateDashboard();

        updateStatistics();

        calculateCorrelation();

        drawAllCharts();


        $("dataset-badge").textContent =
          "USER CSV";

        $("clear-csv-btn").disabled =
          false;


        status.textContent =
          `Validated successfully: ${parsed.environment.length} rows loaded from ${file.name}.`;

        status.className =
          "file-status success";


        $("library-status").textContent =
          "User-supplied CSV is now active.";

      }

      catch (error) {

        showFileError(
          error.message
        );

      }

    };


  reader.onerror =
    () => {

      showFileError(
        "The browser could not read this file."
      );

    };


  reader.readAsText(file);

}


function showFileError(message) {

  const status =
    $("file-status-msg");

  status.textContent =
    `CSV error: ${message}`;

  status.className =
    "file-status error";


  $("dataset-validation").textContent =
    "Validation failed";


  $("dataset-validation")
    .classList.remove(
      "safe-text"
    );

}


/* =========================================================
   CSV UI
   ========================================================= */

function initializeCSV() {

  const input =
    $("csv-file-input");

  const browse =
    $("browse-csv-btn");

  const dropZone =
    $("drop-zone");

  const clear =
    $("clear-csv-btn");

  const template =
    $("download-template-btn");


  browse.addEventListener(
    "click",
    () => {
      input.click();
    }
  );


  input.addEventListener(
    "change",
    () => {

      if (
        input.files &&
        input.files.length
      ) {

        handleCSVFile(
          input.files[0]
        );

      }

    }
  );


  dropZone.addEventListener(
    "dragover",
    event => {

      event.preventDefault();

      dropZone.classList.add(
        "drag-active"
      );

    }
  );


  dropZone.addEventListener(
    "dragleave",
    () => {

      dropZone.classList.remove(
        "drag-active"
      );

    }
  );


  dropZone.addEventListener(
    "drop",
    event => {

      event.preventDefault();

      dropZone.classList.remove(
        "drag-active"
      );


      const files =
        event.dataTransfer.files;


      if (
        files &&
        files.length
      ) {

        handleCSVFile(
          files[0]
        );

      }

    }
  );


  clear.addEventListener(
    "click",
    () => {

      loadDataset(
        "baseline"
      );

      input.value =
        "";

      $("file-status-msg").textContent =
        "Demonstration dataset restored.";

      $("file-status-msg").className =
        "file-status success";

      $("dataset-badge").textContent =
        "DEMONSTRATION";

      clear.disabled =
        true;

    }
  );


  template.addEventListener(
    "click",
    downloadCSVTemplate
  );

}


/* =========================================================
   CSV TEMPLATE
   ========================================================= */

function downloadCSVTemplate() {

  const csv = [
    "timestamp,co2_ppm,rt_ms",
    "T-6h,1100,235",
    "T-5h,1150,238",
    "T-4h,1180,240",
    "T-3h,1200,242",
    "T-2h,1210,244",
    "T-1h,1190,241",
    "Current,1200,240"
  ].join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement("a");

  link.href =
    url;

  link.download =
    "space-neurohealth-template.csv";

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(
    url
  );

}


/* =========================================================
   PVT
   ========================================================= */

function resetPVT() {

  clearTimeout(
    state.pvt.timer
  );

  state.pvt = {

    running: false,

    waiting: false,

    ready: false,

    startTime: 0,

    timer: null,

    trials: [],

    lapses: 0,

    falseStarts: 0

  };


  const box =
    $("pvt-box");

  box.className =
    "pvt-box";

  box.textContent =
    "Press Start Test";


  $("pvt-start-btn").disabled =
    false;

  updatePVTResults();

}


function startPVT() {

  if (state.pvt.running) {
    return;
  }


  state.pvt.running =
    true;

  state.pvt.waiting =
    true;

  state.pvt.ready =
    false;


  const box =
    $("pvt-box");

  box.className =
    "pvt-box";

  box.textContent =
    "Wait for the signal…";


  $("pvt-start-btn").disabled =
    true;


  const delay =
    1200 +
    Math.random() * 3000;


  state.pvt.timer =
    setTimeout(
      showPVTSignal,
      delay
    );

}


function showPVTSignal() {

  if (!state.pvt.running) {
    return;
  }


  state.pvt.waiting =
    false;

  state.pvt.ready =
    true;

  state.pvt.startTime =
    performance.now();


  const box =
    $("pvt-box");

  box.className =
    "pvt-box ready";

  box.textContent =
    "RESPOND";

}


/* =========================================================
   PVT RESPONSE
   ========================================================= */

function registerPVTResponse() {

  if (!state.pvt.running) {
    return;
  }


  const now =
    performance.now();


  /* False start */

  if (
    state.pvt.waiting
  ) {

    state.pvt.falseStarts++;

    const box =
      $("pvt-box");

    box.className =
      "pvt-box false-start";

    box.textContent =
      "False start — wait…";


    clearTimeout(
      state.pvt.timer
    );


    state.pvt.waiting =
      true;


    state.pvt.ready =
      false;


    state.pvt.timer =
      setTimeout(
        showPVTSignal,
        1200
      );


    updatePVTResults();

    return;

  }


  if (!state.pvt.ready) {
    return;
  }


  const reactionTime =
    Math.round(
      now -
      state.pvt.startTime
    );


  state.pvt.trials.push(
    reactionTime
  );


  if (reactionTime >= 500) {
    state.pvt.lapses++;
  }


  state.pvt.ready =
    false;


  state.pvt.waiting =
    true;


  const box =
    $("pvt-box");

  box.className =
    "pvt-box";

  box.textContent =
    `${reactionTime} ms — next trial`;


  updatePVTResults();


  state.pvt.timer =
    setTimeout(
      showPVTSignal,
      1200 +
      Math.random() * 3000
    );

}


function updatePVTResults() {

  const trials =
    state.pvt.trials;


  $("pvt-trials").textContent =
    trials.length;


  $("pvt-lapses").textContent =
    state.pvt.lapses;


  $("pvt-false-starts").textContent =
    state.pvt.falseStarts;


  if (!trials.length) {

    $("pvt-score").textContent =
      "-- ms";

    $("pvt-average").textContent =
      "-- ms";

    $("pvt-rrt").textContent =
      "--";

    $("pvt-best").textContent =
      "-- ms";

    $("pvt-median").textContent =
      "-- ms";

    return;

  }


  const last =
    trials[trials.length - 1];


  const mean =
    average(trials);


  const best =
    Math.min(...trials);


  const med =
    median(trials);


  const rrts =
    trials.map(
      value =>
        1000 / value
    );


  const meanRRT =
    average(rrts);


  $("pvt-score").textContent =
    `${formatNumber(last)} ms`;

  $("pvt-average").textContent =
    `${formatNumber(mean)} ms`;

  $("pvt-rrt").textContent =
    meanRRT.toFixed(3);

  $("pvt-best").textContent =
    `${formatNumber(best)} ms`;

  $("pvt-median").textContent =
    `${formatNumber(med)} ms`;

}


/* =========================================================
   PVT UI
   ========================================================= */

function initializePVT() {

  $("pvt-start-btn")
    .addEventListener(
      "click",
      startPVT
    );


  $("pvt-reset-btn")
    .addEventListener(
      "click",
      resetPVT
    );


  $("pvt-box")
    .addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        registerPVTResponse();

      }
    );


  $("pvt-box")
    .addEventListener(
      "keydown",
      event => {

        if (
          event.key === " " ||
          event.key === "Enter"
        ) {

          event.preventDefault();

          registerPVTResponse();

        }

      }
    );

}


/* =========================================================
   EXPORT
   ========================================================= */

function exportProjectSummary() {

  /*
    The print dialog creates a clean deliverable while
    preserving the application's live values.
  */

  showSection(
    "dashboard"
  );

  setTimeout(
    () => {

      window.print();

    },
    100
  );

}


function initializeExport() {

  $("export-btn")
    .addEventListener(
      "click",
      exportProjectSummary
    );

}


/* =========================================================
   CORRELATION UI
   ========================================================= */

function initializeCorrelation() {

  $("calculate-correlation-btn")
    .addEventListener(
      "click",
      calculateCorrelation
    );


  $("lag-select")
    .addEventListener(
      "change",
      calculateCorrelation
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApplication() {

  initializeNavigation();

  initializeEnvironmentControls();

  initializeScenarios();

  initializeCSV();

  initializePVT();

  initializeExport();

  initializeCorrelation();

  initializeChartResize();


  /*
    Start with the exact baseline environment.
  */

  setEnvironmentControls(
    SCENARIOS.baseline
  );


  loadDataset(
    "baseline"
  );


  resetPVT();


  showSection(
    "dashboard"
  );


  /*
    Extra delayed resize makes the charts reliable
    when the browser has just finished laying out the page.
  */

  setTimeout(
    resizeAllCharts,
    100
  );

  setTimeout(
    resizeAllCharts,
    500
  );

}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
  );

} else {

  initializeApplication();

}
