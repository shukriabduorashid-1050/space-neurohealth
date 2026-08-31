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

    co2: [
      1100,
      1150,
      1180,
      1200,
      1210,
      1190,
      1200
    ],

    radiation: [
      1.6,
      1.7,
      1.8,
      1.8,
      1.9,
      1.8,
      1.8
    ],

    pressure: [
      101.3,
      101.3,
      101.2,
      101.3,
      101.3,
      101.2,
      101.3
    ],

    temperature: [
      21.8,
      22.0,
      22.1,
      22.0,
      22.2,
      22.1,
      22.0
    ],

    humidity: [
      43,
      44,
      45,
      45,
      46,
      45,
      45
    ],

    wakefulness: [
      1,
      1.5,
      2,
      2.5,
      2,
      2,
      2
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

    co2: [
      1600,
      1900,
      2200,
      2500,
      2700,
      2800,
      2500
    ],

    radiation: [
      1.8,
      1.9,
      1.8,
      2.0,
      1.9,
      2.0,
      1.9
    ],

    pressure: [
      101.3,
      101.1,
      101.2,
      101.0,
      101.1,
      101.0,
      101.1
    ],

    temperature: [
      22,
      22.4,
      22.7,
      23,
      23.2,
      23,
      22.8
    ],

    humidity: [
      45,
      47,
      49,
      51,
      52,
      51,
      50
    ],

    wakefulness: [
      2,
      3,
      4,
      5,
      5,
      6,
      6
    ],

    performance: [
      240,
      246,
      253,
      262,
      271,
      279,
      275
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

    co2: [
      1150,
      1170,
      1160,
      1180,
      1190,
      1200,
      1210
    ],

    radiation: [
      1.7,
      1.7,
      1.8,
      1.7,
      1.8,
      1.8,
      1.8
    ],

    pressure: [
      101.3,
      101.3,
      101.3,
      101.3,
      101.2,
      101.3,
      101.3
    ],

    temperature: [
      22,
      22,
      22.1,
      22,
      22.1,
      22.2,
      22
    ],

    humidity: [
      44,
      44,
      45,
      45,
      45,
      46,
      45
    ],

    wakefulness: [
      8,
      10,
      12,
      14,
      16,
      18,
      20
    ],

    performance: [
      245,
      252,
      263,
      276,
      288,
      303,
      320
    ]
  }

};


/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = {

  baseline: {
    name: "Baseline",
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  elevated: {
    name: "Elevated",
    co2: 2500,
    radiation: 2.5,
    pressure: 99,
    temperature: 24,
    humidity: 55,
    wakefulness: 6
  },

  high: {
    name: "High",
    co2: 4000,
    radiation: 4,
    pressure: 95,
    temperature: 27,
    humidity: 65,
    wakefulness: 12
  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  activeScenario: "baseline",

  currentDatasetKey: "baseline",

  customDataset: null,

  environment: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  pvt: {
    running: false,
    ready: false,
    startTime: null,
    timer: null,
    trials: [],
    lapses: 0,
    falseStarts: 0
  },

  correlation: {
    r: null,
    lag: 0,
    n: 0
  }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}


function $all(selector) {
  return document.querySelectorAll(selector);
}


function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }

}


function formatNumber(value, digits = 2) {

  if (!Number.isFinite(Number(value))) {
    return "--";
  }

  return Number(value).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: digits
    }
  );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  $all(".nav-btn").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const target =
          button.dataset.section;

        if (!target) {
          return;
        }

        $all(".nav-btn").forEach(btn => {

          const active =
            btn === button;

          btn.classList.toggle(
            "active",
            active
          );

          btn.setAttribute(
            "aria-selected",
            String(active)
          );

        });


        $all(".section").forEach(section => {

          section.hidden =
            section.id !== target;

        });


        if (target === "analysis") {
          updateAnalysis();
        }

        if (target === "data") {
          updateDatasetInformation();
        }

      }
    );

  });

}


/* =========================================================
   SCENARIOS
   ========================================================= */

function setupScenarios() {

  $all(".scenario-btn").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const name =
          button.dataset.scenario;

        if (!SCENARIOS[name]) {
          return;
        }

        state.activeScenario =
          name;

        $all(".scenario-btn")
          .forEach(btn => {

            btn.classList.toggle(
              "active",
              btn === button
            );

          });

        applyScenario(
          SCENARIOS[name]
        );

      }
    );

  });

}


function applyScenario(scenario) {

  state.customDataset = null;

  state.currentDatasetKey =
    "baseline";

  Object.keys(
    state.environment
  ).forEach(key => {

    if (
      Object.prototype.hasOwnProperty
      .call(scenario, key)
    ) {

      state.environment[key] =
        Number(scenario[key]);

    }

  });


  syncControls();

  updateDashboard();

  updateChartsFromEnvironment();

  updateAnalysis();

  updateDatasetInformation();

}


/* =========================================================
   CONTROLS
   ========================================================= */

function setupControls() {

  const controlMap = {

    "co2-slider": "co2",
    "radiation-slider": "radiation",
    "pressure-slider": "pressure",
    "temperature-slider": "temperature",
    "humidity-slider": "humidity",
    "sleep-slider": "wakefulness"

  };


  Object.entries(controlMap)
    .forEach(([id, key]) => {

      const input =
        document.getElementById(id);

      if (!input) {
        return;
      }

      input.addEventListener(
        "input",
        () => {

          state.environment[key] =
            Number(input.value);

          state.customDataset = null;

          state.currentDatasetKey =
            "baseline";

          updateDashboard();

          updateChartsFromEnvironment();

          updateAnalysis();

        }
      );

    });

}


