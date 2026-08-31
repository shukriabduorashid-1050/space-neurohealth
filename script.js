"use strict";

/* =========================================================
   SPACE NEUROHEALTH
   ADVANCED APPLICATION JAVASCRIPT
   ========================================================= */


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const DEMO_DATASETS = {

  baseline: {
    name: "Synthetic baseline",
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
    name: "Synthetic elevated environment",

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
      1500,
      1700,
      1900,
      2200,
      2400,
      2600,
      2800
    ],

    performance: [
      240,
      245,
      248,
      252,
      258,
      263,
      268
    ]
  },


  fatigue: {
    name: "Synthetic fatigue pattern",

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
      1180,
      1200,
      1300,
      1450,
      1600,
      1750
    ],

    performance: [
      235,
      240,
      244,
      250,
      258,
      270,
      282
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
    status: "Nominal Demonstration",
    statusClass: "safe-text"
  },

  elevated: {
    name: "Elevated",
    co2: 2500,
    performance: 275,
    status: "Elevated Demonstration",
    statusClass: ""
  },

  high: {
    name: "High",
    co2: 4000,
    performance: 330,
    status: "High Demonstration",
    statusClass: ""
  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  activeScenario: "baseline",

  environment: {

    co2: 1200,

    radiation: 1.8,

    wakefulness: 8,

    circadianOffset: 0,

    temperature: 22,

    humidity: 45

  },

  customDataset: null,

  selectedLag: 3,

  pvt: {

    running: false,

    ready: false,

    startTime: null,

    timer: null,

    trials: [],

    lapses: 0

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

  $all(".nav-btn").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const sectionId =
          button.dataset.section;

        if (!sectionId) {
          return;
        }

        $all(".nav-btn").forEach(
          btn => {

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

          }
        );


        $all(".section").forEach(
          section => {

            section.hidden =
              section.id !== sectionId;

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

  $all(".scenario-btn").forEach(
    button => {

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

    }
  );

}


function applyScenario(scenario) {

  state.environment.co2 =
    scenario.co2;

  updateEnvironmentControls();

  updateDashboardMetrics();

  updateScenarioChart();

  updateAnalysis();

}


/* =========================================================
   ENVIRONMENT CONTROLS
   ========================================================= */

function setupEnvironmentControls() {

  const controls = {

    "co2-slider": value => {
      state.environment.co2 =
        Number(value);
    },

    "radiation-slider": value => {
      state.environment.radiation =
        Number(value);
    },

    "wake-slider": value => {
      state.environment.wakefulness =
        Number(value);
    },

    "circadian-slider": value => {
      state.environment.circadianOffset =
        Number(value);
    },

    "temperature-slider": value => {
      state.environment.temperature =
        Number(value);
    },

    "humidity-slider": value => {
      state.environment.humidity =
        Number(value);
    }

  };


  Object.entries(controls)
    .forEach(([id, handler]) => {

      const slider =
        document.getElementById(id);

      if (!slider) {
        return;
      }

      slider.addEventListener(
        "input",
        event => {

          handler(
            event.target.value
          );

          updateEnvironmentControls();

          updateDashboardMetrics();

          updateAnalysis();

        }
      );

    });

}


function updateEnvironmentControls() {

  const e =
    state.environment;


  setText(
    "co2-slider-value",
    `${formatNumber(e.co2)} ppm`
  );

  setText(
    "radiation-value",
    `${formatNumber(e.radiation)} mSv/day`
  );

  setText(
    "wake-value",
    `${formatNumber(e.wakefulness)} h`
  );

  setText(
    "circadian-value",
    `${e.circadianOffset >= 0 ? "+" : ""}${formatNumber(e.circadianOffset)} h`
  );

  setText(
    "temperature-value",
    `${formatNumber(e.temperature)} °C`
  );

  setText(
    "humidity-value",
    `${formatNumber(e.humidity)}%`
  );


  setSliderValue(
    "co2-slider",
    e.co2
  );

  setSliderValue(
    "radiation-slider",
    e.radiation
  );

  setSliderValue(
    "wake-slider",
    e.wakefulness
  );

  setSliderValue(
    "circadian-slider",
    e.circadianOffset
  );

  setSliderValue(
    "temperature-slider",
    e.temperature
  );

  setSliderValue(
    "humidity-slider",
    e.humidity
  );

}


function setSliderValue(id, value) {

  const slider =
    document.getElementById(id);

  if (slider) {
    slider.value = value;
  }

}


/* =========================================================
   DEMONSTRATION ENVIRONMENT MODEL
   ========================================================= */

function calculatePerformanceIndicator() {

  const e =
    state.environment;


  let result = 240;


  /*
    This is intentionally an interface model.
    It is NOT a physiological prediction.
  */

  result +=
    Math.max(
      0,
      e.co2 - 1200
    ) / 3800 * 55;


  result +=
    Math.max(
      0,
      e.wakefulness - 8
    ) * 3;


  result +=
    Math.abs(
      e.circadianOffset
    ) * 2;


  result +=
    Math.max(
      0,
      e.radiation - 2
    ) * 1.5;


  const temperatureDeviation =
    Math.abs(
      e.temperature - 22
    );

  result +=
    temperatureDeviation * 1.5;


  const humidityDeviation =
    Math.max(
      0,
      Math.abs(e.humidity - 45) - 10
    );

  result +=
    humidityDeviation * 0.25;


  return Math.round(
    Math.max(
      220,
      Math.min(
        360,
        result
      )
    )
  );

}


/* =========================================================
   ENVIRONMENTAL RISK INDEX
   ========================================================= */

function calculateEnvironmentalIndex() {

  const e =
    state.environment;


  let score = 0;


  if (e.co2 > 1500) {
    score += Math.min(
      30,
      (e.co2 - 1500) / 100
    );
  }


  if (e.radiation > 2) {
    score += Math.min(
      20,
      (e.radiation - 2) * 2
    );
  }


  if (e.wakefulness > 12) {
    score += Math.min(
      25,
      (e.wakefulness - 12) * 2
    );
  }


  score +=
    Math.min(
      15,
      Math.abs(
        e.circadianOffset
      ) * 1.25
    );


  score +=
    Math.min(
      10,
      Math.abs(
        e.temperature - 22
      )
    );


  if (e.humidity > 65) {
    score += Math.min(
      10,
      (e.humidity - 65) / 2
    );
  }


  if (score < 25) {

    return {
      score,
      label: "Low",
      className: "risk-low"
    };

  }


  if (score < 55) {

    return {
      score,
      label: "Moderate",
      className: "risk-moderate"
    };

  }


  return {
    score,
    label: "High",
    className: "risk-high"
  };

}


/* =========================================================
   DASHBOARD METRICS
   ========================================================= */

function updateDashboardMetrics() {

  const e =
    state.environment;


  const performance =
    calculatePerformanceIndicator();


  setText(
    "environment-value",
    formatNumber(e.co2)
  );

  setText(
    "performance-value",
    formatNumber(performance)
  );


  const difference =
    (
      (performance - 240) /
      240
    ) * 100;


  setText(
    "change-value",
    `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`
  );


  let status =
    "Nominal Demonstration";


  if (e.co2 > 3000) {

    status =
      "High Demonstration";

  } else if (e.co2 > 1500) {

    status =
      "Elevated Demonstration";

  }


  setText(
    "environment-status",
    status
  );


  setText(
    "performance-status",
    "Demonstration reference"
  );


  setText(
    "change-status",
    difference === 0
      ? "No change"
      : "Demonstration difference"
  );

}


/* =========================================================
   CHART CREATION
   ========================================================= */

function createCharts() {

  if (
    typeof Chart === "undefined"
  ) {

    showChartError();

    return;

  }


  destroyCharts();

  createEnvironmentChart();

  createPerformanceChart();

}


function destroyCharts() {

  Object.keys(
    state.charts
  ).forEach(key => {

    const chart =
      state.charts[key];

    if (chart) {

      try {
        chart.destroy();
      } catch (error) {
        console.warn(
          "Chart cleanup failed:",
          error
        );
      }

      state.charts[key] =
        null;

    }

  });

}


function createEnvironmentChart() {

  const canvas =
    $("#environmentChart");

  if (!canvas) {
    return;
  }


  try {

    state.charts.environment =
      new Chart(
        canvas,
        buildEnvironmentChartConfig()
      );

  } catch (error) {

    console.error(
      "Environment chart error:",
      error
    );

    showChartError();

  }

}


function buildEnvironmentChartConfig() {

  const dataset =
    state.customDataset ||
    DEMO_DATASETS.baseline;


  return {

    type: "line",

    data: {

      labels:
        dataset.labels,

      datasets: [

        {

          label:
            "CO₂",

          data:
            dataset.environment,

          borderColor:
            "#51d7e8",

          backgroundColor:
            "rgba(81,215,232,0.10)",

          borderWidth: 2,

          fill: true,

          tension: 0.35,

          pointRadius: 4,

          pointHoverRadius: 6

        }

      ]

    },

    options: chartOptions()

  };

}


function createPerformanceChart() {

  const canvas =
    $("#performanceChart");

  if (!canvas) {
    return;
  }


  try {

    state.charts.performance =
      new Chart(
        canvas,
        buildPerformanceChartConfig()
      );

  } catch (error) {

    console.error(
      "Performance chart error:",
      error
    );

  }

}


function buildPerformanceChartConfig() {

  const dataset =
    state.customDataset ||
    DEMO_DATASETS.baseline;


  return {

    type: "line",

    data: {

      labels:
        dataset.labels,

      datasets: [

        {

          label:
            "Reaction Time",

          data:
            dataset.performance,

          borderColor:
            "#4ea1ff",

          backgroundColor:
            "rgba(78,161,255,0.10)",

          borderWidth: 2,

          fill: true,

          tension: 0.35,

          pointRadius: 4,

          pointHoverRadius: 6

        }

      ]

    },

    options: chartOptions()

  };

}


function chartOptions() {

  return {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

      intersect: false,

      mode: "index"

    },

    plugins: {

      legend: {

        labels: {

          color:
            "#edf4ff"

        }

      }

    },

    scales: {

      x: {

        ticks: {
          color:
            "#8f9caf"
        },

        grid: {
          color:
            "rgba(255,255,255,0.06)"
        }

      },

      y: {

        ticks: {
          color:
            "#8f9caf"
        },

        grid: {
          color:
            "rgba(255,255,255,0.06)"
        }

      }

    }

  };

}


/* =========================================================
   CHART UPDATE
   ========================================================= */

function updateScenarioChart() {

  if (
    state.customDataset
  ) {
    return;
  }


  const dataset =
    DEMO_DATASETS[
      getCurrentDemoDataset()
    ] ||
    DEMO_DATASETS.baseline;


  updateChartData(
    state.charts.environment,
    dataset.labels,
    dataset.environment
  );


  updateChartData(
    state.charts.performance,
    dataset.labels,
    dataset.performance
  );

}


function updateChartData(
  chart,
  labels,
  values
) {

  if (!chart) {
    return;
  }


  chart.data.labels =
    labels;

  chart.data.datasets[0].data =
    values;

  chart.update(
    "none"
  );

}


/* =========================================================
   DATASET SWITCHING
   ========================================================= */

function setupDemoDatasetSelector() {

  const select =
    $("#demo-dataset-select");

  const load =
    $("#load-demo-dataset-btn");


  if (select) {

    select.addEventListener(
      "change",
      () => {

        loadDemoDataset(
          select.value
        );

      }
    );

  }


  if (load) {

    load.addEventListener(
      "click",
      () => {

        loadDemoDataset(
          select?.value ||
          "baseline"
        );

      }
    );

  }

}


function getCurrentDemoDataset() {

  const select =
    $("#demo-dataset-select");

  if (
    select &&
    DEMO_DATASETS[
      select.value
    ]
  ) {

    return select.value;

  }


  return "baseline";

}


function loadDemoDataset(name) {

  const dataset =
    DEMO_DATASETS[name];

  if (!dataset) {
    return;
  }


  state.customDataset = null;


  state.environment.co2 =
    dataset.environment[
      dataset.environment.length - 1
    ];


  updateEnvironmentControls();


  updateDashboardMetrics();


  updateChartData(
    state.charts.environment,
    dataset.labels,
    dataset.environment
  );


  updateChartData(
    state.charts.performance,
    dataset.labels,
    dataset.performance
  );


  updateDatasetInformation();


  updateAnalysis();


  setFileStatus(
    `${dataset.name} loaded locally. This is synthetic demonstration data.`
  );

}


/* =========================================================
   STATISTICS
   ========================================================= */

function calculateStatistics(values) {

  if (
    !Array.isArray(values) ||
    !values.length
  ) {

    return {
      mean: 0,
      min: 0,
      max: 0,
      count: 0
    };

  }


  const sum =
    values.reduce(
      (total, value) =>
        total + Number(value),
      0
    );


  return {

    mean:
      sum / values.length,

    min:
      Math.min(...values),

    max:
      Math.max(...values),

    count:
      values.length

  };

}


function updateStatistics(values) {

  const stats =
    calculateStatistics(values);


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

function calculateTrend(values) {

  if (
    !values ||
    values.length < 2
  ) {

    return "Insufficient data";

  }


  const first =
    Number(values[0]);

  const last =
    Number(
      values[
        values.length - 1
      ]
    );


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


/* =========================================================
   PEARSON CORRELATION
   ========================================================= */

function pearsonCorrelation(
  x,
  y
) {

  const n =
    Math.min(
      x.length,
      y.length
    );


  if (n < 2) {
    return null;
  }


  const xs =
    x.slice(0, n)
      .map(Number);

  const ys =
    y.slice(0, n)
      .map(Number);


  const meanX =
    xs.reduce(
      (a, b) => a + b,
      0
    ) / n;


  const meanY =
    ys.reduce(
      (a, b) => a + b,
      0
    ) / n;


  let numerator = 0;

  let denominatorX = 0;

  let denominatorY = 0;


  for (
    let i = 0;
    i < n;
    i++
  ) {

    const dx =
      xs[i] - meanX;

    const dy =
      ys[i] - meanY;


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


/* =========================================================
   LAGGED CORRELATION
   ========================================================= */

function laggedCorrelation(
  environment,
  performance,
  lag
) {

  if (
    environment.length <= lag ||
    performance.length <= lag
  ) {

    return null;

  }


  const x =
    environment.slice(
      0,
      environment.length - lag
    );


  const y =
    performance.slice(
      lag
    );


  return pearsonCorrelation(
    x,
    y
  );

}


/* =========================================================
   PREDICTIVE LATENCY
   ========================================================= */

function predictLatency() {

  const baseline =
    240;


  const current =
    calculatePerformanceIndicator();


  const difference =
    current - baseline;


  const lagFactor =
    1 -
    Math.exp(
      -state.selectedLag / 3
    );


  const prediction =
    baseline +
    difference *
    lagFactor;


  return Math.round(
    prediction
  );

}


/* =========================================================
   ANALYSIS
   ========================================================= */

function updateAnalysis() {

  const dataset =
    state.customDataset ||
    DEMO_DATASETS[
      getCurrentDemoDataset()
    ];


  const values =
    dataset.environment;


  const performance =
    dataset.performance;


  const trend =
    calculateTrend(values);


  const correlation =
    laggedCorrelation(
      values,
      performance,
      state.selectedLag
    );


  const prediction =
    predictLatency();


  const risk =
    calculateEnvironmentalIndex();


  setText(
    "trend-result",
    trend
  );


  setText(
    "pearson-result",
    correlation === null
      ? "--"
      : correlation.toFixed(3)
  );


  setText(
    "correlation-result",
    correlation === null
      ? "Insufficient data"
      : correlation.toFixed(3)
  );


  setText(
    "lag-result",
    `${state.selectedLag} h`
  );


  setText(
    "prediction-result",
    `${prediction} ms`
  );


  setText(
    "prediction-change",
    `${(
      ((prediction - 240) /
        240) *
      100
    ).toFixed(1)}%`
  );


  setText(
    "risk-index-result",
    risk.label
  );


  const riskElement =
    $("#risk-index-result");

  if (riskElement) {

    riskElement.classList.remove(
      "risk-low",
      "risk-moderate",
      "risk-high"
    );

    riskElement.classList.add(
      risk.className
    );

  }


  updateStatistics(
    values
  );

}


/* =========================================================
   CSV UPLOAD
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


  if (
    browse &&
    input
  ) {

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

        if (!file) {
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
      "Please upload a CSV file."
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

          performance:
            parsed.performance,

          co2Column:
            parsed.co2Column,

          timeColumn:
            parsed.timeColumn

        };


        state.environment.co2 =
          parsed.values[
            parsed.values.length - 1
          ];


        updateEnvironmentControls();

        updateDashboardMetrics();

        updateCustomCharts();

        updateDatasetInformation();

        updateAnalysis();


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


  if (
    rows.length < 2
  ) {

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


  const normalized =
    headers.map(
      header =>
        header
          .toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            ""
          )
    );


  let co2Index =
    normalized.findIndex(
      header =>
        header.includes("co2") ||
        header.includes("carbondioxide") ||
        header.includes("environment")
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
    normalized.findIndex(
      header =>
        header.includes("time") ||
        header.includes("date") ||
        header.includes("timestamp") ||
        header.includes("label")
    );


  const performanceIndex =
    normalized.findIndex(
      header =>
        header.includes("reactiontime") ||
        header.includes("performance") ||
        header.includes("rt")
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


    const value =
      parseFloat(
        String(
          row[co2Index] ?? ""
        )
          .replace(
            /,/g,
            ""
          )
          .trim()
      );


    if (
      !Number.isFinite(value)
    ) {
      continue;
    }


    values.push(value);


    labels.push(
      timeIndex >= 0 &&
      row[timeIndex]
        ? row[timeIndex].trim()
        : `Row ${values.length}`
    );


    if (
      performanceIndex >= 0
    ) {

      const rt =
        parseFloat(
          String(
            row[performanceIndex]
          )
            .replace(
              /,/g,
              ""
            )
            .trim()
        );


      performance.push(
        Number.isFinite(rt)
          ? rt
          : null
      );

    }

  }


  if (
    !values.length
  ) {

    return {

      success: false,

      message:
        "The CO₂ column was found, but no numeric values were detected."

    };

  }


  const cleanedPerformance =
    performance.length === values.length
      ? performance.map(
          (value, index) =>
            value ??
            values[index] * 0.05
        )
      : values.map(
          value =>
            Math.round(
              240 +
              ((value - 1200) /
                1200) *
              70
            )
        );


  return {

    success: true,

    values,

    labels,

    performance:
      cleanedPerformance,

    co2Column:
      headers[co2Index],

    timeColumn:
      timeIndex >= 0
        ? headers[timeIndex]
        : "Not detected"

  };

}


/* =========================================================
   CSV ROW PARSER
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


    if (
      char === '"'
    ) {

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
   CUSTOM CHARTS
   ========================================================= */

function updateCustomCharts() {

  const dataset =
    state.customDataset;

  if (!dataset) {
    return;
  }


  updateChartData(
    state.charts.environment,
    dataset.labels,
    dataset.values
  );


  updateChartData(
    state.charts.performance,
    dataset.labels,
    dataset.performance
  );

}


/* =========================================================
   CLEAR DATASET
   ========================================================= */

function clearDataset() {

  state.customDataset =
    null;


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


  const dataset =
    DEMO_DATASETS.baseline;


  state.environment.co2 =
    dataset.environment[
      dataset.environment.length - 1
    ];


  updateEnvironmentControls();

  updateDashboardMetrics();


  updateChartData(
    state.charts.environment,
    dataset.labels,
    dataset.environment
  );


  updateChartData(
    state.charts.performance,
    dataset.labels,
    dataset.performance
  );


  updateDatasetInformation();

  updateAnalysis();


  setFileStatus(
    "Custom dataset cleared. Synthetic demonstration dataset restored."
  );

}


/* =========================================================
   DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

  if (!state.customDataset) {

    const dataset =
      DEMO_DATASETS[
        getCurrentDemoDataset()
      ];


    setText(
      "dataset-badge",
      "SYNTHETIC DEMO"
    );


    setText(
      "dataset-name",
      dataset.name
    );


    setText(
      "dataset-rows",
      String(
        dataset.environment.length
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
      "Synthetic demonstration dataset"
    );


    setText(
      "statistics-source",
      "Synthetic local dataset"
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


  setText(
    "statistics-source",
    "Custom local dataset"
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


  if (
    !startButton ||
    !box
  ) {
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
    1200 +
    Math.random() *
    3000;


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

    }


    pvt.running =
      false;

    pvt.ready =
      false;

    pvt.lapses++;


    const box =
      $("#pvt-box");


    if (box) {

      box.classList.add(
        "false-start"
      );

      box.textContent =
        "False start — press Start Test";

    }


    enablePVTButton();

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
    reactionTime > 500
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


  enablePVTButton();

  updatePVTResults();

}


function enablePVTButton() {

  const button =
    $("#pvt-start-btn");

  if (button) {
    button.disabled =
      false;
  }

}


/* =========================================================
   PVT RESULTS + RECIPROCAL REACTION TIME
   ========================================================= */

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
      "pvt-best",
      "-- ms"
    );

    setText(
      "pvt-rrt",
      "-- s⁻¹"
    );

    setText(
      "mean-rrt",
      "-- s⁻¹"
    );

    return;

  }


  const last =
    trials[count - 1];


  const average =
    trials.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / count;


  const best =
    Math.min(...trials);


  /*
    RRT = 1000 / RT(ms)
  */

  const rrtValues =
    trials.map(
      rt =>
        1000 / rt
    );


  const meanRRT =
    rrtValues.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / rrtValues.length;


  const lastRRT =
    1000 / last;


  setText(
    "pvt-score",
    `${last} ms`
  );


  setText(
    "pvt-average",
    `${Math.round(average)} ms`
  );


  setText(
    "pvt-best",
    `${best} ms`
  );


  setText(
    "pvt-rrt",
    `${lastRRT.toFixed(3)} s⁻¹`
  );


  setText(
    "mean-rrt",
    `${meanRRT.toFixed(3)} s⁻¹`
  );

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
`time,CO2_ppm,reaction_time_ms
T-6h,1100,235
T-5h,1150,238
T-4h,1180,240
T-3h,1200,242
T-2h,1210,244
T-1h,1190,241
Current,1200,240
`;


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
    document.createElement(
      "a"
    );


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

  const e =
    state.environment;


  const performance =
    calculatePerformanceIndicator();


  const risk =
    calculateEnvironmentalIndex();


  const trials =
    state.pvt.trials;


  const average =
    trials.length
      ? trials.reduce(
          (a, b) => a + b,
          0
        ) / trials.length
      : null;


  const rrt =
    trials.length
      ? trials.map(
          rt =>
            1000 / rt
        ).reduce(
          (a, b) => a + b,
          0
        ) / trials.length
      : null;


  const report =
`SPACE NEUROHEALTH
Research Prototype Summary

ENVIRONMENT
CO₂: ${formatNumber(e.co2)} ppm
Radiation exposure: ${formatNumber(e.radiation)} mSv/day
Continuous wakefulness: ${formatNumber(e.wakefulness)} h
Circadian offset: ${e.circadianOffset >= 0 ? "+" : ""}${formatNumber(e.circadianOffset)} h
Temperature: ${formatNumber(e.temperature)} °C
Humidity: ${formatNumber(e.humidity)}%

ANALYSIS
Demonstration performance indicator: ${performance} ms
Environmental index: ${risk.label}
Environmental index score: ${risk.score.toFixed(1)}
Lag window: ${state.selectedLag} h

DATASET
${state.customDataset
  ? state.customDataset.name
  : DEMO_DATASETS[getCurrentDemoDataset()].name}

PVT
Trials: ${trials.length}
Lapses: ${state.pvt.lapses}
Average RT: ${average ? Math.round(average) + " ms" : "--"}
Mean RRT: ${rrt ? rrt.toFixed(3) + " s⁻¹" : "--"}

DATA STATUS
This prototype distinguishes synthetic demonstration data
from user-loaded data. Demonstration performance relationships
are illustrative and are not validated physiological predictions.
`;


  const confirmed =
    window.confirm(
      `${report}\n\nOpen the browser print dialog to save this report as PDF?`
    );


  if (confirmed) {

    const oldTitle =
      document.title;


    document.title =
      "Space NeuroHealth Research Summary";


    window.print();


    setTimeout(
      () => {

        document.title =
          oldTitle;

      },
      1000
    );

  }

}


/* =========================================================
   CHART RESIZE
   ========================================================= */

function resizeCharts() {

  setTimeout(
    () => {

      Object.values(
        state.charts
      ).forEach(
        chart => {

          if (chart) {
            chart.resize();
          }

        }
      );

    },
    150
  );

}


/* =========================================================
   ERROR HANDLING
   ========================================================= */

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


        enablePVTButton();

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

  setupEnvironmentControls();

  setupCSV();

  setupDemoDatasetSelector();

  setupPVT();

  setupTemplateDownload();

  setupExport();

  setupKeyboardNavigation();


  updateEnvironmentControls();

  updateStatistics(
    DEMO_DATASETS.baseline.environment
  );

  updateDatasetInformation();


  createCharts();

  updateDashboardMetrics();

  updateAnalysis();

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
