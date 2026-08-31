/* =========================================================
   SPACE NEUROHEALTH
   APPLICATION JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const DEMO_DATA = {

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
      1135,
      1160,
      1175,
      1185,
      1195,
      1200
    ],

    performance: [
      228,
      231,
      235,
      237,
      239,
      240,
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
      1450,
      1580,
      1720,
      1890,
      2050,
      2210,
      2350
    ],

    performance: [
      240,
      245,
      250,
      257,
      263,
      270,
      276
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
      1200,
      1200,
      1210,
      1205,
      1210,
      1215,
      1220
    ],

    performance: [
      240,
      255,
      272,
      295,
      320,
      345,
      375
    ]
  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  dataset: {
    name: DEMO_DATA.baseline.name,
    labels: [...DEMO_DATA.baseline.labels],
    environment: [...DEMO_DATA.baseline.environment],
    performance: [...DEMO_DATA.baseline.performance],
    source: "Demonstration",
    co2Column: "environment",
    timeColumn: "labels"
  },

  baselineCO2: 1200,

  environment: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    sleep: 2
  },

  pvt: {
    running: false,
    waiting: false,
    readyTime: null,
    timeoutId: null,
    trialCount: 0,
    results: [],
    falseStarts: 0
  }

};


/* =========================================================
   DOM HELPER
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}


/* =========================================================
   NUMBER HELPERS
   ========================================================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


function formatNumber(value, decimals = 0) {

  if (!Number.isFinite(value)) {
    return "--";
  }

  return Number(value).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  const buttons =
    document.querySelectorAll(".nav-btn");

  const sections =
    document.querySelectorAll(".section");


  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const target =
        button.dataset.section;


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


      sections.forEach(section => {

        section.hidden =
          section.id !== target;

      });

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  });

}


/* =========================================================
   DATASET LIBRARY
   ========================================================= */

function loadDemoDataset(name) {

  const selected =
    DEMO_DATA[name];

  if (!selected) {
    return;
  }


  state.dataset = {

    name: selected.name,

    labels: [...selected.labels],

    environment: [...selected.environment],

    performance: [...selected.performance],

    source: "Demonstration",

    co2Column: "environment",

    timeColumn: "labels"

  };


  state.baselineCO2 =
    DEMO_DATA.baseline.environment[0];


  $("library-status").textContent =
    `${selected.name} loaded successfully.`;


  $("file-status-msg").textContent =
    "Demonstration dataset active.";


  $("dataset-badge").textContent =
    "DEMONSTRATION";


  updateDatasetMetadata();

  updateAll();

}


function setupDemoLibrary() {

  $("load-demo-btn")
    .addEventListener("click", () => {

      loadDemoDataset(
        $("dataset-library").value
      );

    });

}


/* =========================================================
   ENVIRONMENT CONTROLS
   ========================================================= */

function setupEnvironmentControls() {

  const controls = {

    co2: $("co2-slider"),

    radiation:
      $("radiation-slider"),

    pressure:
      $("pressure-slider"),

    temperature:
      $("temperature-slider"),

    humidity:
      $("humidity-slider"),

    sleep:
      $("sleep-slider")

  };


  Object.entries(controls).forEach(
    ([key, input]) => {

      input.addEventListener(
        "input",
        () => {

          state.environment[key] =
            Number(input.value);

          updateControlLabels();

          updateEnvironmentMetrics();

          updateRiskProfile();

        }
      );

    }
  );


  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const scenario =
            button.dataset.scenario;

          applyScenario(scenario);

        }
      );

    });

}


function updateControlLabels() {

  $("co2-slider-value").textContent =
    `${formatNumber(
      state.environment.co2
    )} ppm`;


  $("radiation-value").textContent =
    Number(
      state.environment.radiation
    ).toFixed(2);


  $("pressure-value").textContent =
    Number(
      state.environment.pressure
    ).toFixed(1);


  $("temperature-value").textContent =
    Number(
      state.environment.temperature
    ).toFixed(1);


  $("humidity-value").textContent =
    formatNumber(
      state.environment.humidity
    );


  $("sleep-value").textContent =
    formatNumber(
      state.environment.sleep
    );

}