function syncControls() {

  const map = {

    "co2-slider": "co2",
    "radiation-slider": "radiation",
    "pressure-slider": "pressure",
    "temperature-slider": "temperature",
    "humidity-slider": "humidity",
    "sleep-slider": "wakefulness"

  };


  Object.entries(map)
    .forEach(([id, key]) => {

      const input =
        document.getElementById(id);

      if (!input) {
        return;
      }

      input.value =
        state.environment[key];

    });


  setText(
    "co2-slider-value",
    `${formatNumber(state.environment.co2, 0)} ppm`
  );

  setText(
    "radiation-value",
    formatNumber(
      state.environment.radiation,
      1
    )
  );

  setText(
    "pressure-value",
    formatNumber(
      state.environment.pressure,
      1
    )
  );

  setText(
    "temperature-value",
    formatNumber(
      state.environment.temperature,
      1
    )
  );

  setText(
    "humidity-value",
    formatNumber(
      state.environment.humidity,
      0
    )
  );

  setText(
    "sleep-value",
    formatNumber(
      state.environment.wakefulness,
      0
    )
  );

}


/* =========================================================
   PERFORMANCE MODEL
   ========================================================= */

function calculatePerformanceReference(environment) {

  const co2Effect =
    Math.max(
      0,
      environment.co2 - 1200
    ) / 3800 * 55;


  const radiationEffect =
    Math.max(
      0,
      environment.radiation - 1.8
    ) * 4;


  const temperatureEffect =
    Math.max(
      0,
      Math.abs(
        environment.temperature - 22
      ) - 1
    ) * 4;


  const humidityEffect =
    Math.max(
      0,
      Math.abs(
        environment.humidity - 45
      ) - 10
    ) * 0.4;


  const sleepEffect =
    Math.max(
      0,
      environment.wakefulness - 4
    ) * 3;


  return Math.round(
    Math.max(
      220,
      Math.min(
        360,
        240 +
        co2Effect +
        radiationEffect +
        temperatureEffect +
        humidityEffect +
        sleepEffect
      )
    )
  );

}


/* =========================================================
   RISK INDEX
   ========================================================= */

function clamp(value, min, max) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function calculateRiskComponents(environment) {

  return {

    co2: clamp(
      (
        environment.co2 - 1000
      ) /
      3000 *
      100,
      0,
      100
    ),

    radiation: clamp(
      (
        environment.radiation - 1.5
      ) /
      6 *
      100,
      0,
      100
    ),

    pressure: clamp(
      Math.abs(
        environment.pressure - 101.3
      ) /
      15 *
      100,
      0,
      100
    ),

    temperature: clamp(
      Math.abs(
        environment.temperature - 22
      ) /
      8 *
      100,
      0,
      100
    ),

    humidity: clamp(
      Math.abs(
        environment.humidity - 45
      ) /
      35 *
      100,
      0,
      100
    ),

    sleep: clamp(
      environment.wakefulness /
      20 *
      100,
      0,
      100
    )

  };

}


function calculateRiskIndex(environment) {

  const components =
    calculateRiskComponents(
      environment
    );


  const weights = {

    co2: 0.30,

    radiation: 0.20,

    pressure: 0.10,

    temperature: 0.15,

    humidity: 0.10,

    sleep: 0.15

  };


  const score =

    components.co2 *
      weights.co2 +

    components.radiation *
      weights.radiation +

    components.pressure *
      weights.pressure +

    components.temperature *
      weights.temperature +

    components.humidity *
      weights.humidity +

    components.sleep *
      weights.sleep;


  return {

    score: Math.round(score),

    components

  };

}


function getRiskState(score) {

  if (score < 30) {
    return {
      label: "Nominal",
      className: "safe-text"
    };
  }

  if (score < 60) {
    return {
      label: "Caution",
      className: ""
    };
  }

  return {
    label: "Elevated Risk",
    className: ""
  };

}


/* =========================================================
   DASHBOARD UPDATE
   ========================================================= */

function updateDashboard() {

  const env =
    state.environment;


  setText(
    "environment-value",
    formatNumber(env.co2, 0)
  );

  setText(
    "environment-unit",
    "ppm CO₂"
  );


  setText(
    "radiation-value",
    formatNumber(
      env.radiation,
      1
    )
  );

  setText(
    "pressure-value",
    formatNumber(
      env.pressure,
      1
    )
  );

  setText(
    "temperature-value",
    formatNumber(
      env.temperature,
      1
    )
  );

  setText(
    "humidity-value",
    formatNumber(
      env.humidity,
      0
    )
  );

  setText(
    "sleep-value",
    formatNumber(
      env.wakefulness,
      0
    )
  );


  const performance =
    calculatePerformanceReference(
      env
    );


  setText(
    "performance-value",
    formatNumber(
      performance,
      0
    )
  );


  setText(
    "performance-status",
    "Demonstration reference"
  );


  const difference =
    (
      (
        performance -
        240
      ) /
      240
    ) * 100;


  setText(
    "change-value",
    `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`
  );


  setText(
    "change-status",
    difference === 0
      ? "No change"
      : "Demonstration difference"
  );


  const risk =
    calculateRiskIndex(env);


  const riskState =
    getRiskState(
      risk.score
    );


  setText(
    "risk-value",
    String(risk.score)
  );

  setText(
    "risk-status",
    riskState.label
  );


  const riskStatus =
    $("#risk-status");

  if (riskStatus) {

    riskStatus.classList.remove(
      "safe-text"
    );

    if (riskState.className) {

      riskStatus.classList.add(
        riskState.className
      );

    }

  }


  updateRiskBars(
    risk
  );


  updateScienceInterpretation(
    risk.score
  );

}


