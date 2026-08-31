/* =========================================================
   SPACE NEUROHEALTH
   FINAL APPLICATION JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const DEMO_DATA = {

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
  ],

  radiation: [
    1.4,
    1.5,
    1.6,
    1.7,
    1.8,
    1.8,
    1.8
  ],

  temperature: [
    21.5,
    21.8,
    22,
    22.1,
    22,
    22,
    22
  ],

  humidity: [
    42,
    43,
    44,
    45,
    45,
    45,
    45
  ],

  pressure: [
    101.3,
    101.2,
    101.3,
    101.3,
    101.4,
    101.3,
    101.3
  ],

  wakefulness: [
    1,
    1.2,
    1.5,
    1.7,
    1.8,
    2,
    2
  ],

  circadian: [
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]

};


/* =========================================================
   LOCAL BENCHMARK DATASETS
   No external library required.
   ========================================================= */

const BENCHMARK_DATASETS = {

  iss: {

    name: "ISS Environment — Simulated Benchmark",

    labels: [
      "T-7h",
      "T-6h",
      "T-5h",
      "T-4h",
      "T-3h",
      "T-2h",
      "T-1h",
      "Current"
    ],

    environment: [
      1050,
      1120,
      1180,
      1260,
      1320,
      1380,
      1350,
      1410
    ],

    performance: [
      235,
      237,
      239,
      241,
      244,
      247,
      249,
      252
    ],

    radiation: [
      1.2,
      1.3,
      1.4,
      1.5,
      1.6,
      1.7,
      1.8,
      1.9
    ],

    temperature: [
      21.5,
      21.6,
      21.8,
      21.9,
      22,
      22,
      22.1,
      22.1
    ],

    humidity: [
      41,
      42,
      43,
      44,
      45,
      45,
      46,
      46
    ],

    pressure: [
      101.3,
      101.3,
      101.2,
      101.3,
      101.3,
      101.2,
      101.3,
      101.3
    ],

    wakefulness: [
      1,
      2,
      2.5,
      3,
      3.5,
      4,
      4.5,
      5
    ],

    circadian: [
      0,
      0.1,
      0.2,
      0.3,
      0.4,
      0.5,
      0.6,
      0.7
    ]

  },


  sleep: {

    name: "Sleep / Wakefulness — Simulated Benchmark",

    labels: [
      "T-7h",
      "T-6h",
      "T-5h",
      "T-4h",
      "T-3h",
      "T-2h",
      "T-1h",
      "Current"
    ],

    environment: [
      900,
      950,
      1000,
      1100,
      1150,
      1200,
      1250,
      1300
    ],

    performance: [
      225,
      230,
      235,
      242,
      250,
      258,
      268,
      278
    ],

    radiation: [
      1.2,
      1.2,
      1.2,
      1.2,
      1.2,
      1.2,
      1.2,
      1.2
    ],

    temperature: [
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22
    ],

    humidity: [
      43,
      43,
      44,
      44,
      45,
      45,
      45,
      46
    ],

    pressure: [
      101.3,
      101.3,
      101.3,
      101.3,
      101.3,
      101.3,
      101.3,
      101.3
    ],

    wakefulness: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],

    circadian: [
      0,
      0.2,
      0.4,
      0.6,
      0.8,
      1,
      1.2,
      1.4
    ]

  },


  combined: {

    name: "Combined Mission — Simulated Benchmark",

    labels: [
      "T-8h",
      "T-7h",
      "T-6h",
      "T-5h",
      "T-4h",
      "T-3h",
      "T-2h",
      "T-1h",
      "Current"
    ],

    environment: [
      1050,
      1100,
      1160,
      1230,
      1320,
      1450,
      1580,
      1700,
      1820
    ],

    performance: [
      230,
      232,
      235,
      239,
      244,
      250,
      258,
      266,
      275
    ],

    radiation: [
      1.2,
      1.3,
      1.4,
      1.5,
      1.7,
      1.8,
      2,
      2.1,
      2.2
    ],

    temperature: [
      21.5,
      21.6,
      21.8,
      22,
      22.2,
      22.3,
      22.5,
      22.6,
      22.8
    ],

    humidity: [
      40,
      41,
      42,
      43,
      44,
      45,
      47,
      48,
      49
    ],

    pressure: [
      101.3,
      101.3,
      101.2,
      101.3,
      101.2,
      101.2,
      101.1,
      101.1,
      101
    ],

    wakefulness: [
      1,
      1.5,
      2,
      2.5,
      3,
      4,
      5,
      6,
      7
    ],

    circadian: [
      0,
      0.1,
      0.2,
      0.3,
      0.4,
      0.5,
      0.7,
      0.9,
      1.1
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
    performance: 240,
    radiation: 1.8,
    temperature: 22,
    humidity: 45,
    pressure: 101.3,
    wakefulness: 2,
    circadian: 0,
    status: "Nominal Demonstration",
    statusClass: "safe-text",
    interpretationTitle:
      "Baseline environmental condition",
    interpretationText:
      "This demonstration represents a baseline environmental condition. The simulated performance value is an interface reference and is not a validated physiological model."
  },

  elevated: {
    name: "Elevated",
    co2: 2500,
    performance: 275,
    radiation: 2.4,
    temperature: 24,
    humidity: 55,
    pressure: 100.5,
    wakefulness: 5,
    circadian: 1.2,
    status: "Elevated Demonstration",
    statusClass: "warning-text",
    interpretationTitle:
      "Elevated demonstration condition",
    interpretationText:
      "The simulator represents a higher environmental measurement. The associated performance value is illustrative and should not be interpreted as evidence of a physiological effect."
  },

  high: {
    name: "High",
    co2: 4000,
    performance: 330,
    radiation: 3.5,
    temperature: 27,
    humidity: 65,
    pressure: 99.5,
    wakefulness: 8,
    circadian: 2,
    status: "High Demonstration",
    statusClass: "danger-text",
    interpretationTitle:
      "High demonstration condition",
    interpretationText:
      "This scenario represents a substantially elevated demonstration value. A validated dataset and documented scientific model would be required before drawing conclusions about human performance."
  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  activeScenario: "baseline",

  currentCO2: 1200,

  customDataset: null,

  activeDataset: {
    ...DEMO_DATA,
    name: "Built-in demonstration data"
  },

  correlation: {
    lag: 3,
    r: null,
    n: 0,
    interpretation: "Awaiting data"
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

  charts: {

    environment: null,

    performance: null

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


function formatNumber(value) {

  if (!Number.isFinite(Number(value))) {
    return "--";
  }

  return Number(value).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 2
    }
  );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  const buttons =
    $all(".nav-btn");

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const sectionId =
          button.dataset.section;

        if (!sectionId) {
          return;
        }

        buttons.forEach(btn => {

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


        $all(".section").forEach(
          section => {

            const active =
              section.id === sectionId;

            section.hidden =
              !active;

            section.classList.toggle(
              "active-section",
              active
            );

          }
        );


        if (sectionId === "analysis") {
          updateAnalysis();
        }

        if (sectionId === "data") {
          updateDatasetInformation();
        }


        resizeCharts();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  });

}


/* =========================================================
   SCENARIOS
   ========================================================= */

function setupScenarios() {

  $all(".scenario-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const scenarioName =
            button.dataset.scenario;

          if (!SCENARIOS[scenarioName]) {
            return;
          }

          state.activeScenario =
            scenarioName;

          state.customDataset =
            null;

          state.activeDataset = {
            ...DEMO_DATA,
            name:
              "Built-in demonstration data"
          };

          $all(".scenario-btn")
            .forEach(btn => {

              btn.classList.toggle(
                "active",
                btn === button
              );

            });

          applyScenario(
            SCENARIOS[scenarioName]
          );

        }
      );

    });

}