function applyScenario(scenario) {

  const presets = {

    baseline: {
      co2: 1200,
      radiation: 1.8,
      pressure: 101.3,
      temperature: 22,
      humidity: 45,
      sleep: 2
    },

    elevated: {
      co2: 2200,
      radiation: 3.5,
      pressure: 99.5,
      temperature: 25,
      humidity: 60,
      sleep: 8
    },

    high: {
      co2: 4000,
      radiation: 7,
      pressure: 94,
      temperature: 28,
      humidity: 75,
      sleep: 14
    }

  };


  const preset =
    presets[scenario];

  if (!preset) {
    return;
  }


  Object.entries(preset).forEach(
    ([key, value]) => {

      state.environment[key] =
        value;

    }
  );


  $("co2-slider").value =
    preset.co2;

  $("radiation-slider").value =
    preset.radiation;

  $("pressure-slider").value =
    preset.pressure;

  $("temperature-slider").value =
    preset.temperature;

  $("humidity-slider").value =
    preset.humidity;

  $("sleep-slider").value =
    preset.sleep;


  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.scenario === scenario
      );

    });


  updateControlLabels();

  updateEnvironmentMetrics();

  updateRiskProfile();

}


/* =========================================================
   ENVIRONMENT INDEX
   ========================================================= */

function calculateCO2Risk(co2) {

  if (co2 <= 1200) {
    return 0;
  }

  return clamp(
    ((co2 - 1200) / (5000 - 1200)) * 100,
    0,
    100
  );

}


function calculateRadiationRisk(value) {

  return clamp(
    ((value - 1.8) / 8.2) * 100,
    0,
    100
  );

}


function calculatePressureRisk(value) {

  return clamp(
    Math.abs(value - 101.3) / 21.3 * 100,
    0,
    100
  );

}


function calculateTemperatureRisk(value) {

  return clamp(
    Math.abs(value - 22) / 8 * 100,
    0,
    100
  );

}


function calculateHumidityRisk(value) {

  return clamp(
    Math.abs(value - 45) / 35 * 100,
    0,
    100
  );

}


function calculateSleepRisk(value) {

  return clamp(
    (value / 24) * 100,
    0,
    100
  );

}


function calculateRiskScores() {

  return {

    co2:
      calculateCO2Risk(
        state.environment.co2
      ),

    radiation:
      calculateRadiationRisk(
        state.environment.radiation
      ),

    pressure:
      calculatePressureRisk(
        state.environment.pressure
      ),

    temperature:
      calculateTemperatureRisk(
        state.environment.temperature
      ),

    humidity:
      calculateHumidityRisk(
        state.environment.humidity
      ),

    sleep:
      calculateSleepRisk(
        state.environment.sleep
      )

  };

}


function calculateEnvironmentIndex() {

  const risk =
    calculateRiskScores();


  const score =

    risk.co2 * 0.30 +

    risk.radiation * 0.20 +

    risk.pressure * 0.10 +

    risk.temperature * 0.15 +

    risk.humidity * 0.10 +

    risk.sleep * 0.15;


  return clamp(
    Math.round(score),
    0,
    100
  );

}


/* =========================================================
   ENVIRONMENT METRICS
   ========================================================= */

function getRiskStatus(score) {

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
    label: "Elevated",
    className: ""
  };

}


function updateEnvironmentMetrics() {

  const co2 =
    state.environment.co2;


  const performance =
    calculatePerformanceReference();


  const risk =
    calculateEnvironmentIndex();


  $("environment-value").textContent =
    formatNumber(co2);


  $("performance-value").textContent =
    formatNumber(performance);


  $("risk-value").textContent =
    formatNumber(risk);


  $("environment-status").textContent =
    getCO2Status(co2);


  $("performance-status").textContent =
    "Demonstration reference";


  const riskStatus =
    getRiskStatus(risk);


  $("risk-status").textContent =
    riskStatus.label;


  $("risk-status").className =
    `metric-status ${riskStatus.className}`;


  updateBaselineDifference();

  updateScienceInterpretation();

}


function getCO2Status(co2) {

  if (co2 <= 1500) {
    return "Nominal Demonstration";
  }

  if (co2 <= 2500) {
    return "Elevated Demonstration";
  }

  return "High Demonstration";
}


function calculatePerformanceReference() {

  const co2Effect =
    Math.max(
      0,
      state.environment.co2 - 1200
    ) * 0.006;


  const sleepEffect =
    state.environment.sleep * 4.0;


  const temperatureEffect =
    Math.abs(
      state.environment.temperature - 22
    ) * 1.2;


  return Math.round(
    240 +
    co2Effect +
    sleepEffect +
    temperatureEffect
  );

}