function updateRiskBars(risk) {

  const map = {

    co2: [
      "risk-co2-bar",
      "risk-co2-score"
    ],

    radiation: [
      "risk-radiation-bar",
      "risk-radiation-score"
    ],

    pressure: [
      "risk-pressure-bar",
      "risk-pressure-score"
    ],

    temperature: [
      "risk-temperature-bar",
      "risk-temperature-score"
    ],

    humidity: [
      "risk-humidity-bar",
      "risk-humidity-score"
    ],

    sleep: [
      "risk-sleep-bar",
      "risk-sleep-score"
    ]

  };


  Object.entries(map)
    .forEach(([key, ids]) => {

      const value =
        Math.round(
          risk.components[key]
        );

      const bar =
        document.getElementById(
          ids[0]
        );

      const score =
        document.getElementById(
          ids[1]
        );

      if (bar) {
        bar.style.width =
          `${value}%`;
      }

      if (score) {
        score.textContent =
          String(value);
      }

    });


  setText(
    "risk-badge",
    getRiskState(risk.score)
      .label
      .toUpperCase()
  );

}


function updateScienceInterpretation(
  score
) {

  let title;
  let text;

  if (score < 30) {

    title =
      "Nominal demonstration environment";

    text =
      "The current simulated environmental profile remains within the prototype's nominal scoring range. The index is an analytical construct and does not represent a validated physiological risk estimate.";

  } else if (score < 60) {

    title =
      "Caution-range demonstration environment";

    text =
      "Several environmental parameters contribute to an elevated composite score. This interface is designed to identify patterns for investigation, not to diagnose or predict individual health outcomes.";

  } else {

    title =
      "Elevated-risk demonstration environment";

    text =
      "The combined simulated deviations produce a higher composite index. Validation against documented spaceflight datasets would be required before interpreting this score scientifically.";

  }


  setText(
    "science-title",
    title
  );

  setText(
    "science-text",
    text
  );

}


/* =========================================================
   BUILT-IN DATA LIBRARY
   ========================================================= */

function setupLibrary() {

  const loadButton =
    $("#load-demo-btn");

  const selector =
    $("#dataset-library");


  if (!loadButton || !selector) {
    return;
  }


  loadButton.addEventListener(
    "click",
    () => {

      loadDemoDataset(
        selector.value
      );

    }
  );

}


function loadDemoDataset(key) {

  const source =
    DEMO_DATASETS[key];

  if (!source) {
    return;
  }


  state.customDataset = null;

  state.currentDatasetKey =
    key;


  state.activeScenario =
    "baseline";


  state.environment.co2 =
    source.co2[
      source.co2.length - 1
    ];

  state.environment.radiation =
    source.radiation[
      source.radiation.length - 1
    ];

  state.environment.pressure =
    source.pressure[
      source.pressure.length - 1
    ];

  state.environment.temperature =
    source.temperature[
      source.temperature.length - 1
    ];

  state.environment.humidity =
    source.humidity[
      source.humidity.length - 1
    ];

  state.environment.wakefulness =
    source.wakefulness[
      source.wakefulness.length - 1
    ];


  syncControls();

  updateDashboard();

  updateDatasetInformation();

  updateCharts(
    source.labels,
    source.co2,
    source.performance
  );

  updateAnalysis();


  setText(
    "library-status",
    `${source.name} loaded successfully.`
  );

  setFileStatus(
    `${source.name} loaded locally.`
  );

}


/* =========================================================
   CHART ENGINE
   Native Canvas fallback-free rendering.
   ========================================================= */

const charts = {

  environment: null,

  performance: null

};


function getCanvasContext(id) {

  const canvas =
    document.getElementById(id);

  if (!canvas) {
    return null;
  }


  const rect =
    canvas.getBoundingClientRect();

  const ratio =
    window.devicePixelRatio || 1;


  const width =
    Math.max(
      300,
      Math.floor(rect.width)
    );


  const height =
    Math.max(
      220,
      Math.floor(rect.height)
    );


  canvas.width =
    width * ratio;

  canvas.height =
    height * ratio;


  const ctx =
    canvas.getContext("2d");

  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  return {
    canvas,
    ctx,
    width,
    height
  };

}