/* =========================================================
   SCENARIO APPLICATION
   ========================================================= */

function applyScenario(scenario) {

  state.currentCO2 =
    scenario.co2;

  const slider =
    $("#co2-slider");

  if (slider) {
    slider.value =
      scenario.co2;
  }


  setText(
    "co2-slider-value",
    `${formatNumber(scenario.co2)} ppm`
  );

  setText(
    "environment-value",
    formatNumber(scenario.co2)
  );

  setText(
    "environment-unit",
    "ppm CO₂"
  );

  setText(
    "environment-status",
    scenario.status
  );


  const status =
    $("#environment-status");

  if (status) {

    status.classList.remove(
      "safe-text",
      "warning-text",
      "danger-text"
    );

    if (scenario.statusClass) {

      status.classList.add(
        scenario.statusClass
      );

    }

  }


  setText(
    "performance-value",
    formatNumber(
      scenario.performance
    )
  );


  setText(
    "performance-status",
    "Demonstration reference"
  );


  setText(
    "radiation-value",
    `${scenario.radiation} mSv/day`
  );

  setText(
    "temperature-value",
    `${scenario.temperature} °C`
  );

  setText(
    "humidity-value",
    `${scenario.humidity} %`
  );

  setText(
    "pressure-value",
    `${scenario.pressure} kPa`
  );

  setText(
    "wake-value",
    `${scenario.wakefulness} h`
  );

  setText(
    "circadian-value",
    `${scenario.circadian} h`
  );


  const baselineDifference =
    (
      (scenario.performance -
        SCENARIOS.baseline.performance)
      /
      SCENARIOS.baseline.performance
    ) * 100;


  setText(
    "change-value",
    `${baselineDifference >= 0 ? "+" : ""}${baselineDifference.toFixed(1)}%`
  );


  setText(
    "change-status",
    baselineDifference === 0
      ? "No change"
      : "Demonstration difference"
  );


  setText(
    "science-title",
    scenario.interpretationTitle
  );

  setText(
    "science-text",
    scenario.interpretationText
  );


  updateEnvironmentIndex();

  updateEnvironmentChartForScenario();

  updateAnalysis();

}


/* =========================================================
   SLIDER
   ========================================================= */

function setupSlider() {

  const slider =
    $("#co2-slider");

  if (!slider) {
    return;
  }


  slider.addEventListener(
    "input",
    () => {

      const value =
        Number(slider.value);

      state.currentCO2 =
        value;

      state.customDataset =
        null;

      setText(
        "co2-slider-value",
        `${formatNumber(value)} ppm`
      );

      setText(
        "environment-value",
        formatNumber(value)
      );

      updateFromSlider(value);

    }
  );

}