/* =========================================================
   BASELINE DIFFERENCE
   ========================================================= */

function updateBaselineDifference() {

  const current =
    state.environment.co2;


  const baseline =
    state.baselineCO2;


  const difference =
    baseline === 0
      ? 0
      : ((current - baseline) / baseline) * 100;


  const sign =
    difference >= 0 ? "+" : "";


  $("change-value").textContent =
    `${sign}${difference.toFixed(1)}%`;


  if (Math.abs(difference) < 0.05) {

    $("change-status").textContent =
      "No change from baseline";

  } else if (difference > 0) {

    $("change-status").textContent =
      "Above baseline";

  } else {

    $("change-status").textContent =
      "Below baseline";

  }


  $("baseline-result").textContent =
    `${sign}${difference.toFixed(1)}%`;

}


/* =========================================================
   SCIENCE INTERPRETATION
   ========================================================= */

function updateScienceInterpretation() {

  const score =
    calculateEnvironmentIndex();


  if (score < 30) {

    $("science-title").textContent =
      "Baseline environmental condition";


    $("science-text").textContent =
      "The current demonstration parameters remain close to the defined reference state. These values are interface-level simulations and should not be interpreted as validated physiological predictions.";

  } else if (score < 60) {

    $("science-title").textContent =
      "Caution-level demonstration condition";


    $("science-text").textContent =
      "Several environmental parameters have moved away from their demonstration reference values. The composite score is intended for exploratory analysis rather than clinical or operational decision-making.";

  } else {

    $("science-title").textContent =
      "Elevated demonstration condition";


    $("science-text").textContent =
      "The selected parameters produce a higher prototype index. This demonstrates how multiple deviations can contribute to a composite analytical score without claiming a validated health outcome.";

  }

}


/* =========================================================
   RISK PROFILE
   ========================================================= */