function drawChart(
  canvasId,
  labels,
  values,
  options
) {

  const chart =
    getCanvasContext(
      canvasId
    );

  if (!chart) {
    return;
  }


  const {
    ctx,
    width,
    height
  } = chart;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  if (
    !Array.isArray(values) ||
    values.length < 1
  ) {
    return;
  }


  const padding = {

    left: 55,

    right: 20,

    top: 25,

    bottom: 45

  };


  const plotWidth =
    width -
    padding.left -
    padding.right;


  const plotHeight =
    height -
    padding.top -
    padding.bottom;


  const min =
    Math.min(...values);

  const max =
    Math.max(...values);


  const range =
    max === min
      ? 1
      : max - min;


  const xStep =
    values.length === 1
      ? plotWidth
      : plotWidth /
        (values.length - 1);


  function x(index) {

    return (
      padding.left +
      index * xStep
    );

  }


  function y(value) {

    return (
      padding.top +
      plotHeight -
      (
        (
          value - min
        ) /
        range
      ) *
      plotHeight
    );

  }


  /* GRID */

  ctx.strokeStyle =
    "rgba(255,255,255,0.07)";

  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {

    const gy =
      padding.top +
      (
        plotHeight / 4
      ) * i;

    ctx.beginPath();

    ctx.moveTo(
      padding.left,
      gy
    );

    ctx.lineTo(
      width - padding.right,
      gy
    );

    ctx.stroke();

  }


  /* Y LABELS */

  ctx.fillStyle =
    "#8f9caf";

  ctx.font =
    "12px system-ui";

  ctx.textAlign =
    "right";

  for (let i = 0; i <= 4; i++) {

    const value =
      max -
      (
        range / 4
      ) * i;

    const gy =
      padding.top +
      (
        plotHeight / 4
      ) * i;

    ctx.fillText(
      Number(value)
        .toFixed(
          options.decimals ?? 0
        ),
      padding.left - 8,
      gy + 4
    );

  }


  /* AREA */

  ctx.beginPath();

  values.forEach(
    (value, index) => {

      const px =
        x(index);

      const py =
        y(value);

      if (index === 0) {
        ctx.moveTo(
          px,
          py
        );
      } else {
        ctx.lineTo(
          px,
          py
        );
      }

    }
  );


  ctx.lineTo(
    x(values.length - 1),
    padding.top +
    plotHeight
  );

  ctx.lineTo(
    x(0),
    padding.top +
    plotHeight
  );

  ctx.closePath();

  ctx.fillStyle =
    options.fill;

  ctx.fill();


  /* LINE */

  ctx.beginPath();

  values.forEach(
    (value, index) => {

      const px =
        x(index);

      const py =
        y(value);

      if (index === 0) {
        ctx.moveTo(
          px,
          py
        );
      } else {
        ctx.lineTo(
          px,
          py
        );
      }

    }
  );

  ctx.strokeStyle =
    options.line;

  ctx.lineWidth = 2.5;

  ctx.stroke();


  /* POINTS */

  values.forEach(
    (value, index) => {

      ctx.beginPath();

      ctx.arc(
        x(index),
        y(value),
        4,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        options.line;

      ctx.fill();

    }
  );


  /* X LABELS */

  ctx.fillStyle =
    "#8f9caf";

  ctx.font =
    "11px system-ui";

  ctx.textAlign =
    "center";


  labels.forEach(
    (label, index) => {

      if (
        labels.length > 8 &&
        index % 2 !== 0
      ) {
        return;
      }

      ctx.fillText(
        label,
        x(index),
        height - 17
      );

    }
  );

}


function updateCharts(
  labels,
  co2,
  performance
) {

  charts.environment = {
    labels,
    values: co2
  };

  charts.performance = {
    labels,
    values: performance
  };


  drawChart(
    "environmentChart",
    labels,
    co2,
    {
      line: "#51d7e8",
      fill: "rgba(81,215,232,0.10)",
      decimals: 0
    }
  );


  drawChart(
    "performanceChart",
    labels,
    performance,
    {
      line: "#4ea1ff",
      fill: "rgba(78,161,255,0.10)",
      decimals: 0
    }
  );

}


function updateChartsFromEnvironment() {

  const source =
    DEMO_DATASETS[
      state.currentDatasetKey
    ];


  if (
    state.customDataset
  ) {

    drawChart(
      "environmentChart",
      state.customDataset.labels,
      state.customDataset.values,
      {
        line: "#51d7e8",
        fill: "rgba(81,215,232,0.10)",
        decimals: 0
      }
    );

    drawChart(
      "performanceChart",
      state.customDataset.labels,
      state.customDataset.performance,
      {
        line: "#4ea1ff",
        fill: "rgba(78,161,255,0.10)",
        decimals: 0
      }
    );

    return;

  }


  if (source) {

    const co2 =
      source.co2.map(
        (value, index, array) => {

          const current =
            state.environment.co2;

          const sourceCurrent =
            array[array.length - 1];

          const offset =
            value -
            sourceCurrent;

          return Math.max(
            0,
            current + offset
          );

        }
      );


    const performance =
      co2.map(
        value =>
          calculatePerformanceReference({
            ...state.environment,
            co2: value
          })
      );


    updateCharts(
      source.labels,
      co2,
      performance
    );

  }

}


/* =========================================================
   ANALYSIS
   ========================================================= */

function getActiveDataset() {

  if (state.customDataset) {
    return state.customDataset;
  }


  return DEMO_DATASETS[
    state.currentDatasetKey
  ] ||
  DEMO_DATASETS.baseline;

}


function calculateStatistics(
  values
) {

  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {

    return {
      mean: 0,
      min: 0,
      max: 0,
      count: 0
    };

  }


  const clean =
    values.filter(
      Number.isFinite
    );


  if (!clean.length) {

    return {
      mean: 0,
      min: 0,
      max: 0,
      count: 0
    };

  }


  const sum =
    clean.reduce(
      (a, b) => a + b,
      0
    );


  return {

    mean:
      sum / clean.length,

    min:
      Math.min(...clean),

    max:
      Math.max(...clean),

    count:
      clean.length

  };

}


function calculateTrend(
  values
) {

  if (
    !values ||
    values.length < 2
  ) {
    return "Insufficient data";
  }


  const first =
    values[0];

  const last =
    values[
      values.length - 1
    ];


  const difference =
    last - first;


  const threshold =
    Math.max(
      1,
      Math.abs(first) * 0.01
    );


  if (
    difference > threshold
  ) {
    return "Increasing";
  }

  if (
    difference < -threshold
  ) {
    return "Decreasing";
  }

  return "Stable";

}


function updateAnalysis() {

  const dataset =
    getActiveDataset();


  const values =
    dataset.co2;


  const stats =
    calculateStatistics(
      values
    );


  setText(
    "mean-co2",
    `${formatNumber(stats.mean, 0)} ppm`
  );

  setText(
    "peak-co2",
    `${formatNumber(stats.max, 0)} ppm`
  );

  setText(
    "min-co2",
    `${formatNumber(stats.min, 0)} ppm`
  );

  setText(
    "data-points",
    String(stats.count)
  );


  setText(
    "trend-result",
    calculateTrend(values)
  );


  const difference =
    (
      (
        state.environment.co2 -
        1200
      ) /
      1200
    ) * 100;


  setText(
    "baseline-result",
    `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`
  );


  setText(
    "analysis-result",
    state.customDataset
      ? "User dataset"
      : "Demonstration"
  );


  const source =
    state.customDataset
      ? "Custom local dataset"
      : getActiveDataset().name;


  setText(
    "statistics-source",
    source
  );


  calculateCorrelation();

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
    return null;
  }


  const meanX =
    x.reduce(
      (a, b) => a + b,
      0
    ) /
    x.length;


  const meanY =
    y.reduce(
      (a, b) => a + b,
      0
    ) /
    y.length;


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


  if (
    denominator === 0
  ) {
    return null;
  }


  return (
    numerator /
    denominator
  );

}