function updateFromSlider(value) {

  let performance;


  if (value <= 1200) {

    performance =
      240 -
      ((value - 400) / 800) * 5;

  } else {

    performance =
      240 +
      ((value - 1200) / 3800) * 110;

  }


  performance =
    Math.round(
      Math.max(
        220,
        Math.min(
          360,
          performance
        )
      )
    );


  setText(
    "performance-value",
    formatNumber(performance)
  );


  const baselineDifference =
    (
      (performance -
        SCENARIOS.baseline.performance)
      /
      SCENARIOS.baseline.performance
    ) * 100;


  setText(
    "change-value",
    `${baselineDifference >= 0 ? "+" : ""}${baselineDifference.toFixed(1)}%`
  );


  let statusText;
  let statusClass;


  if (value <= 1500) {

    statusText =
      "Nominal Demonstration";

    statusClass =
      "safe-text";

  } else if (value <= 3000) {

    statusText =
      "Elevated Demonstration";

    statusClass =
      "warning-text";

  } else {

    statusText =
      "High Demonstration";

    statusClass =
      "danger-text";

  }


  setText(
    "environment-status",
    statusText
  );


  const status =
    $("#environment-status");

  if (status) {

    status.classList.remove(
      "safe-text",
      "warning-text",
      "danger-text"
    );

    status.classList.add(
      statusClass
    );

  }


  setText(
    "science-title",
    "Interactive environmental adjustment"
  );


  setText(
    "science-text",
    "The slider changes the demonstration environmental value and a simulated performance indicator. These relationships are illustrative and are not validated physiological predictions."
  );


  updateEnvironmentIndex();

  updateAnalysis();

}


/* =========================================================
   ENVIRONMENT INDEX
   ========================================================= */

function clamp(
  value,
  minimum,
  maximum
) {

  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );

}


function normalizeDeviation(
  value,
  reference,
  scale
) {

  return clamp(
    Math.abs(value - reference) /
      scale *
      100,
    0,
    100
  );

}


function calculateEnvironmentIndex() {

  const scenario =
    SCENARIOS[
      state.activeScenario
    ];


  let radiation =
    scenario
      ? scenario.radiation
      : 1.8;

  let temperature =
    scenario
      ? scenario.temperature
      : 22;

  let humidity =
    scenario
      ? scenario.humidity
      : 45;

  let pressure =
    scenario
      ? scenario.pressure
      : 101.3;

  let wakefulness =
    scenario
      ? scenario.wakefulness
      : 2;


  if (state.customDataset) {

    const dataset =
      state.customDataset;

    radiation =
      lastOr(
        dataset.radiation,
        radiation
      );

    temperature =
      lastOr(
        dataset.temperature,
        temperature
      );

    humidity =
      lastOr(
        dataset.humidity,
        humidity
      );

    pressure =
      lastOr(
        dataset.pressure,
        pressure
      );

    wakefulness =
      lastOr(
        dataset.wakefulness,
        wakefulness
      );

  }


  const co2Score =
    normalizeDeviation(
      state.currentCO2,
      1200,
      3800
    );


  const radiationScore =
    normalizeDeviation(
      radiation,
      1.8,
      2.5
    );


  const temperatureScore =
    normalizeDeviation(
      temperature,
      22,
      8
    );


  const humidityScore =
    normalizeDeviation(
      humidity,
      45,
      40
    );


  const pressureScore =
    normalizeDeviation(
      pressure,
      101.3,
      10
    );


  const sleepScore =
    clamp(
      (wakefulness / 8) * 100,
      0,
      100
    );


  const index =
    (
      0.35 * co2Score +
      0.20 * radiationScore +
      0.15 * temperatureScore +
      0.10 * humidityScore +
      0.10 * pressureScore +
      0.10 * sleepScore
    );


  return Math.round(
    clamp(index, 0, 100)
  );

}


function updateEnvironmentIndex() {

  const index =
    calculateEnvironmentIndex();


  setText(
    "environment-index",
    String(index)
  );


  const status =
    $("#environment-index-status");

  if (!status) {
    return;
  }


  status.classList.remove(
    "safe-text",
    "warning-text",
    "danger-text"
  );


  if (index <= 30) {

    status.textContent =
      "Nominal";

    status.classList.add(
      "safe-text"
    );

  } else if (index <= 60) {

    status.textContent =
      "Caution";

    status.classList.add(
      "warning-text"
    );

  } else {

    status.textContent =
      "Elevated Risk";

    status.classList.add(
      "danger-text"
    );

  }

}


function lastOr(array, fallback) {

  if (
    Array.isArray(array) &&
    array.length
  ) {

    return array[
      array.length - 1
    ];

  }

  return fallback;

}


/* =========================================================
   CHART SYSTEM
   ========================================================= */

/*
   The charts below use native Canvas.
   This removes the external Chart.js dependency entirely.
   The dashboard therefore remains functional offline.
*/


function createCharts() {

  drawEnvironmentChart();

  drawPerformanceChart();

}


function getChartCanvas(
  id
) {

  return document.getElementById(id);

}


function prepareCanvas(canvas) {

  if (!canvas) {
    return null;
  }


  const rect =
    canvas.getBoundingClientRect();


  const width =
    Math.max(
      300,
      Math.floor(rect.width || 600)
    );


  const height =
    Math.max(
      220,
      Math.floor(
        parseFloat(
          getComputedStyle(canvas)
            .height
        ) || 310
      )
    );


  const dpr =
    window.devicePixelRatio || 1;


  canvas.width =
    width * dpr;

  canvas.height =
    height * dpr;


  const context =
    canvas.getContext("2d");


  context.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  return {
    context,
    width,
    height
  };

}