function updateRiskProfile() {

  const scores =
    calculateRiskScores();


  const mappings = {

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


  Object.entries(mappings).forEach(
    ([key, ids]) => {

      const score =
        Math.round(scores[key]);


      $(ids[0]).style.width =
        `${score}%`;


      $(ids[1]).textContent =
        score;

    }
  );


  const index =
    calculateEnvironmentIndex();


  const status =
    getRiskStatus(index);


  $("risk-badge").textContent =
    status.label.toUpperCase();

}


/* =========================================================
   CHART ENGINE
   ========================================================= */

function drawLineChart(
  canvas,
  labels,
  values,
  options = {}
) {

  if (!canvas) {
    return;
  }


  const rect =
    canvas.getBoundingClientRect();


  const width =
    Math.max(
      rect.width,
      300
    );


  const height =
    Math.max(
      rect.height,
      250
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


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  const cleanValues =
    values.filter(
      Number.isFinite
    );


  if (
    cleanValues.length === 0
  ) {
    return;
  }


  const padding = {

    left: 55,

    right: 20,

    top: 25,

    bottom: 40

  };


  const plotWidth =
    width -
    padding.left -
    padding.right;


  const plotHeight =
    height -
    padding.top -
    padding.bottom;


  let min =
    Math.min(...cleanValues);


  let max =
    Math.max(...cleanValues);


  if (min === max) {

    min -= 1;

    max += 1;

  }


  const range =
    max - min;


  min -= range * 0.12;

  max += range * 0.12;


  function xPosition(index) {

    if (labels.length <= 1) {
      return padding.left +
        plotWidth / 2;
    }

    return padding.left +
      (index / (labels.length - 1)) *
      plotWidth;

  }


  function yPosition(value) {

    return padding.top +
      ((max - value) /
      (max - min)) *
      plotHeight;

  }


  /* Grid */

  ctx.strokeStyle =
    "rgba(255,255,255,0.08)";

  ctx.lineWidth = 1;


  const gridLines = 5;


  for (
    let i = 0;
    i <= gridLines;
    i++
  ) {

    const y =
      padding.top +
      (i / gridLines) *
      plotHeight;


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


  /* Y labels */

  ctx.fillStyle =
    "#8f9caf";

  ctx.font =
    "11px system-ui";


  for (
    let i = 0;
    i <= gridLines;
    i++
  ) {

    const value =
      max -
      (i / gridLines) *
      (max - min);


    const y =
      padding.top +
      (i / gridLines) *
      plotHeight;


    ctx.fillText(
      formatNumber(
        value,
        options.decimals || 0
      ),
      8,
      y + 4
    );

  }


  /* X labels */

  labels.forEach(
    (label, index) => {

      const x =
        xPosition(index);


      ctx.fillStyle =
        "#8f9caf";

      ctx.font =
        "10px system-ui";

      ctx.textAlign =
        "center";


      ctx.fillText(
        label,
        x,
        height - 13
      );

    }
  );


  /* Line */

  ctx.beginPath();


  values.forEach(
    (value, index) => {

      if (!Number.isFinite(value)) {
        return;
      }


      const x =
        xPosition(index);


      const y =
        yPosition(value);


      if (index === 0) {

        ctx.moveTo(
          x,
          y
        );

      } else {

        ctx.lineTo(
          x,
          y
        );

      }

    }
  );


  ctx.strokeStyle =
    options.lineColor ||
    "#51d7e8";

  ctx.lineWidth = 2.5;

  ctx.lineJoin =
    "round";

  ctx.lineCap =
    "round";

  ctx.stroke();


  /* Points */

  values.forEach(
    (value, index) => {

      if (!Number.isFinite(value)) {
        return;
      }


      const x =
        xPosition(index);


      const y =
        yPosition(value);


      ctx.beginPath();

      ctx.arc(
        x,
        y,
        3.5,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        options.pointColor ||
        "#4ea1ff";

      ctx.fill();

    }
  );


  ctx.textAlign =
    "start";

}


/* =========================================================
   UPDATE CHARTS
   ========================================================= */

function updateCharts() {

  const environmentCanvas =
    $("environmentChart");


  const performanceCanvas =
    $("performanceChart");


  const empty =
    $("environment-chart-empty");


  if (
    !state.dataset.environment.length
  ) {

    environmentCanvas.classList.add(
      "hidden"
    );

    empty.classList.remove(
      "hidden"
    );

  } else {

    environmentCanvas.classList.remove(
      "hidden"
    );

    empty.classList.add(
      "hidden"
    );


    drawLineChart(
      environmentCanvas,
      state.dataset.labels,
      state.dataset.environment,
      {
        decimals: 0,
        lineColor: "#51d7e8",
        pointColor: "#4ea1ff"
      }
    );

  }


  drawLineChart(
    performanceCanvas,
    state.dataset.labels,
    state.dataset.performance,
    {
      decimals: 0,
      lineColor: "#4ea1ff",
      pointColor: "#51d7e8"
    }
  );

}


/* =========================================================
   DATASET STATISTICS
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

    $("trend-result").textContent =
      "No data";

    return;

  }


  const mean =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length;


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


  $("statistics-source").textContent =
    state.dataset.source === "User"
      ? "User-supplied local dataset"
      : "Demonstration dataset";


  updateTrend(values);

  updateAnalysisSource();

}


function updateTrend(values) {

  if (values.length < 2) {

    $("trend-result").textContent =
      "Insufficient data";

    return;

  }


  const first =
    values[0];


  const last =
    values[values.length - 1];


  const difference =
    last - first;


  const tolerance =
    Math.max(
      Math.abs(first) * 0.01,
      1
    );


  if (difference > tolerance) {

    $("trend-result").textContent =
      "Increasing";

  } else if (difference < -tolerance) {

    $("trend-result").textContent =
      "Decreasing";

  } else {

    $("trend-result").textContent =
      "Stable";

  }

}


function updateAnalysisSource() {

  $("analysis-result").textContent =
    state.dataset.source === "User"
      ? "User supplied"
      : "Exploratory";

}


/* =========================================================
   PEARSON CORRELATION
   ========================================================= */

function pearsonCorrelation(x, y) {

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
    ) / x.length;


  const meanY =
    y.reduce(
      (a, b) => a + b,
      0
    ) / y.length;


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
    return null;
  }


  return numerator / denominator;

}


function calculateLaggedCorrelation(
  lag
) {

  const environment =
    state.dataset.environment;


  const performance =
    state.dataset.performance;


  const x = [];

  const y = [];


  for (
    let i = 0;
    i < environment.length;
    i++
  ) {

    const performanceIndex =
      i + lag;


    if (
      performanceIndex >=
      performance.length
    ) {
      break;
    }


    const env =
      Number(environment[i]);


    const perf =
      Number(
        performance[
          performanceIndex
        ]
      );


    if (
      Number.isFinite(env) &&
      Number.isFinite(perf)
    ) {

      x.push(env);

      y.push(perf);

    }

  }


  return {
    r:
      pearsonCorrelation(x, y),

    n:
      x.length

  };

}


function interpretCorrelation(r) {

  if (r === null) {
    return "Insufficient variation";
  }


  const magnitude =
    Math.abs(r);


  if (magnitude < 0.2) {
    return "Very weak";
  }

  if (magnitude < 0.4) {
    return "Weak";
  }

  if (magnitude < 0.6) {
    return "Moderate";
  }

  if (magnitude < 0.8) {
    return "Strong";
  }

  return "Very strong";

}


function setupCorrelation() {

  $("calculate-correlation-btn")
    .addEventListener(
      "click",
      () => {

        const lag =
          Number(
            $("lag-select").value
          );


        const result =
          calculateLaggedCorrelation(
            lag
          );


        $("correlation-lag")
          .textContent =
          `${lag} h`;


        $("correlation-n")
          .textContent =
          result.n;


        if (result.r === null) {

          $("correlation-value")
            .textContent =
            "--";

          $("correlation-interpretation")
            .textContent =
            "Insufficient data";

          return;

        }


        $("correlation-value")
          .textContent =
          result.r.toFixed(3);


        const direction =
          result.r >= 0
            ? "positive"
            : "negative";


        $("correlation-interpretation")
          .textContent =
          `${interpretCorrelation(
            result.r
          )}, ${direction}`;

      }
    );

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(text) {

  const lines =
    text
      .replace(/\r/g, "")
      .split("\n")
      .filter(
        line =>
          line.trim().length > 0
      );


  if (lines.length < 2) {

    throw new Error(
      "The CSV file does not contain enough rows."
    );

  }


  const rows =
    lines.map(parseCSVLine);


  const headers =
    rows[0].map(
      header =>
        header.trim()
    );


  if (!headers.length) {

    throw new Error(
      "No CSV headers were found."
    );

  }


  const normalizedHeaders =
    headers.map(
      header =>
        header
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
    );


  let co2Index =
    normalizedHeaders.findIndex(
      header =>
        header === "co2" ||
        header === "co2ppm" ||
        header.includes("carbon")
    );


  if (co2Index === -1) {

    co2Index =
      normalizedHeaders.findIndex(
        header =>
          header.includes("environment") ||
          header.includes("ppm")
      );

  }


  if (co2Index === -1) {

    throw new Error(
      "No CO₂ measurement column was found. Use a column such as CO2, CO2_ppm, or environment."
    );

  }


  let timeIndex =
    normalizedHeaders.findIndex(
      header =>
        header === "time" ||
        header === "timestamp" ||
        header === "label" ||
        header === "labels"
    );


  const labels = [];

  const environment = [];

  const performance = [];


  for (
    let i = 1;
    i < rows.length;
    i++
  ) {

    const row =
      rows[i];


    const rawCO2 =
      row[co2Index];


    const co2 =
      Number(
        String(rawCO2)
          .trim()
          .replace(/,/g, "")
      );


    if (!Number.isFinite(co2)) {
      continue;
    }


    const label =
      timeIndex >= 0 &&
      row[timeIndex] !== undefined
        ? row[timeIndex].trim()
        : `Row ${i}`;


    labels.push(label);

    environment.push(co2);


    let performanceValue =
      null;


    const perfIndex =
      normalizedHeaders.findIndex(
        header =>
          header.includes("reaction") ||
          header.includes("performance") ||
          header === "rt" ||
          header === "rtms"
      );


    if (
      perfIndex >= 0 &&
      row[perfIndex] !== undefined
    ) {

      const parsed =
        Number(
          String(
            row[perfIndex]
          )
            .trim()
            .replace(/,/g, "")
        );


      if (
        Number.isFinite(parsed)
      ) {

        performanceValue =
          parsed;

      }

    }


    performance.push(
      performanceValue
    );

  }


  if (!environment.length) {

    throw new Error(
      "No valid numerical CO₂ values were found."
    );

  }


  /* Fill missing performance values
     with a demonstration reference. */

  for (
    let i = 0;
    i < performance.length;
    i++
  ) {

    if (
      !Number.isFinite(
        performance[i]
      )
    ) {

      performance[i] =
        240;

    }

  }


  return {

    headers,

    labels,

    environment,

    performance,

    co2Column:
      headers[co2Index],

    timeColumn:
      timeIndex >= 0
        ? headers[timeIndex]
        : "Generated labels"

  };

}


function parseCSVLine(line) {

  const result = [];

  let current = "";

  let insideQuotes = false;


  for (
    let i = 0;
    i < line.length;
    i++
  ) {

    const character =
      line[i];


    if (
      character === '"'
    ) {

      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {

        current += '"';

        i++;

      } else {

        insideQuotes =
          !insideQuotes;

      }

    } else if (
      character === "," &&
      !insideQuotes
    ) {

      result.push(current);

      current = "";

    } else {

      current += character;

    }

  }


  result.push(current);

  return result;

}


/* =========================================================
   CSV UPLOAD
   ========================================================= */

function processCSVFile(file) {

  if (!file) {
    return;
  }


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


  reader.onload = event => {

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
          parsed.performance,

        source:
          "User",

        co2Column:
          parsed.co2Column,

        timeColumn:
          parsed.timeColumn

      };


      state.baselineCO2 =
        parsed.environment[0];


      $("dataset-badge").textContent =
        "USER DATA";


      $("clear-csv-btn").disabled =
        false;


      setFileStatus(
        `${file.name} loaded successfully. ${parsed.environment.length} valid CO₂ rows found.`
      );


      $("library-status").textContent =
        "User-supplied dataset active.";


      updateDatasetMetadata();

      updateAll();

    } catch (error) {

      setFileStatus(
        error.message ||
        "Unable to process the CSV file."
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


function setFileStatus(message) {

  $("file-status-msg").textContent =
    message;

}


function setupCSV() {

  const fileInput =
    $("csv-file-input");


  $("browse-csv-btn")
    .addEventListener(
      "click",
      () => {

        fileInput.click();

      }
    );


  fileInput.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      processCSVFile(file);

    }
  );


  const dropZone =
    $("drop-zone");


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


      const file =
        event.dataTransfer.files[0];


      processCSVFile(file);

    }
  );


  $("clear-csv-btn")
    .addEventListener(
      "click",
      () => {

        fileInput.value = "";

        loadDemoDataset(
          "baseline"
        );

        $("clear-csv-btn")
          .disabled = true;

        setFileStatus(
          "Demonstration dataset restored."
        );

      }
    );


  $("download-template-btn")
    .addEventListener(
      "click",
      downloadCSVTemplate
    );

}


function downloadCSVTemplate() {

  const content =
`time,CO2_ppm,reaction_time_ms
T-6h,1100,228
T-5h,1135,231
T-4h,1160,235
T-3h,1175,237
T-2h,1185,239
T-1h,1195,240
Current,1200,240
`;


  const blob =
    new Blob(
      [content],
      {
        type: "text/csv;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "space-neurohealth-template.csv";


  document.body.appendChild(link);

  link.click();

  link.remove();


  URL.revokeObjectURL(url);

}


/* =========================================================
   DATASET METADATA
   ========================================================= */

function updateDatasetMetadata() {

  $("dataset-name").textContent =
    state.dataset.name;


  $("dataset-rows").textContent =
    state.dataset.environment.length;


  $("dataset-co2-column").textContent =
    state.dataset.co2Column;


  $("dataset-time-column").textContent =
    state.dataset.timeColumn;


  $("dataset-validation").textContent =
    state.dataset.source === "User"
      ? "Valid numerical CO₂ series"
      : "Demonstration dataset";


  $("dataset-validation")
    .classList.toggle(
      "safe-text",
      true
    );

}


/* =========================================================
   PVT
   ========================================================= */

function setupPVT() {

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
      "click",
      handlePVTResponse
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

          handlePVTResponse();

        }

      }
    );

}