function lagSeries(
  environment,
  performance,
  lag
) {

  if (
    lag < 0 ||
    lag >= environment.length
  ) {
    return {
      x: [],
      y: []
    };
  }


  const x = [];
  const y = [];


  for (
    let i = 0;
    i < environment.length - lag;
    i++
  ) {

    x.push(
      environment[i]
    );

    y.push(
      performance[i + lag]
    );

  }


  return {
    x,
    y
  };

}


function calculateCorrelation() {

  const dataset =
    getActiveDataset();


  const lag =
    Number(
      $("#lag-select")?.value || 0
    );


  const series =
    lagSeries(
      dataset.co2,
      dataset.performance,
      lag
    );


  const r =
    pearsonCorrelation(
      series.x,
      series.y
    );


  state.correlation = {

    r,

    lag,

    n: series.x.length

  };


  setText(
    "correlation-value",
    r === null
      ? "--"
      : r.toFixed(3)
  );


  setText(
    "correlation-lag",
    `${lag} h`
  );


  setText(
    "correlation-n",
    String(
      series.x.length
    )
  );


  let interpretation =
    "Insufficient data";


  if (r !== null) {

    const magnitude =
      Math.abs(r);


    if (magnitude < 0.20) {

      interpretation =
        "Very weak";

    } else if (
      magnitude < 0.40
    ) {

      interpretation =
        "Weak";

    } else if (
      magnitude < 0.70
    ) {

      interpretation =
        "Moderate";

    } else {

      interpretation =
        "Strong";

    }

    interpretation +=
      r < 0
        ? " negative association"
        : " positive association";

  }


  setText(
    "correlation-interpretation",
    interpretation
  );

}


function setupCorrelation() {

  const button =
    $("#calculate-correlation-btn");

  if (button) {

    button.addEventListener(
      "click",
      calculateCorrelation
    );

  }


  const select =
    $("#lag-select");

  if (select) {

    select.addEventListener(
      "change",
      calculateCorrelation
    );

  }

}


/* =========================================================
   CSV
   ========================================================= */

function setupCSV() {

  const browse =
    $("#browse-csv-btn");

  const input =
    $("#csv-file-input");

  const clear =
    $("#clear-csv-btn");

  const dropZone =
    $("#drop-zone");


  if (browse && input) {

    browse.addEventListener(
      "click",
      () => input.click()
    );


    input.addEventListener(
      "change",
      event => {

        const file =
          event.target.files?.[0];

        if (file) {
          processCSV(file);
        }

      }
    );

  }


  if (clear) {

    clear.addEventListener(
      "click",
      clearDataset
    );

  }


  if (dropZone) {

    [
      "dragenter",
      "dragover"
    ].forEach(
      eventName => {

        dropZone.addEventListener(
          eventName,
          event => {

            event.preventDefault();

            dropZone.classList.add(
              "drag-active"
            );

          }
        );

      }
    );


    [
      "dragleave",
      "drop"
    ].forEach(
      eventName => {

        dropZone.addEventListener(
          eventName,
          event => {

            event.preventDefault();

            dropZone.classList.remove(
              "drag-active"
            );

          }
        );

      }
    );


    dropZone.addEventListener(
      "drop",
      event => {

        const file =
          event.dataTransfer
            .files?.[0];

        if (file) {
          processCSV(file);
        }

      }
    );

  }

}