function drawLineChart(
  canvas,
  labels,
  values,
  title
) {

  if (
    !canvas ||
    !Array.isArray(values) ||
    values.length < 1
  ) {

    showChartError();

    return;

  }


  const prepared =
    prepareCanvas(canvas);

  if (!prepared) {
    return;
  }


  const {
    context,
    width,
    height
  } = prepared;


  context.clearRect(
    0,
    0,
    width,
    height
  );


  const left =
    52;

  const right =
    18;

  const top =
    28;

  const bottom =
    42;


  const chartWidth =
    width -
    left -
    right;

  const chartHeight =
    height -
    top -
    bottom;


  const numericValues =
    values
      .map(Number)
      .filter(Number.isFinite);


  if (!numericValues.length) {

    showChartError();

    return;

  }


  let min =
    Math.min(
      ...numericValues
    );

  let max =
    Math.max(
      ...numericValues
    );


  if (min === max) {

    min -= 1;

    max += 1;

  }


  const padding =
    (max - min) * 0.12;

  min -= padding;
  max += padding;


  context.font =
    "12px system-ui";


  context.strokeStyle =
    "rgba(255,255,255,0.08)";

  context.fillStyle =
    "#8f9caf";

  context.lineWidth =
    1;


  const gridLines =
    5;


  for (
    let i = 0;
    i <= gridLines;
    i++
  ) {

    const y =
      top +
      chartHeight *
      (i / gridLines);


    context.beginPath();

    context.moveTo(
      left,
      y
    );

    context.lineTo(
      width - right,
      y
    );

    context.stroke();


    const value =
      max -
      (max - min) *
      (i / gridLines);


    context.fillText(
      formatNumber(value),
      5,
      y + 4
    );

  }


  if (labels.length > 0) {

    labels.forEach(
      (label, index) => {

        if (
          index !== 0 &&
          index !== labels.length - 1 &&
          index % 2 !== 0
        ) {
          return;
        }


        const x =
          labels.length === 1
            ? left
            : left +
              chartWidth *
              (
                index /
                (labels.length - 1)
              );


        context.fillText(
          label,
          x - 15,
          height - 12
        );

      }
    );

  }


  context.strokeStyle =
    title === "CO₂"
      ? "#51d7e8"
      : "#4ea1ff";


  context.lineWidth =
    2.5;


  context.beginPath();


  numericValues.forEach(
    (value, index) => {

      const x =
        numericValues.length === 1
          ? left
          : left +
            chartWidth *
            (
              index /
              (numericValues.length - 1)
            );


      const y =
        top +
        chartHeight *
        (
          1 -
          (value - min) /
          (max - min)
        );


      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }

    }
  );


  context.stroke();


  context.fillStyle =
    title === "CO₂"
      ? "#51d7e8"
      : "#4ea1ff";


  numericValues.forEach(
    (value, index) => {

      const x =
        numericValues.length === 1
          ? left
          : left +
            chartWidth *
            (
              index /
              (numericValues.length - 1)
            );


      const y =
        top +
        chartHeight *
        (
          1 -
          (value - min) /
          (max - min)
        );


      context.beginPath();

      context.arc(
        x,
        y,
        4,
        0,
        Math.PI * 2
      );

      context.fill();

    }
  );


  context.fillStyle =
    "#edf4ff";

  context.font =
    "700 12px system-ui";

  context.fillText(
    title,
    left,
    15
  );

}


function drawEnvironmentChart() {

  const canvas =
    getChartCanvas(
      "environmentChart"
    );

  const dataset =
    state.activeDataset ||
    DEMO_DATA;


  drawLineChart(
    canvas,
    dataset.labels,
    dataset.environment,
    "CO₂"
  );

}


function drawPerformanceChart() {

  const canvas =
    getChartCanvas(
      "performanceChart"
    );

  const dataset =
    state.activeDataset ||
    DEMO_DATA;


  drawLineChart(
    canvas,
    dataset.labels,
    dataset.performance,
    "Reaction Time"
  );

}


function updateEnvironmentChartForScenario() {

  if (state.customDataset) {
    drawEnvironmentChart();
    drawPerformanceChart();
    return;
  }


  const scenario =
    SCENARIOS[
      state.activeScenario
    ];


  if (!scenario) {
    return;
  }


  const offsets = [
    -100,
    -50,
    -20,
    0,
    10,
    -10,
    0
  ];


  const values =
    offsets.map(
      offset =>
        Math.max(
          0,
          scenario.co2 +
          offset
        )
    );


  state.activeDataset = {

    ...DEMO_DATA,

    name:
      "Built-in demonstration data",

    environment:
      values,

    performance:
      values.map(
        value =>
          Math.round(
            240 +
            (
              (value - 1200) /
              3800
            ) * 110
          )
      )

  };


  drawEnvironmentChart();

  drawPerformanceChart();

}


function resizeCharts() {

  setTimeout(
    () => {

      drawEnvironmentChart();

      drawPerformanceChart();

    },
    120
  );

}


function showChartError() {

  const error =
    $("#chart-error");

  if (error) {
    error.classList.remove(
      "hidden"
    );
  }

}


/* =========================================================
   STATISTICS
   ========================================================= */