function startPVT() {

  clearTimeout(
    state.pvt.timeoutId
  );


  state.pvt.running =
    true;

  state.pvt.waiting =
    true;

  state.pvt.readyTime =
    null;


  $("pvt-start-btn")
    .disabled = true;


  $("pvt-box").classList.remove(
    "ready",
    "false-start"
  );


  $("pvt-box").textContent =
    "Wait…";


  const delay =
    1500 +
    Math.random() * 3500;


  state.pvt.timeoutId =
    setTimeout(
      pvtReady,
      delay
    );

}


function pvtReady() {

  if (!state.pvt.running) {
    return;
  }


  state.pvt.waiting =
    false;


  state.pvt.readyTime =
    performance.now();


  $("pvt-box")
    .classList.add(
      "ready"
    );


  $("pvt-box").textContent =
    "RESPOND NOW";

}


function handlePVTResponse() {

  if (
    !state.pvt.running
  ) {
    return;
  }


  if (
    state.pvt.waiting
  ) {

    state.pvt.falseStarts++;

    $("pvt-box")
      .classList.add(
        "false-start"
      );


    $("pvt-box").textContent =
      "Too early";


    setTimeout(
      () => {

        if (
          state.pvt.running
        ) {

          startPVT();

        }

      },
      700
    );


    updatePVTDisplay();

    return;

  }


  if (
    state.pvt.readyTime === null
  ) {
    return;
  }


  const reactionTime =
    performance.now() -
    state.pvt.readyTime;


  state.pvt.results.push(
    reactionTime
  );


  state.pvt.trialCount++;


  $("pvt-box")
    .classList.remove(
      "ready"
    );


  $("pvt-box").textContent =
    `${Math.round(
      reactionTime
    )} ms`;


  updatePVTDisplay();


  state.pvt.readyTime =
    null;


  state.pvt.waiting =
    true;


  setTimeout(
    () => {

      if (
        state.pvt.running
      ) {

        startPVT();

      }

    },
    800
  );

}