function processCSV(file) {

  if (
    !file.name
      .toLowerCase()
      .endsWith(".csv")
  ) {

    setFileStatus(
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
            String(
              event.target.result
            )
          );


        if (!parsed.success) {

          setFileStatus(
            parsed.message
          );

          return;

        }


        state.customDataset = {

          name:
            file.name,

          labels:
            parsed.labels,

          values:
            parsed.values,

          performance:
            parsed.performance,

          co2Column:
            parsed.co2Column,

          timeColumn:
            parsed.timeColumn

        };


        state.currentDatasetKey =
          null;


        state.environment.co2 =
          parsed.values[
            parsed.values.length - 1
          ];


        syncControls();

        updateDashboard();

        updateDatasetInformation();

        updateChartsFromEnvironment();

        updateAnalysis();


        const clear =
          $("#clear-csv-btn");

        if (clear) {
          clear.disabled = false;
        }


        setFileStatus(
          `Loaded ${file.name}: ${parsed.values.length} valid CO₂ values detected.`
        );

      } catch (error) {

        console.error(
          error
        );

        setFileStatus(
          "The CSV could not be processed."
        );

      }

    };


  reader.onerror =
    () => {

      setFileStatus(
        "The browser could not read this file."
      );

    };


  reader.readAsText(file);

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(text) {

  const rows =
    parseCSVRows(text);


  if (rows.length < 2) {

    return {

      success: false,

      message:
        "The CSV must contain a header row and at least one data row."

    };

  }


  const headers =
    rows[0].map(
      value =>
        value.trim()
    );


  const normalized =
    headers.map(
      value =>
        value
          .toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            ""
          )
    );


  let co2Index =
    findColumn(
      normalized,
      [
        "co2",
        "co2ppm",
        "co2concentration",
        "carbondioxide",
        "environment"
      ]
    );


  if (
    co2Index === -1
  ) {

    return {

      success: false,

      message:
        "No CO₂ column detected. Use CO2, CO2_ppm, carbon_dioxide, or environment."

    };

  }


  const timeIndex =
    findColumn(
      normalized,
      [
        "time",
        "date",
        "timestamp",
        "label"
      ]
    );


  const performanceIndex =
    findColumn(
      normalized,
      [
        "performance",
        "reactiontime",
        "reactiontimems",
        "rt"
      ]
    );


  const values = [];
  const labels = [];
  const performance = [];


  for (
    let i = 1;
    i < rows.length;
    i++
  ) {

    const row =
      rows[i];


    if (!row.length) {
      continue;
    }


    const value =
      parseFloat(
        String(
          row[co2Index]
        )
          .replace(/,/g, "")
          .trim()
      );


    if (
      !Number.isFinite(value)
    ) {
      continue;
    }


    values.push(
      value
    );


    if (
      timeIndex >= 0 &&
      row[timeIndex]
    ) {

      labels.push(
        row[timeIndex]
      );

    } else {

      labels.push(
        `Row ${values.length}`
      );

    }


    let performanceValue;


    if (
      performanceIndex >= 0
    ) {

      performanceValue =
        parseFloat(
          String(
            row[
              performanceIndex
            ]
          )
            .replace(/,/g, "")
            .trim()
        );

    }


    if (
      !Number.isFinite(
        performanceValue
      )
    ) {

      performanceValue =
        calculatePerformanceReference(
          {
            ...state.environment,
            co2: value
          }
        );

    }


    performance.push(
      performanceValue
    );

  }


  if (!values.length) {

    return {

      success: false,

      message:
        "The CO₂ column was found, but no numeric values were detected."

    };

  }


  return {

    success: true,

    values,

    labels,

    performance,

    co2Column:
      headers[co2Index],

    timeColumn:
      timeIndex >= 0
        ? headers[timeIndex]
        : "Not detected"

  };

}


function findColumn(
  headers,
  keywords
) {

  for (
    let i = 0;
    i < headers.length;
    i++
  ) {

    if (
      keywords.some(
        keyword =>
          headers[i].includes(
            keyword
          )
      )
    ) {

      return i;

    }

  }

  return -1;

}


function parseCSVRows(text) {

  const rows = [];

  let row = [];

  let cell = "";

  let quoted = false;


  for (
    let i = 0;
    i < text.length;
    i++
  ) {

    const char =
      text[i];

    const next =
      text[i + 1];


    if (
      char === '"' &&
      quoted &&
      next === '"'
    ) {

      cell += '"';

      i++;

      continue;

    }


    if (
      char === '"'
    ) {

      quoted =
        !quoted;

      continue;

    }


    if (
      char === "," &&
      !quoted
    ) {

      row.push(
        cell
      );

      cell = "";

      continue;

    }


    if (
      (
        char === "\n" ||
        char === "\r"
      ) &&
      !quoted
    ) {

      if (
        char === "\r" &&
        next === "\n"
      ) {

        i++;

      }


      row.push(
        cell
      );


      if (
        row.some(
          value =>
            value.trim() !== ""
        )
      ) {

        rows.push(
          row
        );

      }


      row = [];

      cell = "";

      continue;

    }


    cell += char;

  }


  if (
    cell !== "" ||
    row.length
  ) {

    row.push(
      cell
    );


    if (
      row.some(
        value =>
          value.trim() !== ""
      )
    ) {

      rows.push(
        row
      );

    }

  }


  return rows;

}


/* =========================================================
   DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

  const dataset =
    state.customDataset;


  if (!dataset) {

    const source =
      getActiveDataset();


    setText(
      "dataset-badge",
      "DEMONSTRATION"
    );

    setText(
      "dataset-name",
      source.name
    );

    setText(
      "dataset-rows",
      String(
        source.co2.length
      )
    );

    setText(
      "dataset-co2-column",
      "CO₂ simulation"
    );

    setText(
      "dataset-time-column",
      "labels"
    );

    setText(
      "dataset-validation",
      "Built-in simulated dataset"
    );


    const validation =
      $("#dataset-validation");

    if (validation) {

      validation.classList.add(
        "safe-text"
      );

    }


    return;

  }


  setText(
    "dataset-badge",
    "CUSTOM DATA"
  );

  setText(
    "dataset-name",
    dataset.name
  );

  setText(
    "dataset-rows",
    String(
      dataset.values.length
    )
  );

  setText(
    "dataset-co2-column",
    dataset.co2Column
  );

  setText(
    "dataset-time-column",
    dataset.timeColumn
  );

  setText(
    "dataset-validation",
    "Format validated locally"
  );


  const validation =
    $("#dataset-validation");

  if (validation) {

    validation.classList.add(
      "safe-text"
    );

  }

}


/* =========================================================
   CLEAR DATA
   ========================================================= */

function clearDataset() {

  const input =
    $("#csv-file-input");

  if (input) {
    input.value = "";
  }


  const clear =
    $("#clear-csv-btn");

  if (clear) {
    clear.disabled = true;
  }


  state.customDataset = null;

  state.currentDatasetKey =
    "baseline";


  loadDemoDataset(
    "baseline"
  );


  setFileStatus(
    "Custom dataset cleared. Demonstration dataset restored."
  );

}