function calculateStatistics(
  values
) {

  const clean =
    values
      .map(Number)
      .filter(Number.isFinite);


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
      (total, value) =>
        total + value,
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


function updateStatistics(
  values
) {

  const stats =
    calculateStatistics(
      values
    );


  setText(
    "mean-co2",
    `${formatNumber(stats.mean)} ppm`
  );

  setText(
    "peak-co2",
    `${formatNumber(stats.max)} ppm`
  );

  setText(
    "min-co2",
    `${formatNumber(stats.min)} ppm`
  );

  setText(
    "data-points",
    String(stats.count)
  );

}


/* =========================================================
   TREND
   ========================================================= */

function calculateTrend(
  values
) {

  const clean =
    values
      .map(Number)
      .filter(Number.isFinite);


  if (clean.length < 2) {
    return "Insufficient data";
  }


  const first =
    clean[0];

  const last =
    clean[clean.length - 1];


  const difference =
    last - first;


  const threshold =
    Math.max(
      1,
      Math.abs(first) * 0.01
    );


  if (difference > threshold) {
    return "Increasing";
  }

  if (difference < -threshold) {
    return "Decreasing";
  }

  return "Stable";

}


/* =========================================================
   PEARSON CORRELATION
   ========================================================= */

function pearsonCorrelation(
  x,
  y
) {

  const pairs = [];


  const length =
    Math.min(
      x.length,
      y.length
    );


  for (
    let i = 0;
    i < length;
    i++
  ) {

    const a =
      Number(x[i]);

    const b =
      Number(y[i]);


    if (
      Number.isFinite(a) &&
      Number.isFinite(b)
    ) {

      pairs.push([
        a,
        b
      ]);

    }

  }


  if (pairs.length < 2) {
    return null;
  }


  const meanX =
    pairs.reduce(
      (sum, pair) =>
        sum + pair[0],
      0
    ) /
    pairs.length;


  const meanY =
    pairs.reduce(
      (sum, pair) =>
        sum + pair[1],
      0
    ) /
    pairs.length;


  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;


  pairs.forEach(
    ([a, b]) => {

      const dx =
        a - meanX;

      const dy =
        b - meanY;


      numerator +=
        dx * dy;

      denominatorX +=
        dx * dx;

      denominatorY +=
        dy * dy;

    }
  );


  const denominator =
    Math.sqrt(
      denominatorX *
      denominatorY
    );


  if (denominator === 0) {
    return null;
  }


  return numerator /
    denominator;

}


function calculateLaggedCorrelation(
  environment,
  performance,
  lag
) {

  const x = [];
  const y = [];


  /*
    Positive lag means environmental values at an earlier
    point are paired with performance values later in time.
  */

  for (
    let i = 0;
    i < environment.length - lag;
    i++
  ) {

    const environmentValue =
      Number(
        environment[i]
      );

    const performanceValue =
      Number(
        performance[i + lag]
      );


    if (
      Number.isFinite(
        environmentValue
      ) &&
      Number.isFinite(
        performanceValue
      )
    ) {

      x.push(
        environmentValue
      );

      y.push(
        performanceValue
      );

    }

  }


  return {

    r:
      pearsonCorrelation(
        x,
        y
      ),

    n:
      x.length

  };

}


function interpretCorrelation(
  r,
  n
) {

  if (
    r === null ||
    n < 3
  ) {

    return "Insufficient data";

  }


  const absolute =
    Math.abs(r);


  if (absolute < 0.2) {
    return "Very weak";
  }

  if (absolute < 0.4) {
    return "Weak";
  }

  if (absolute < 0.7) {
    return "Moderate";
  }

  if (absolute < 0.9) {
    return "Strong";
  }

  return "Very strong";

}


function updateCorrelation() {

  const dataset =
    state.activeDataset ||
    DEMO_DATA;


  const lag =
    Number(
      state.correlation.lag
    );


  const result =
    calculateLaggedCorrelation(
      dataset.environment,
      dataset.performance,
      lag
    );


  state.correlation.r =
    result.r;

  state.correlation.n =
    result.n;

  state.correlation.interpretation =
    interpretCorrelation(
      result.r,
      result.n
    );


  setText(
    "correlation-value",
    result.r === null
      ? "--"
      : result.r.toFixed(3)
  );

  setText(
    "correlation-lag",
    `${lag} h`
  );

  setText(
    "correlation-n",
    String(result.n)
  );

  setText(
    "correlation-interpretation",
    state.correlation.interpretation
  );

}


/* =========================================================
   ANALYSIS
   ========================================================= */

function updateAnalysis() {

  const dataset =
    state.activeDataset ||
    DEMO_DATA;


  const values =
    dataset.environment;


  const trend =
    calculateTrend(values);


  setText(
    "trend-result",
    trend
  );


  const difference =
    (
      (state.currentCO2 -
        SCENARIOS.baseline.co2)
      /
      SCENARIOS.baseline.co2
    ) * 100;


  setText(
    "baseline-result",
    `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`
  );


  setText(
    "analysis-result",
    state.customDataset
      ? "User dataset"
      : "Exploratory"
  );


  updateStatistics(
    values
  );

  updateCorrelation();

  updateEnvironmentIndex();

}


/* =========================================================
   CSV SETUP
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

  const template =
    $("#download-template-btn");


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


  if (template) {

    template.addEventListener(
      "click",
      downloadCSVTemplate
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


        if (!file) {
          return;
        }


        if (
          !file.name
            .toLowerCase()
            .endsWith(".csv")
        ) {

          setFileStatus(
            "Please upload a CSV file."
          );

          return;

        }


        processCSV(file);

      }
    );

  }

}


/* =========================================================
   CSV PROCESSING
   ========================================================= */

function processCSV(file) {

  if (
    !file.name
      .toLowerCase()
      .endsWith(".csv")
  ) {

    setFileStatus(
      "Invalid file. Please select a CSV file."
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload =
    event => {

      try {

        const text =
          event.target.result;


        const parsed =
          parseCSV(text);


        if (!parsed.success) {

          setFileStatus(
            parsed.message
          );

          return;

        }


        state.customDataset = {

          name:
            file.name,

          values:
            parsed.values,

          labels:
            parsed.labels,

          environment:
            parsed.values,

          performance:
            parsed.performance,

          radiation:
            parsed.radiation,

          temperature:
            parsed.temperature,

          humidity:
            parsed.humidity,

          pressure:
            parsed.pressure,

          wakefulness:
            parsed.wakefulness,

          circadian:
            parsed.circadian,

          co2Column:
            parsed.co2Column,

          timeColumn:
            parsed.timeColumn

        };


        state.activeDataset =
          state.customDataset;


        state.currentCO2 =
          lastOr(
            parsed.values,
            state.currentCO2
          );


        updateDatasetInformation();

        updateCustomCharts();

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
          "CSV processing error:",
          error
        );

        setFileStatus(
          "The CSV could not be processed. Check its formatting."
        );

      }

    };


  reader.onerror = () => {

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
      header =>
        header.trim()
    );


  const normalizedHeaders =
    headers.map(
      header =>
        header
          .toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            ""
          )
    );


  function findColumn(
    keywords
  ) {

    for (
      let i = 0;
      i < normalizedHeaders.length;
      i++
    ) {

      const header =
        normalizedHeaders[i];


      if (
        keywords.some(
          keyword =>
            header.includes(
              keyword
            )
        )
      ) {

        return i;

      }

    }


    return -1;

  }


  const co2Index =
    findColumn([
      "co2",
      "carbondioxide",
      "co2ppm",
      "co2concentration",
      "environment"
    ]);


  if (co2Index === -1) {

    return {

      success: false,

      message:
        "No CO₂ measurement column was detected. Try CO2, CO2_ppm, carbon_dioxide or environment."

    };

  }


  const timeIndex =
    findColumn([
      "time",
      "date",
      "timestamp",
      "label"
    ]);


  const performanceIndex =
    findColumn([
      "performance",
      "reactiontime",
      "reaction",
      "rt"
    ]);


  const radiationIndex =
    findColumn([
      "radiation",
      "radiationmsv",
      "msv"
    ]);


  const temperatureIndex =
    findColumn([
      "temperature",
      "temp"
    ]);


  const humidityIndex =
    findColumn([
      "humidity"
    ]);


  const pressureIndex =
    findColumn([
      "pressure"
    ]);


  const wakeIndex =
    findColumn([
      "wakefulness",
      "awake",
      "sleepless"
    ]);


  const circadianIndex =
    findColumn([
      "circadian",
      "phaseoffset"
    ]);


  const values = [];
  const labels = [];
  const performance = [];
  const radiation = [];
  const temperature = [];
  const humidity = [];
  const pressure = [];
  const wakefulness = [];
  const circadian = [];


  for (
    let rowIndex = 1;
    rowIndex < rows.length;
    rowIndex++
  ) {

    const row =
      rows[rowIndex];


    if (!row.length) {
      continue;
    }


    const rawValue =
      row[co2Index];


    const value =
      parseFloat(
        String(rawValue ?? "")
          .replace(/,/g, "")
          .trim()
      );


    if (
      !Number.isFinite(value)
    ) {

      continue;

    }


    values.push(value);


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


    performance.push(
      readOptionalNumber(
        row,
        performanceIndex,
        240
      )
    );


    radiation.push(
      readOptionalNumber(
        row,
        radiationIndex,
        1.8
      )
    );


    temperature.push(
      readOptionalNumber(
        row,
        temperatureIndex,
        22
      )
    );


    humidity.push(
      readOptionalNumber(
        row,
        humidityIndex,
        45
      )
    );


    pressure.push(
      readOptionalNumber(
        row,
        pressureIndex,
        101.3
      )
    );


    wakefulness.push(
      readOptionalNumber(
        row,
        wakeIndex,
        2
      )
    );


    circadian.push(
      readOptionalNumber(
        row,
        circadianIndex,
        0
      )
    );

  }


  if (!values.length) {

    return {

      success: false,

      message:
        "A CO₂ column was found, but no valid numeric values were detected."

    };

  }


  return {

    success: true,

    values,

    labels,

    performance,

    radiation,

    temperature,

    humidity,

    pressure,

    wakefulness,

    circadian,

    co2Column:
      headers[co2Index],

    timeColumn:
      timeIndex >= 0
        ? headers[timeIndex]
        : "Not detected"

  };

}


function readOptionalNumber(
  row,
  index,
  fallback
) {

  if (index < 0) {
    return fallback;
  }


  const value =
    parseFloat(
      String(row[index] ?? "")
        .replace(/,/g, "")
        .trim()
    );


  return Number.isFinite(value)
    ? value
    : fallback;

}


/* =========================================================
   CSV ROW PARSER
   Handles quoted commas and escaped quotes.
   ========================================================= */

function parseCSVRows(text) {

  const rows = [];

  let row = [];

  let cell = "";

  let insideQuotes = false;


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
      insideQuotes &&
      next === '"'
    ) {

      cell += '"';

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

      row.push(cell);

      cell = "";

      continue;

    }


    if (
      (
        char === "\n" ||
        char === "\r"
      ) &&
      !insideQuotes
    ) {

      if (
        char === "\r" &&
        next === "\n"
      ) {

        i++;

      }


      row.push(cell);


      if (
        row.some(
          value =>
            value.trim() !== ""
        )
      ) {

        rows.push(row);

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

    row.push(cell);


    if (
      row.some(
        value =>
          value.trim() !== ""
      )
    ) {

      rows.push(row);

    }

  }


  return rows;

}


/* =========================================================
   DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

  if (!state.customDataset) {

    setText(
      "dataset-badge",
      "DEMONSTRATION"
    );

    setText(
      "dataset-name",
      state.activeDataset.name ||
      "Built-in demonstration data"
    );

    setText(
      "dataset-rows",
      String(
        state.activeDataset
          .environment.length
      )
    );

    setText(
      "dataset-co2-column",
      "environment"
    );

    setText(
      "dataset-time-column",
      "labels"
    );

    setText(
      "dataset-validation",
      "Demonstration dataset"
    );


    const validation =
      $("#dataset-validation");

    if (validation) {

      validation.classList.remove(
        "warning-text",
        "danger-text"
      );

      validation.classList.add(
        "safe-text"
      );

    }


    setText(
      "statistics-source",
      state.activeDataset.name ||
      "Demonstration dataset"
    );

    return;

  }


  const dataset =
    state.customDataset;


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

    validation.classList.remove(
      "warning-text",
      "danger-text"
    );

    validation.classList.add(
      "safe-text"
    );

  }


  setText(
    "statistics-source",
    "Custom local dataset"
  );

}


/* =========================================================
   CUSTOM CHARTS
   ========================================================= */

function updateCustomCharts() {

  const dataset =
    state.customDataset;


  if (!dataset) {
    return;
  }


  state.activeDataset =
    dataset;


  state.currentCO2 =
    lastOr(
      dataset.values,
      state.currentCO2
    );


  setText(
    "environment-value",
    formatNumber(
      state.currentCO2
    )
  );


  setText(
    "co2-slider-value",
    `${formatNumber(state.currentCO2)} ppm`
  );


  const slider =
    $("#co2-slider");


  if (slider) {

    slider.value =
      clamp(
        state.currentCO2,
        Number(slider.min),
        Number(slider.max)
      );

  }


  drawEnvironmentChart();

  drawPerformanceChart();

}


/* =========================================================
   CLEAR DATASET
   ========================================================= */

function clearDataset() {

  state.customDataset =
    null;


  state.activeDataset = {
    ...DEMO_DATA,
    name:
      "Built-in demonstration data"
  };


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


  setFileStatus(
    "Custom dataset cleared. Demonstration dataset restored."
  );


  updateDatasetInformation();


  state.currentCO2 =
    SCENARIOS[
      state.activeScenario
    ].co2;


  applyScenario(
    SCENARIOS[
      state.activeScenario
    ]
  );


  updateAnalysis();

}


/* =========================================================
   BUILT-IN BENCHMARKS
   ========================================================= */

function setupBenchmarks() {

  $all(".benchmark-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const key =
            button.dataset.benchmark;


          if (
            !BENCHMARK_DATASETS[key]
          ) {

            return;

          }


          loadBenchmark(
            key
          );

        }
      );

    });

}