function updatePVTDisplay() {

  const results =
    state.pvt.results;


  $("pvt-trials").textContent =
    state.pvt.trialCount;


  $("pvt-false-starts").textContent =
    state.pvt.falseStarts;


  if (!results.length) {

    $("pvt-score").textContent =
      "-- ms";

    $("pvt-average").textContent =
      "-- ms";

    $("pvt-rrt").textContent =
      "--";

    $("pvt-best").textContent =
      "-- ms";

    $("pvt-lapses").textContent =
      "0";

    $("pvt-median").textContent =
      "-- ms";

    return;

  }


  const last =
    results[
      results.length - 1
    ];


  const mean =
    results.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / results.length;


  const best =
    Math.min(...results);


  const sorted =
    [...results].sort(
      (a, b) => a - b
    );


  const middle =
    Math.floor(
      sorted.length / 2
    );


  const median =
    sorted.length % 2 === 0

      ? (
          sorted[middle - 1] +
          sorted[middle]
        ) / 2

      : sorted[middle];


  const meanRRT =
    results.reduce(
      (sum, value) =>
        sum +
        (1000 / value),
      0
    ) / results.length;


  const lapses =
    results.filter(
      value =>
        value >= 500
    ).length;


  $("pvt-score").textContent =
    `${Math.round(last)} ms`;


  $("pvt-average").textContent =
    `${Math.round(mean)} ms`;


  $("pvt-rrt").textContent =
    meanRRT.toFixed(3);


  $("pvt-best").textContent =
    `${Math.round(best)} ms`;


  $("pvt-lapses").textContent =
    lapses;


  $("pvt-median").textContent =
    `${Math.round(median)} ms`;

}


function resetPVT() {

  clearTimeout(
    state.pvt.timeoutId
  );


  state.pvt = {

    running: false,

    waiting: false,

    readyTime: null,

    timeoutId: null,

    trialCount: 0,

    results: [],

    falseStarts: 0

  };


  $("pvt-start-btn")
    .disabled = false;


  $("pvt-box")
    .classList.remove(
      "ready",
      "false-start"
    );


  $("pvt-box").textContent =
    "Press Start Test";


  updatePVTDisplay();

}


/* =========================================================
   EXPORT
   ========================================================= */

function setupExport() {

  $("export-btn")
    .addEventListener(
      "click",
      () => {

        window.print();

      }
    );

}


/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateAll() {

  updateControlLabels();

  updateEnvironmentMetrics();

  updateRiskProfile();

  updateStatistics();

  updateDatasetMetadata();

  updateCharts();

}


/* =========================================================
   RESIZE
   ========================================================= */

let resizeTimer;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        updateCharts,
        120
      );

  }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

  setupNavigation();

  setupDemoLibrary();

  setupEnvironmentControls();

  setupCorrelation();

  setupCSV();

  setupPVT();

  setupExport();

  updateAll();

}


document.addEventListener(
  "DOMContentLoaded",
  initializeApp
);