/* =========================================================
   FILE STATUS
   ========================================================= */

function setFileStatus(
  message
) {

  const element =
    $("#file-status-msg");

  if (element) {
    element.textContent =
      message;
  }

}


/* =========================================================
   CSV TEMPLATE
   ========================================================= */

function setupTemplateDownload() {

  const button =
    $("#download-template-btn");

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    downloadCSVTemplate
  );

}


function downloadCSVTemplate() {

  const csv =
`time,CO2_ppm,performance_ms
T-6h,1100,235
T-5h,1150,238
T-4h,1180,240
T-3h,1200,242
T-2h,1210,244
T-1h,1190,241
Current,1200,240
`;


  downloadBlob(
    csv,
    "space-neurohealth-template.csv",
    "text/csv"
  );

}


/* =========================================================
   PVT
   ========================================================= */

function setupPVT() {

  const start =
    $("#pvt-start-btn");

  const reset =
    $("#pvt-reset-btn");

  const box =
    $("#pvt-box");


  if (start) {

    start.addEventListener(
      "click",
      startPVT
    );

  }


  if (reset) {

    reset.addEventListener(
      "click",
      resetPVT
    );

  }


  if (box) {

    box.addEventListener(
      "click",
      handlePVTClick
    );


    box.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          handlePVTClick();

        }

      }
    );

  }

}


function startPVT() {

  const pvt =
    state.pvt;


  if (
    pvt.running
  ) {
    return;
  }


  pvt.running =
    true;

  pvt.ready =
    false;

  pvt.startTime =
    null;


  const box =
    $("#pvt-box");

  const button =
    $("#pvt-start-btn");


  if (box) {

    box.classList.remove(
      "ready",
      "false-start"
    );

    box.textContent =
      "Wait for green...";

  }


  if (button) {
    button.disabled =
      true;
  }


  const delay =
    1500 +
    Math.random() * 3000;


  pvt.timer =
    setTimeout(
      makePVTReady,
      delay
    );

}


function makePVTReady() {

  const pvt =
    state.pvt;


  if (
    !pvt.running
  ) {
    return;
  }


  pvt.ready =
    true;

  pvt.startTime =
    performance.now();


  const box =
    $("#pvt-box");


  if (box) {

    box.classList.add(
      "ready"
    );

    box.textContent =
      "CLICK NOW";

  }

}


function handlePVTClick() {

  const pvt =
    state.pvt;


  if (
    !pvt.running
  ) {
    return;
  }


  if (
    !pvt.ready
  ) {

    if (pvt.timer) {

      clearTimeout(
        pvt.timer
      );

    }


    pvt.running =
      false;

    pvt.ready =
      false;

    pvt.falseStarts++;


    const box =
      $("#pvt-box");


    if (box) {

      box.classList.add(
        "false-start"
      );

      box.textContent =
        "False start — press Start Test";

    }


    const button =
      $("#pvt-start-btn");

    if (button) {
      button.disabled =
        false;
    }


    updatePVTResults();

    return;

  }


  const reactionTime =
    Math.round(
      performance.now() -
      pvt.startTime
    );


  pvt.trials.push(
    reactionTime
  );


  if (
    reactionTime >= 500
  ) {

    pvt.lapses++;

  }


  pvt.running =
    false;

  pvt.ready =
    false;


  const box =
    $("#pvt-box");


  if (box) {

    box.classList.remove(
      "ready"
    );

    box.textContent =
      `${reactionTime} ms — press Start Test for another trial`;

  }


  const button =
    $("#pvt-start-btn");

  if (button) {
    button.disabled =
      false;
  }


  updatePVTResults();

}


function calculateMedian(
  values
) {

  if (!values.length) {
    return null;
  }


  const sorted =
    [...values]
      .sort(
        (a, b) => a - b
      );


  const middle =
    Math.floor(
      sorted.length / 2
    );


  if (
    sorted.length % 2
  ) {

    return sorted[middle];

  }


  return (
    sorted[middle - 1] +
    sorted[middle]
  ) / 2;

}


function updatePVTResults() {

  const trials =
    state.pvt.trials;


  const count =
    trials.length;


  setText(
    "pvt-trials",
    String(count)
  );


  setText(
    "pvt-lapses",
    String(
      state.pvt.lapses
    )
  );


  setText(
    "pvt-false-starts",
    String(
      state.pvt.falseStarts
    )
  );


  if (!count) {

    setText(
      "pvt-score",
      "-- ms"
    );

    setText(
      "pvt-average",
      "-- ms"
    );

    setText(
      "pvt-rrt",
      "--"
    );

    setText(
      "pvt-best",
      "-- ms"
    );

    setText(
      "pvt-median",
      "-- ms"
    );

    return;

  }


  const last =
    trials[
      trials.length - 1
    ];


  const average =
    trials.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / count;


  const meanRRT =
    trials.reduce(
      (sum, value) =>
        sum +
        (
          1000 / value
        ),
      0
    ) / count;


  const best =
    Math.min(
      ...trials
    );


  const median =
    calculateMedian(
      trials
    );


  setText(
    "pvt-score",
    `${last} ms`
  );

  setText(
    "pvt-average",
    `${Math.round(average)} ms`
  );

  setText(
    "pvt-rrt",
    meanRRT.toFixed(3)
  );

  setText(
    "pvt-best",
    `${best} ms`
  );

  setText(
    "pvt-median",
    `${Math.round(median)} ms`
  );

}