function loadBenchmark(
  key
) {

  const source =
    BENCHMARK_DATASETS[key];


  if (!source) {
    return;
  }


  state.customDataset =
    null;


  state.activeDataset = {
    ...source
  };


  state.currentCO2 =
    lastOr(
      source.environment,
      1200
    );


  const slider =
    $("#co2-slider");


  if (slider) {

    slider.value =
      clamp(
        state.currentCO2,
        Number(slider.min),
        Number(slider.max)
      );

  }


  setText(
    "co2-slider-value",
    `${formatNumber(state.currentCO2)} ppm`
  );


  setText(
    "environment-value",
    formatNumber(
      state.currentCO2
    )
  );


  setText(
    "benchmark-status",
    `Loaded: ${source.name}`
  );


  const clear =
    $("#clear-csv-btn");

  if (clear) {
    clear.disabled = true;
  }


  updateDatasetInformation();

  updateAnalysis();

  drawEnvironmentChart();

  drawPerformanceChart();

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
   CSV TEMPLATE DOWNLOAD
   ========================================================= */

function downloadCSVTemplate() {

  const csv = [
    "time,CO2_ppm,performance_ms,radiation_mSv_day,temperature_C,humidity_percent,pressure_kPa,wakefulness_hours,circadian_offset_hours",
    "T-6h,1100,235,1.4,21.5,42,101.3,1,0",
    "T-5h,1150,238,1.5,21.8,43,101.3,1.2,0",
    "T-4h,1180,240,1.6,22,44,101.3,1.5,0",
    "T-3h,1200,242,1.7,22.1,45,101.3,1.7,0",
    "T-2h,1210,244,1.8,22,45,101.4,1.8,0",
    "T-1h,1190,241,1.8,22,45,101.3,2,0",
    "Current,1200,240,1.8,22,45,101.3,2,0"
  ].join("\n");


  downloadTextFile(
    csv,
    "space-neurohealth-template.csv",
    "text/csv;charset=utf-8"
  );

}


function downloadTextFile(
  content,
  filename,
  type
) {

  const blob =
    new Blob(
      [content],
      {
        type
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const anchor =
    document.createElement(
      "a"
    );


  anchor.href =
    url;

  anchor.download =
    filename;


  document.body.appendChild(
    anchor
  );


  anchor.click();


  anchor.remove();


  setTimeout(
    () => {
      URL.revokeObjectURL(
        url
      );
    },
    1000
  );

}


/* =========================================================
   PVT
   ========================================================= */

function setupPVT() {

  const startButton =
    $("#pvt-start-btn");

  const box =
    $("#pvt-box");


  if (!startButton || !box) {
    return;
  }


  startButton.addEventListener(
    "click",
    startPVT
  );


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


function startPVT() {

  const pvt =
    state.pvt;


  if (pvt.running) {
    return;
  }


  if (pvt.timer) {

    clearTimeout(
      pvt.timer
    );

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
    button.disabled = true;
  }


  const delay =
    1200 +
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


  if (!pvt.running) {
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


  if (!pvt.running) {
    return;
  }


  if (!pvt.ready) {

    if (pvt.timer) {

      clearTimeout(
        pvt.timer
      );

      pvt.timer =
        null;

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
      button.disabled = false;
    }


    updatePVTResults();

    return;

  }


  const reactionTime =
    Math.round(
      performance.now() -
      pvt.startTime
    );


  if (reactionTime < 150) {

    pvt.falseStarts++;

  } else {

    pvt.trials.push(
      reactionTime
    );


    if (reactionTime > 500) {
      pvt.lapses++;
    }

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
    button.disabled = false;
  }


  updatePVTResults();

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
      "-- s⁻¹"
    );

    setText(
      "pvt-best",
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
    ) /
    count;


  const meanRRT =
    trials.reduce(
      (sum, value) =>
        sum +
        (
          1000 / value
        ),
      0
    ) /
    count;


  const best =
    Math.min(
      ...trials
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
    `${meanRRT.toFixed(3)} s⁻¹`
  );

  setText(
    "pvt-best",
    `${best} ms`
  );

}


/* =========================================================
   EXPORT / PRINT
   ========================================================= */

function setupExport() {

  const button =
    $("#export-btn");


  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    exportSummary
  );

}


function exportSummary() {

  const scenario =
    SCENARIOS[
      state.activeScenario
    ];


  const pvt =
    state.pvt;


  const pvtAverage =
    pvt.trials.length
      ? Math.round(
          pvt.trials.reduce(
            (a, b) =>
              a + b,
            0
          ) /
          pvt.trials.length
        )
      : null;


  const pvtMeanRRT =
    pvt.trials.length
      ? (
          pvt.trials.reduce(
            (sum, value) =>
              sum +
              (
                1000 / value
              ),
            0
          ) /
          pvt.trials.length
        )
      : null;


  const correlation =
    state.correlation;


  const originalTitle =
    document.title;


  document.title =
    "Space NeuroHealth Research Summary";


  const message = `Space NeuroHealth

SCENARIO
${scenario.name}

ACTIVE CO₂
${formatNumber(state.currentCO2)} ppm

ENVIRONMENT INDEX
${$("#environment-index")?.textContent || "--"} / 100
${$("#environment-index-status")?.textContent || "--"}

RADIATION
${$("#radiation-value")?.textContent || "--"}

TEMPERATURE
${$("#temperature-value")?.textContent || "--"}

HUMIDITY
${$("#humidity-value")?.textContent || "--"}

PRESSURE
${$("#pressure-value")?.textContent || "--"}

WAKEFULNESS
${$("#wake-value")?.textContent || "--"}

CIRCADIAN OFFSET
${$("#circadian-value")?.textContent || "--"}

TIME-LAGGED CORRELATION
Pearson r: ${
  correlation.r === null
    ? "--"
    : correlation.r.toFixed(3)
}
Lag: ${correlation.lag} h
Sample size: ${correlation.n}

PVT
Trials: ${pvt.trials.length}
Mean RT: ${
  pvtAverage === null
    ? "--"
    : `${pvtAverage} ms`
}
Mean RRT: ${
  pvtMeanRRT === null
    ? "--"
    : `${pvtMeanRRT.toFixed(3)} s⁻¹`
}
Lapses >500 ms: ${pvt.lapses}
False starts <150 ms: ${pvt.falseStarts}

DATASET
${
  state.customDataset
    ? state.customDataset.name
    : state.activeDataset.name
}

This report contains demonstration/interface data unless a validated dataset has been loaded.`;


  const shouldPrint =
    window.confirm(
      `${message}\n\nOpen the print dialog to save this summary as PDF?`
    );


  if (shouldPrint) {

    window.print();

  }


  setTimeout(
    () => {

      document.title =
        originalTitle;

    },
    1000
  );

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

function setupKeyboardNavigation() {

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

          state.pvt.timer =
            null;

        }


        state.pvt.running =
          false;

        state.pvt.ready =
          false;


        const box =
          $("#pvt-box");


        if (box) {

          box.textContent =
            "Test cancelled — press Start Test";

          box.classList.remove(
            "ready"
          );

        }


        const button =
          $("#pvt-start-btn");


        if (button) {
          button.disabled = false;
        }

      }

    }
  );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

  setupNavigation();

  setupScenarios();

  setupSlider();

  setupCSV();

  setupBenchmarks();

  setupPVT();

  setupExport();

  setupKeyboardNavigation();


  state.activeDataset = {
    ...DEMO_DATA,
    name:
      "Built-in demonstration data"
  };


  updateStatistics(
    DEMO_DATA.environment
  );


  updateDatasetInformation();


  createCharts();


  applyScenario(
    SCENARIOS.baseline
  );


  updatePVTResults();


  updateCorrelation();


  updateAnalysis();


  window.addEventListener(
    "resize",
    resizeCharts
  );

}


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
