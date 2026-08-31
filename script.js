/* =========================================================
   SPACE NEUROHEALTH
   FINAL APPLICATION JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const DATASETS = {

  demo: {

    name: "Space NeuroHealth Demonstration",

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


  "iss-inspired": {

    name:
      "ISS Environment-Inspired Demonstration",

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
      1250,
      1300,
      1340,
      1390,
      1450,
      1410,
      1480
    ],

    performance: [
      242,
      245,
      247,
      251,
      255,
      257,
      260
    ]

  },


  "sleep-demo": {

    name:
      "Sleep / Circadian Demonstration",

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
      1160,
      1170,
      1180,
      1190,
      1200,
      1210
    ],

    performance: [
      240,
      244,
      248,
      252,
      258,
      263,
      269
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

    wakefulness: 8,

    circadian: 0,

    temperature: 22,

    humidity: 45,

    performance: 240,

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

    radiation: 3.5,

    wakefulness: 12,

    circadian: 1.5,

    temperature: 24,

    humidity: 55,

    performance: 275,

    status: "Elevated Demonstration",

    statusClass: "",

    interpretationTitle:
      "Elevated demonstration condition",

    interpretationText:
      "The simulator represents a higher environmental measurement combined with contextual environmental variables. The associated performance value is illustrative and should not be interpreted as evidence of a physiological effect."

  },


  high: {

    name: "High Exposure",

    co2: 4000,

    radiation: 6.5,

    wakefulness: 18,

    circadian: 3,

    temperature: 27,

    humidity: 65,

    performance: 330,

    status: "High Demonstration",

    statusClass: "",

    interpretationTitle:
      "High demonstration condition",

    interpretationText:
      "This scenario represents substantially elevated demonstration variables. Validated datasets and documented scientific models would be required before drawing conclusions about human performance."

  }

};


/* =========================================================
   STATE
   ========================================================= */

const state = {

  activeScenario: "baseline",

  currentCO2: 1200,

  environment: {

    radiation: 1.8,

    wakefulness: 8,

    circadian: 0,

    temperature: 22,

    humidity: 45

  },

  customDataset: null,

  activeDataset: DATASETS.demo,

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

    element.textContent =
      value;

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


function clamp(value, min, max) {

  return Math.min(
    max,
    Math.max(min, value)
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

          runCorrelation();

          updatePrediction();

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


          $all(".scenario-btn").forEach(
            btn => {

              btn.classList.toggle(
                "active",
                btn === button
              );

            }
          );


          applyScenario(
            SCENARIOS[name]
          );

        }
      );

    }
  );

}


function applyScenario(scenario) {

  state.currentCO2 =
    scenario.co2;


  state.environment.radiation =
    scenario.radiation;

  state.environment.wakefulness =
    scenario.wakefulness;

  state.environment.circadian =
    scenario.circadian;

  state.environment.temperature =
    scenario.temperature;

  state.environment.humidity =
    scenario.humidity;


  updateAllControls();

  updatePrimaryMetrics(
    scenario.performance
  );

  updateEnvironmentIndex();

  updateEnvironmentChartForScenario();

  updateAnalysis();

  updatePrediction();

}


/* =========================================================
   PRIMARY METRICS
   ========================================================= */