function resetPVT() {

  const pvt =
    state.pvt;


  if (pvt.timer) {

    clearTimeout(
      pvt.timer
    );

  }


  pvt.running =
    false;

  pvt.ready =
    false;

  pvt.startTime =
    null;

  pvt.timer =
    null;

  pvt.trials =
    [];

  pvt.lapses =
    0;

  pvt.falseStarts =
    0;


  const box =
    $("#pvt-box");

  if (box) {

    box.classList.remove(
      "ready",
      "false-start"
    );

    box.textContent =
      "Press Start Test";

  }


  const button =
    $("#pvt-start-btn");

  if (button) {
    button.disabled =
      false;
  }


  updatePVTResults();

}


/* =========================================================
   EXPORT
   ========================================================= */

function setupExport() {

  const button =
    $("#export-btn");

  if (button) {

    button.addEventListener(
      "click",
      exportSummary
    );

  }

}


function exportSummary() {

  updateDashboard();

  updateAnalysis();

  updatePVTResults();


  const environment =
    state.environment;


  const risk =
    calculateRiskIndex(
      environment
    );


  const pvt =
    state.pvt;


  const meanRT =
    pvt.trials.length
      ? pvt.trials.reduce(
          (a, b) => a + b,
          0
        ) /
        pvt.trials.length
      : null;


  const meanRRT =
    pvt.trials.length
      ? pvt.trials.reduce(
          (sum, rt) =>
            sum + 1000 / rt,
          0
        ) /
        pvt.trials.length
      : null;


  const report =
`
SPACE NEUROHEALTH
Research Prototype Summary

==================================================

ACTIVE DATASET
${state.customDataset
  ? state.customDataset.name
  : getActiveDataset().name}

DATA SOURCE
${state.customDataset
  ? "User-provided local CSV"
  : "Built-in simulated dataset"}

==================================================

ENVIRONMENT

CO₂:
${formatNumber(environment.co2, 0)} ppm

Radiation:
${formatNumber(environment.radiation, 1)} mSv/day

Cabin Pressure:
${formatNumber(environment.pressure, 1)} kPa

Temperature:
${formatNumber(environment.temperature, 1)} °C

Humidity:
${formatNumber(environment.humidity, 0)} %

Continuous Wakefulness:
${formatNumber(environment.wakefulness, 0)} h

==================================================

ENVIRONMENT INDEX

Score:
${risk.score} / 100

State:
${getRiskState(risk.score).label}

Weights:
CO₂ 30%
Radiation 20%
Pressure 10%
Temperature 15%
Humidity 10%
Wakefulness 15%

==================================================

TIME-LAGGED CORRELATION

Pearson r:
${state.correlation.r === null
  ? "--"
  : state.correlation.r.toFixed(3)}

Lag:
${state.correlation.lag} hours

Sample size:
${state.correlation.n}

Interpretation:
${$("#correlation-interpretation")?.textContent || "--"}

==================================================

PVT ASSESSMENT

Trials:
${pvt.trials.length}

Last RT:
${pvt.trials.length
  ? pvt.trials[pvt.trials.length - 1] + " ms"
  : "--"}

Mean RT:
${meanRT === null
  ? "--"
  : Math.round(meanRT) + " ms"}

Mean RRT:
${meanRRT === null
  ? "--"
  : meanRRT.toFixed(3)}

Best RT:
${pvt.trials.length
  ? Math.min(...pvt.trials) + " ms"
  : "--"}

Median RT:
${pvt.trials.length
  ? Math.round(
      calculateMedian(
        pvt.trials
      )
    ) + " ms"
  : "--"}

Lapses ≥ 500 ms:
${pvt.lapses}

False starts < 150 ms:
${pvt.falseStarts}

==================================================

SCIENTIFIC LIMITATION

This report is generated by an interactive research
prototype. Demonstration datasets and simulated
relationships are not validated physiological
measurements. Correlation does not establish
causation.

==================================================
`;


  const shouldPrint =
    window.confirm(
      "Generate the Space NeuroHealth print-ready report?"
    );


  if (
    shouldPrint
  ) {

    window.print();

  }


  /*

    The browser print dialog allows:
    Save as PDF
    Print
    Destination selection

  */

}


/* =========================================================
   DOWNLOAD HELPER
   ========================================================= */

function downloadBlob(
  content,
  filename,
  type
) {

  const blob =
    new Blob(
      [content],
      { type }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;

  link.download =
    filename;


  document.body.appendChild(
    link
  );

  link.click();

  link.remove();


  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    1000
  );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function setupKeyboard() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        state.pvt.running
      ) {

        if (state.pvt.timer) {

          clearTimeout(
            state.pvt.timer
          );

        }


        state.pvt.running =
          false;

        state.pvt.ready =
          false;


        const box =
          $("#pvt-box");

        if (box) {

          box.classList.remove(
            "ready"
          );

          box.textContent =
            "Test cancelled — press Start Test";

        }


        const button =
          $("#pvt-start-btn");

        if (button) {

          button.disabled =
            false;

        }

      }

    }
  );

}


/* =========================================================
   RESIZE
   ========================================================= */

function setupResize() {

  let timeout;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        timeout
      );


      timeout =
        setTimeout(
          () => {

            updateChartsFromEnvironment();

          },
          120
        );

    }
  );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

  setupNavigation();

  setupScenarios();

  setupControls();

  setupLibrary();

  setupCorrelation();

  setupCSV();

  setupTemplateDownload();

  setupPVT();

  setupExport();

  setupKeyboard();

  setupResize();


  loadDemoDataset(
    "baseline"
  );


  updatePVTResults();

}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

     }