function updatePrimaryMetrics(
  performance
) {

  setText(
    "co2-slider-value",
    `${formatNumber(state.currentCO2)} ppm`
  );


  setText(
    "environment-value",
    formatNumber(state.currentCO2)
  );


  setText(
    "environment-unit",
    "ppm CO₂"
  );


  let statusText;

  if (
    state.currentCO2 <= 1500
  ) {

    statusText =
      "Nominal Demonstration";

  } else if (
    state.currentCO2 <= 3000
  ) {

    statusText =
      "Elevated Demonstration";

  } else {

    statusText =
      "High Demonstration";

  }


  setText(
    "environment-status",
    statusText
  );


  const status =
    $("#environment-status");


  if (status) {

    status.classList.remove(
      "safe-text"
    );


    if (
      state.currentCO2 <= 1500
    ) {

      status.classList.add(
        "safe-text"
      );

    }

  }


  setText(
    "performance-value",
    formatNumber(performance)
  );


  setText(
    "performance-status",
    "Demonstration reference"
  );


  const difference =
    (
      (performance -
        SCENARIOS.baseline.performance) /
      SCENARIOS.baseline.performance
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


  setText(
    "science-title",
    state.activeScenario === "baseline"
      ? SCENARIOS.baseline.interpretationTitle
      : "Interactive environmental adjustment"
  );


  setText(
    "science-text",
    state.activeScenario === "baseline"
      ? SCENARIOS.baseline.interpretationText
      : "The interactive simulator combines environmental parameters with a simulated performance indicator. The relationships are illustrative and are not validated physiological predictions."
  );

}


/* =========================================================
   SLIDER SETUP
   ========================================================= */

function setupSlider() {

  const co2 =
    $("#co2-slider");


  if (co2) {

    co2.addEventListener(
      "input",
      () => {

        state.currentCO2 =
          Number(co2.value);

        state.activeScenario =
          "custom";

        updatePrimaryFromControls();

      }
    );

  }


  const controls = [

    [
      "radiation-slider",
      "radiation"
    ],

    [
      "wake-slider",
      "wakefulness"
    ],

    [
      "circadian-slider",
      "circadian"
    ],

    [
      "temperature-slider",
      "temperature"
    ],

    [
      "humidity-slider",
      "humidity"
    ]

  ];


  controls.forEach(
    ([id, property]) => {

      const input =
        document.getElementById(id);


      if (!input) {
        return;
      }


      input.addEventListener(
        "input",
        () => {

          state.environment[property] =
            Number(input.value);

          state.activeScenario =
            "custom";

          updateAllControls();

          updateEnvironmentIndex();

          updatePrimaryFromControls();

        }
      );

    }
  );

}


function updatePrimaryFromControls() {

  const performance =
    calculatePerformanceReference(
      state.currentCO2,
      state.environment
    );


  updatePrimaryMetrics(
    performance
  );


  updateEnvironmentIndex();

  updateAnalysis();

  updatePrediction();

  updateEnvironmentChartForScenario();

}


function updateAllControls() {

  const co2 =
    $("#co2-slider");


  if (co2) {

    co2.value =
      clamp(
        state.currentCO2,
        Number(co2.min),
        Number(co2.max)
      );

  }


  setText(
    "co2-slider-value",
    `${formatNumber(state.currentCO2)} ppm`
  );


  const radiation =
    $("#radiation-slider");

  if (radiation) {

    radiation.value =
      state.environment.radiation;

  }

  setText(
    "radiation-value",
    `${state.environment.radiation.toFixed(1)} mSv/day`
  );


  const wake =
    $("#wake-slider");

  if (wake) {

    wake.value =
      state.environment.wakefulness;

  }

  setText(
    "wake-value",
    `${formatNumber(state.environment.wakefulness)} h`
  );


  const circadian =
    $("#circadian-slider");

  if (circadian) {

    circadian.value =
      state.environment.circadian;

  }

  setText(
    "circadian-value",
    `${state.environment.circadian >= 0 ? "+" : ""}${state.environment.circadian.toFixed(1)} h`
  );


  const temperature =
    $("#temperature-slider");

  if (temperature) {

    temperature.value =
      state.environment.temperature;

  }

  setText(
    "temperature-value",
    `${state.environment.temperature.toFixed(1)} °C`
  );


  const humidity =
    $("#humidity-slider");

  if (humidity) {

    humidity.value =
      state.environment.humidity;

  }

  setText(
    "humidity-value",
    `${state.environment.humidity}%`
  );

}


/* =========================================================
   PERFORMANCE REFERENCE
   ========================================================= */

function calculatePerformanceReference(
  co2,
  environment
) {

  const co2Effect =
    Math.max(
      0,
      (co2 - 1200) / 3800
    ) * 65;


  const wakeEffect =
    Math.max(
      0,
      environment.wakefulness - 8
    ) * 2.4;


  const circadianEffect =
    Math.abs(
      environment.circadian
    ) * 2.5;


  const radiationEffect =
    Math.max(
      0,
      environment.radiation - 2
    ) * 1.4;


  const temperatureEffect =
    Math.max(
      0,
      Math.abs(
        environment.temperature - 22
      ) - 2
    ) * 2;


  const humidityEffect =
    Math.max(
      0,
      Math.abs(
        environment.humidity - 45
      ) - 15
    ) * 0.25;


  return Math.round(
    clamp(
      240 +
      co2Effect +
      wakeEffect +
      circadianEffect +
      radiationEffect +
      temperatureEffect +
      humidityEffect,
      220,
      360
    )
  );

}


/* =========================================================
   ENVIRONMENT INDEX
   ========================================================= */

function calculateEnvironmentIndex() {

  const co2Component =
    clamp(
      ((state.currentCO2 - 800) /
        3200) * 40,
      0,
      40
    );


  const radiationComponent =
    clamp(
      state.environment.radiation * 2.5,
      0,
      20
    );


  const wakeComponent =
    clamp(
      Math.max(
        0,
        state.environment.wakefulness - 8
      ) * 2,
      0,
      15
    );


  const circadianComponent =
    clamp(
      Math.abs(
        state.environment.circadian
      ) * 2,
      0,
      10
    );


  const temperatureComponent =
    clamp(
      Math.abs(
        state.environment.temperature - 22
      ) * 1.5,
      0,
      8
    );


  const humidityComponent =
    clamp(
      Math.abs(
        state.environment.humidity - 45
      ) * 0.2,
      0,
      7
    );


  return Math.round(
    clamp(
      co2Component +
      radiationComponent +
      wakeComponent +
      circadianComponent +
      temperatureComponent +
      humidityComponent,
      0,
      100
    )
  );

}


function updateEnvironmentIndex() {

  const index =
    calculateEnvironmentIndex();


  setText(
    "environment-index",
    `${index} / 100`
  );


  let status =
    "Demonstration condition";


  if (index < 25) {

    status =
      "Lower simulated index";

  } else if (index < 50) {

    status =
      "Moderate simulated index";

  } else if (index < 75) {

    status =
      "Elevated simulated index";

  } else {

    status =
      "High simulated index";

  }


  setText(
    "environment-index-status",
    status
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


  createEnvironmentChart();

  createPerformanceChart();

}


function destroyChart(
  chart
) {

  if (chart) {

    try {

      chart.destroy();

    } catch (error) {

      console.warn(
        "Chart destruction warning:",
        error
      );

    }

  }

}


function createEnvironmentChart() {

  const canvas =
    $("#environmentChart");


  if (!canvas) {
    return;
  }


  destroyChart(
    state.charts.environment
  );


  try {

    state.charts.environment =
      new Chart(
        canvas,
        {

          type: "line",

          data: {

            labels:
              state.activeDataset.labels,

            datasets: [

              {

                label:
                  "CO₂",

                data:
                  state.activeDataset.environment,

                borderColor:
                  "#51d7e8",

                backgroundColor:
                  "rgba(81, 215, 232, 0.10)",

                borderWidth:
                  2,

                fill:
                  true,

                tension:
                  0.35,

                pointRadius:
                  4,

                pointHoverRadius:
                  6

              }

            ]

          },


          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            interaction: {

              intersect:
                false,

              mode:
                "index"

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

          }

        }
      );

  } catch (error) {

    console.error(
      "Environment chart error:",
      error
    );

    showChartError();

  }

}


function createPerformanceChart() {

  const canvas =
    $("#performanceChart");


  if (!canvas) {
    return;
  }


  if (
    typeof Chart === "undefined"
  ) {
    return;
  }


  destroyChart(
    state.charts.performance
  );


  try {

    state.charts.performance =
      new Chart(
        canvas,
        {

          type:
            "line",

          data: {

            labels:
              state.activeDataset.labels,

            datasets: [

              {

                label:
                  "Reaction Time",

                data:
                  state.activeDataset.performance,

                borderColor:
                  "#4ea1ff",

                backgroundColor:
                  "rgba(78, 161, 255, 0.10)",

                borderWidth:
                  2,

                fill:
                  true,

                tension:
                  0.35,

                pointRadius:
                  4,

                pointHoverRadius:
                  6

              }

            ]

          },


          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,


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

          }

        }
      );

  } catch (error) {

    console.error(
      "Performance chart error:",
      error
    );

  }

}


/* =========================================================
   CHART UPDATES
   ========================================================= */

function updateEnvironmentChartForScenario() {

  if (
    !state.charts.environment
  ) {
    return;
  }


  if (state.customDataset) {
    return;
  }


  const base =
    state.currentCO2;


  const offsets = [

    -100,
    -50,
    -20,
    0,
    10,
    -10,
    0

  ];


  state.charts.environment.data.labels =
    DATASETS.demo.labels;


  state.charts.environment.data.datasets[0].data =
    offsets.map(
      offset =>
        Math.max(
          0,
          base + offset
        )
    );


  state.charts.environment.update(
    "none"
  );


  const performance =
    calculatePerformanceReference(
      state.currentCO2,
      state.environment
    );


  const performanceData =
    offsets.map(
      offset => {

        const simulatedCO2 =
          Math.max(
            0,
            base + offset
          );

        return calculatePerformanceReference(
          simulatedCO2,
          state.environment
        );

      }
    );


  if (
    state.charts.performance
  ) {

    state.charts.performance.data.labels =
      DATASETS.demo.labels;

    state.charts.performance.data.datasets[0].data =
      performanceData;

    state.charts.performance.update(
      "none"
    );

  }


  updatePrimaryMetrics(
    performance
  );

}


function updateCustomCharts() {

  const dataset =
    state.customDataset;


  if (!dataset) {
    return;
  }


  state.activeDataset = {

    name:
      dataset.name,

    labels:
      dataset.labels,

    environment:
      dataset.values,

    performance:
      dataset.performance

  };


  if (
    state.charts.environment
  ) {

    state.charts.environment.data.labels =
      dataset.labels;

    state.charts.environment.data.datasets[0].data =
      dataset.values;

    state.charts.environment.update();

  }


  if (
    state.charts.performance
  ) {

    state.charts.performance.data.labels =
      dataset.labels;

    state.charts.performance.data.datasets[0].data =
      dataset.performance;

    state.charts.performance.update();

  }


  state.currentCO2 =
    dataset.values[
      dataset.values.length - 1
    ];


  updateAllControls();

  updatePrimaryFromControls();

}


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCharts() {

  setTimeout(
    () => {

      if (
        state.charts.environment
      ) {

        state.charts.environment.resize();

      }


      if (
        state.charts.performance
      ) {

        state.charts.performance.resize();

      }

    },
    150
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

  if (
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
        total + value,
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

  if (
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


/* =========================================================
   ANALYSIS
   ========================================================= */

function updateAnalysis() {

  const values =
    state.customDataset
      ? state.customDataset.values
      : state.activeDataset.environment;


  const trend =
    calculateTrend(values);


  setText(
    "trend-result",
    trend
  );


  const difference =
    (
      (state.currentCO2 -
        SCENARIOS.baseline.co2) /
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

}


/* =========================================================
   CORRELATION
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


  if (
    n < 2
  ) {

    return null;

  }


  const xs =
    x.slice(0, n);

  const ys =
    y.slice(0, n);


  const meanX =
    xs.reduce(
      (a, b) =>
        a + b,
      0
    ) / n;


  const meanY =
    ys.reduce(
      (a, b) =>
        a + b,
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

    return 0;

  }


  return (
    numerator /
    denominator
  );

}


function getPerformanceSeries() {

  if (
    state.customDataset
  ) {

    return state.customDataset.performance;

  }


  return state.activeDataset.performance;

}


function calculateLaggedCorrelation(
  environment,
  performance,
  lag
) {

  if (
    lag <= 0
  ) {

    return pearsonCorrelation(
      environment,
      performance
    );

  }


  if (
    environment.length <= lag ||
    performance.length <= lag
  ) {

    return null;

  }


  const environmentalValues =
    environment.slice(
      0,
      environment.length - lag
    );


  const performanceValues =
    performance.slice(
      lag
    );


  return pearsonCorrelation(
    environmentalValues,
    performanceValues
  );

}


function runCorrelation() {

  const environment =
    state.customDataset
      ? state.customDataset.values
      : state.activeDataset.environment;


  const performance =
    getPerformanceSeries();


  const lagSelect =
    $("#lag-select");


  const lag =
    lagSelect
      ? Number(lagSelect.value)
      : 0;


  const correlation =
    calculateLaggedCorrelation(
      environment,
      performance,
      lag
    );


  setText(
    "lag-result",
    `${lag} h`
  );


  setText(
    "correlation-n",
    correlation === null
      ? "--"
      : String(
          Math.min(
            environment.length - lag,
            performance.length - lag
          )
        )
  );


  if (
    correlation === null
  ) {

    setText(
      "pearson-result",
      "--"
    );

    setText(
      "correlation-interpretation",
      "Insufficient data"
    );

    return;

  }


  setText(
    "pearson-result",
    correlation.toFixed(3)
  );


  const absolute =
    Math.abs(correlation);


  let interpretation;


  if (
    absolute < 0.2
  ) {

    interpretation =
      "Very weak association";

  } else if (
    absolute < 0.4
  ) {

    interpretation =
      "Weak association";

  } else if (
    absolute < 0.6
  ) {

    interpretation =
      "Moderate association";

  } else if (
    absolute < 0.8
  ) {

    interpretation =
      "Strong association";

  } else {

    interpretation =
      "Very strong association";

  }


  setText(
    "correlation-interpretation",
    interpretation
  );

}


/* =========================================================
   PREDICTION
   ========================================================= */

function updatePrediction() {

  const performance =
    calculatePerformanceReference(
      state.currentCO2,
      state.environment
    );


  const index =
    calculateEnvironmentIndex();


  setText(
    "predicted-latency",
    `${performance} ms`
  );


  setText(
    "prediction-index",
    `${index} / 100`
  );


  setText(
    "prediction-status",
    state.customDataset
      ? "Custom-data reference"
      : "Demonstration"
  );

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


  if (
    browse &&
    input
  ) {

    browse.addEventListener(
      "click",
      () =>
        input.click()
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
          event.dataTransfer.files?.[0];


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


        if (
          !parsed.success
        ) {

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

          co2Column:
            parsed.co2Column,

          timeColumn:
            parsed.timeColumn,

          performance:
            parsed.values.map(
              value =>
                estimatePerformanceFromCO2(
                  value
                )
            )

        };


        updateDatasetInformation();

        updateCustomCharts();

        updateAnalysis();

        updatePrediction();

        runCorrelation();


        const clear =
          $("#clear-csv-btn");


        if (clear) {

          clear.disabled =
            false;

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


  const co2Keywords = [

    "co2",

    "carbondioxide",

    "co2ppm",

    "co2concentration",

    "environment"

  ];


  let co2Index = -1;


  for (
    let i = 0;
    i < normalizedHeaders.length;
    i++
  ) {

    const header =
      normalizedHeaders[i];


    if (
      co2Keywords.some(
        keyword =>
          header.includes(
            keyword
          )
      )
    ) {

      co2Index =
        i;

      break;

    }

  }


  if (
    co2Index === -1
  ) {

    for (
      let i = 0;
      i < normalizedHeaders.length;
      i++
    ) {

      if (
        normalizedHeaders[i]
          .includes("carbon")
      ) {

        co2Index =
          i;

        break;

      }

    }

  }


  if (
    co2Index === -1
  ) {

    return {

      success: false,

      message:
        "No CO₂ measurement column was detected. Try CO2, carbon_dioxide, CO2_ppm, or environment."

    };

  }


  const timeIndex =
    normalizedHeaders.findIndex(
      header =>
        header.includes("time") ||
        header.includes("date") ||
        header.includes("timestamp") ||
        header.includes("label")
    );


  const values = [];

  const labels = [];


  for (
    let rowIndex = 1;
    rowIndex < rows.length;
    rowIndex++
  ) {

    const row =
      rows[rowIndex];


    if (
      !row.length
    ) {

      continue;

    }


    const rawValue =
      row[co2Index];


    const value =
      parseFloat(
        String(rawValue)
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

  }


  if (
    !values.length
  ) {

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

  let insideQuotes =
    false;


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
   PERFORMANCE ESTIMATION FOR CUSTOM DATA
   ========================================================= */

function estimatePerformanceFromCO2(
  value
) {

  const relative =
    (value - 1200) /
    1200;


  return Math.round(
    clamp(
      240 +
      relative * 70,
      220,
      360
    )
  );

}


/* =========================================================
   DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

  if (
    !state.customDataset
  ) {

    setText(
      "dataset-badge",
      "DEMONSTRATION"
    );


    setText(
      "dataset-name",
      state.activeDataset.name
    );


    setText(
      "dataset-rows",
      String(
        state.activeDataset.environment.length
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

      validation.classList.add(
        "safe-text"
      );

    }


    setText(
      "statistics-source",
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
   CLEAR DATASET
   ========================================================= */

function clearDataset() {

  state.customDataset =
    null;


  state.activeDataset =
    DATASETS.demo;


  const input =
    $("#csv-file-input");


  if (input) {

    input.value =
      "";

  }


  const clear =
    $("#clear-csv-btn");


  if (clear) {

    clear.disabled =
      true;

  }


  setFileStatus(
    "Custom dataset cleared. Demonstration dataset restored."
  );


  updateDatasetInformation();


  createCharts();


  applyScenario(
    SCENARIOS[
      state.activeScenario === "custom"
        ? "baseline"
        : state.activeScenario
    ]
  );


  if (
    state.activeScenario === "custom"
  ) {

    state.activeScenario =
      "baseline";

  }


  updateAnalysis();

  updatePrediction();

  runCorrelation();

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
   BENCHMARK DATASET LOADING
   ========================================================= */

function setupBenchmarks() {

  const button =
    $("#load-benchmark-btn");


  const select =
    $("#benchmark-select");


  if (
    !button ||
    !select
  ) {

    return;

  }


  button.addEventListener(
    "click",
    () => {

      const key =
        select.value;


      const dataset =
        DATASETS[key];


      if (!dataset) {
        return;
      }


      state.customDataset =
        null;


      state.activeDataset =
        dataset;


      const clear =
        $("#clear-csv-btn");


      if (clear) {

        clear.disabled =
          true;

      }


      const input =
        $("#csv-file-input");


      if (input) {

        input.value =
          "";

      }


      state.currentCO2 =
        dataset.environment[
          dataset.environment.length - 1
        ];


      setFileStatus(
        `${dataset.name} loaded locally as a demonstration dataset.`
      );


      updateDatasetInformation();

      updateAllControls();

      createCharts();

      updatePrimaryFromControls();

      updateAnalysis();

      updatePrediction();

      runCorrelation();

    }
  );

}


/* =========================================================
   CSV TEMPLATE EXPORT
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
`timestamp,CO2_ppm
T-6h,1100
T-5h,1150
T-4h,1180
T-3h,1200
T-2h,1210
T-1h,1190
Current,1200
`;


  const blob =
    new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
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

  if (
    !values.length
  ) {

    return null;

  }


  const sorted =
    [...values].sort(
      (a, b) =>
        a - b
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


  if (
    !count
  ) {

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
      "pvt-lapses",
      String(
        state.pvt.lapses
      )
    );

    setText(
      "pvt-rrt",
      "--"
    );

    setText(
      "pvt-latest-rrt",
      "--"
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


  const best =
    Math.min(
      ...trials
    );


  const median =
    calculateMedian(
      trials
    );


  const reciprocalValues =
    trials.map(
      rt =>
        1000 / rt
    );


  const meanRRT =
    reciprocalValues.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    reciprocalValues.length;


  const latestRRT =
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
    "pvt-lapses",
    String(
      state.pvt.lapses
    )
  );


  setText(
    "pvt-rrt",
    meanRRT.toFixed(2)
  );


  setText(
    "pvt-latest-rrt",
    latestRRT.toFixed(2)
  );


  setText(
    "pvt-median",
    `${Math.round(median)} ms`
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
    ] ||
    SCENARIOS.baseline;


  const currentPerformance =
    $("#performance-value")
      ?.textContent ||
    "--";


  const change =
    $("#change-value")
      ?.textContent ||
    "--";


  const pvtAverage =
    $("#pvt-average")
      ?.textContent ||
    "--";


  const pvtRRT =
    $("#pvt-rrt")
      ?.textContent ||
    "--";


  const index =
    $("#environment-index")
      ?.textContent ||
    "--";


  const correlation =
    $("#pearson-result")
      ?.textContent ||
    "--";


  const lag =
    $("#lag-result")
      ?.textContent ||
    "--";


  const datasetName =
    state.customDataset
      ? state.customDataset.name
      : state.activeDataset.name;


  const originalTitle =
    document.title;


  document.title =
    "Space NeuroHealth Research Summary";


  const message =
`SPACE NEUROHEALTH
RESEARCH SUMMARY

Scenario:
${scenario.name}

Environmental settings:
CO₂: ${formatNumber(state.currentCO2)} ppm
Radiation: ${state.environment.radiation.toFixed(1)} mSv/day
Continuous wakefulness: ${state.environment.wakefulness} h
Circadian offset: ${state.environment.circadian} h
Temperature: ${state.environment.temperature.toFixed(1)} °C
Humidity: ${state.environment.humidity}%

Environment index:
${index}

Performance indicator:
${currentPerformance} ms

Baseline difference:
${change}

Dataset:
${datasetName}

Correlation:
Pearson r = ${correlation}
Lag = ${lag}

PVT:
Trials = ${state.pvt.trials.length}
Average RT = ${pvtAverage}
Mean RRT = ${pvtRRT}
Lapses >500 ms = ${state.pvt.lapses}

STATUS:
Demonstration / exploratory research prototype.

This report does not constitute a medical,
diagnostic or validated physiological assessment.`;


  const shouldPrint =
    window.confirm(
      `${message}\n\nOpen the print dialog to save this summary as PDF?`
    );


  if (
    shouldPrint
  ) {

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

        if (
          state.pvt.timer
        ) {

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
   INITIALIZATION
   ========================================================= */

function initializeApp() {

  setupNavigation();

  setupScenarios();

  setupSlider();

  setupCSV();

  setupBenchmarks();

  setupTemplateDownload();

  setupPVT();

  setupExport();

  setupKeyboardNavigation();


  state.activeDataset =
    DATASETS.demo;


  updateAllControls();

  updateDatasetInformation();

  updateStatistics(
    DATASETS.demo.environment
  );


  createCharts();


  applyScenario(
    SCENARIOS.baseline
  );


  updateAnalysis();

  updatePrediction();

  runCorrelation();

}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

}
