/* =========================================================
   SPACE NEUROHEALTH
   APPLICATION JAVASCRIPT
   FINAL INTEGRATED VERSION
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
    1.5,
    1.6,
    1.7,
    1.8,
    1.9,
    1.8,
    1.8
  ],

  temperature: [
    21.8,
    21.9,
    22.0,
    22.1,
    22.0,
    22.0,
    22.0
  ],

  humidity: [
    43,
    44,
    45,
    46,
    45,
    45,
    45
  ],

  pressure: [
    101.2,
    101.3,
    101.3,
    101.4,
    101.3,
    101.3,
    101.3
  ],

  wakefulness: [
    9,
    10,
    11,
    12,
    13,
    14,
    14
  ]

};


/* =========================================================
   BUILT-IN SIMULATED DATASETS
   ========================================================= */

const BUILT_IN_DATASETS = {

  iss: {

    name: "Simulated ISS Environment",

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
      1350,
      1500,
      1750,
      1600,
      1900,
      1800
    ],

    performance: [
      238,
      241,
      243,
      247,
      245,
      249,
      248
    ],

    radiation: [
      1.5,
      1.7,
      1.8,
      2.0,
      2.1,
      2.2,
      2.0
    ],

    temperature: [
      21.8,
      21.9,
      22.1,
      22.2,
      22.0,
      22.1,
      22.0
    ],

    humidity: [
      42,
      44,
      45,
      47,
      46,
      48,
      46
    ],

    pressure: [
      101.2,
      101.2,
      101.3,
      101.3,
      101.2,
      101.3,
      101.3
    ],

    wakefulness: [
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ]

  },


  sleep: {

    name: "Simulated Sleep-Deprivation",

    labels: [
      "Wake 8h",
      "Wake 10h",
      "Wake 12h",
      "Wake 14h",
      "Wake 16h",
      "Wake 18h",
      "Wake 20h"
    ],

    environment: [
      1100,
      1120,
      1150,
      1180,
      1200,
      1210,
      1220
    ],

    performance: [
      235,
      240,
      246,
      255,
      267,
      281,
      298
    ],

    radiation: [
      1.6,
      1.6,
      1.6,
      1.6,
      1.6,
      1.6,
      1.6
    ],

    temperature: [
      22,
      22,
      22,
      22,
      22,
      22,
      22
    ],

    humidity: [
      45,
      45,
      45,
      45,
      45,
      45,
      45
    ],

    pressure: [
      101.3,
      101.3,
      101.3,
      101.3,
      101.3,
      101.3,
      101.3
    ],

    wakefulness: [
      8,
      10,
      12,
      14,
      16,
      18,
      20
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

    wakefulness: 14,

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

    radiation: 2.5,

    temperature: 24,

    humidity: 55,

    pressure: 99.5,

    wakefulness: 18,

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

    pressure: 96,

    wakefulness: 21,

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

  environment: {
    radiation: 1.8,
    temperature: 22,
    humidity: 45,
    pressure: 101.3,
    wakefulness: 14
  },

  customDataset: null,

  lag: 0,

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


function formatNumber(value, decimals = 2) {

  if (!Number.isFinite(Number(value))) {
    return "0";
  }

  return Number(value).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: decimals
    }
  );

}


/* =========================================================
   SAFE ARRAY HELPERS
   ========================================================= */

function numericArray(values) {

  return (values || [])
    .map(Number)
    .filter(Number.isFinite);

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


        $all(".section")
          .forEach(section => {

            const active =
              section.id === sectionId;

            section.hidden =
              !active;

          });


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

          const name =
            button.dataset.scenario;

          if (!SCENARIOS[name]) {
            return;
          }


          state.activeScenario =
            name;

          state.customDataset =
            null;


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

  state.currentCO2 =
    scenario.co2;


  state.environment = {

    radiation:
      scenario.radiation,

    temperature:
      scenario.temperature,

    humidity:
      scenario.humidity,

    pressure:
      scenario.pressure,

    wakefulness:
      scenario.wakefulness

  };


  const slider =
    $("#co2-slider");

  if (slider) {
    slider.value =
      scenario.co2;
  }


  setText(
    "co2-slider-value",
    `${formatNumber(scenario.co2, 0)} ppm`
  );


  updateEnvironmentMetrics();


  setText(
    "performance-value",
    formatNumber(
      scenario.performance,
      0
    )
  );


  setText(
    "performance-status",
    "Demonstration reference"
  );


  updatePerformanceDifference(
    scenario.performance
  );


  setText(
    "science-title",
    scenario.interpretationTitle
  );


  setText(
    "science-text",
    scenario.interpretationText
  );


  updateEnvironmentChartForScenario();

  updateAnalysis();

}


/* =========================================================
   ENVIRONMENT METRICS
   ========================================================= */

function updateEnvironmentMetrics() {

  const env =
    state.environment;


  setText(
    "environment-value",
    formatNumber(
      state.currentCO2,
      0
    )
  );


  setText(
    "environment-unit",
    "ppm CO₂"
  );


  const co2State =
    getCO2State(
      state.currentCO2
    );


  setMetricStatus(
    "environment-status",
    co2State.label,
    co2State.className
  );


  setText(
    "radiation-value",
    formatNumber(
      env.radiation,
      1
    )
  );


  setMetricStatus(
    "radiation-status",
    getRadiationState(
      env.radiation
    ).label,
    getRadiationState(
      env.radiation
    ).className
  );


  setText(
    "temperature-value",
    formatNumber(
      env.temperature,
      1
    )
  );


  const temperatureState =
    getTemperatureState(
      env.temperature
    );

  setMetricStatus(
    "temperature-status",
    temperatureState.label,
    temperatureState.className
  );


  setText(
    "humidity-value",
    formatNumber(
      env.humidity,
      0
    )
  );


  const humidityState =
    getHumidityState(
      env.humidity
    );

  setMetricStatus(
    "humidity-status",
    humidityState.label,
    humidityState.className
  );


  setText(
    "pressure-value",
    formatNumber(
      env.pressure,
      1
    )
  );


  const pressureState =
    getPressureState(
      env.pressure
    );

  setMetricStatus(
    "pressure-status",
    pressureState.label,
    pressureState.className
  );


  setText(
    "wakefulness-value",
    formatNumber(
      env.wakefulness,
      0
    )
  );


  const wakeState =
    getWakefulnessState(
      env.wakefulness
    );

  setMetricStatus(
    "wakefulness-status",
    wakeState.label,
    wakeState.className
  );


  const index =
    calculateEnvironmentIndex();


  setText(
    "environment-index",
    `${Math.round(index)} / 100`
  );


  const indexState =
    getIndexState(index);


  setMetricStatus(
    "environment-index-state",
    indexState.label,
    indexState.className
  );

}


function setMetricStatus(
  id,
  text,
  className
) {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }


  element.textContent =
    text;


  element.classList.remove(
    "safe-text",
    "warning-text",
    "danger-text"
  );


  if (className) {
    element.classList.add(
      className
    );
  }

}


/* =========================================================
   ENVIRONMENT STATES
   ========================================================= */

function getCO2State(value) {

  if (value <= 1500) {

    return {
      label: "Nominal Demonstration",
      className: "safe-text"
    };

  }

  if (value <= 3000) {

    return {
      label: "Elevated Demonstration",
      className: "warning-text"
    };

  }

  return {
    label: "High Demonstration",
    className: "danger-text"
  };

}


function getRadiationState(value) {

  if (value <= 2) {

    return {
      label: "Nominal exposure",
      className: "safe-text"
    };

  }

  if (value <= 3) {

    return {
      label: "Elevated exposure",
      className: "warning-text"
    };

  }

  return {
    label: "High demonstration",
    className: "danger-text"
  };

}


function getTemperatureState(value) {

  const deviation =
    Math.abs(
      value - 22
    );

  if (deviation <= 2) {

    return {
      label: "Nominal range",
      className: "safe-text"
    };

  }

  if (deviation <= 4) {

    return {
      label: "Elevated deviation",
      className: "warning-text"
    };

  }

  return {
    label: "High deviation",
    className: "danger-text"
  };

}


function getHumidityState(value) {

  if (
    value >= 30 &&
    value <= 60
  ) {

    return {
      label: "Nominal range",
      className: "safe-text"
    };

  }

  if (
    value >= 20 &&
    value <= 70
  ) {

    return {
      label: "Elevated deviation",
      className: "warning-text"
    };

  }

  return {
    label: "High deviation",
    className: "danger-text"
  };

}


function getPressureState(value) {

  const deviation =
    Math.abs(
      value - 101.3
    );

  if (deviation <= 3) {

    return {
      label: "Nominal range",
      className: "safe-text"
    };

  }

  if (deviation <= 6) {

    return {
      label: "Elevated deviation",
      className: "warning-text"
    };

  }

  return {
    label: "High deviation",
    className: "danger-text"
  };

}


function getWakefulnessState(value) {

  if (value <= 16) {

    return {
      label: "Normal wake period",
      className: "safe-text"
    };

  }

  if (value <= 20) {

    return {
      label: "Extended wake period",
      className: "warning-text"
    };

  }

  return {
    label: "Very extended wake period",
    className: "danger-text"
  };

}


/* =========================================================
   ENVIRONMENT INDEX
   ========================================================= */

function normalizeDeviation(
  value,
  reference,
  tolerance,
  maximum
) {

  const deviation =
    Math.abs(
      value - reference
    );

  return clamp(
    deviation / maximum,
    0,
    1
  ) * 100;

}


function calculateEnvironmentIndex() {

  const co2 =
    clamp(
      ((state.currentCO2 - 1200) /
        2800) *
        100,
      0,
      100
    );


  const radiation =
    clamp(
      ((state.environment.radiation - 1.8) /
        2.2) *
        100,
      0,
      100
    );


  const temperature =
    normalizeDeviation(
      state.environment.temperature,
      22,
      2,
      8
    );


  const humidity =
    normalizeDeviation(
      state.environment.humidity,
      45,
      15,
      40
    );


  const pressure =
    normalizeDeviation(
      state.environment.pressure,
      101.3,
      3,
      12
    );


  const wakefulness =
    clamp(
      ((state.environment.wakefulness - 14) /
        8) *
        100,
      0,
      100
    );


  const score =

    co2 * 0.30 +

    radiation * 0.20 +

    wakefulness * 0.20 +

    temperature * 0.10 +

    humidity * 0.10 +

    pressure * 0.10;


  return clamp(
    score,
    0,
    100
  );

}


function getIndexState(index) {

  if (index < 30) {

    return {
      label: "Nominal",
      className: "safe-text"
    };

  }

  if (index < 60) {

    return {
      label: "Caution",
      className: "warning-text"
    };

  }

  return {
    label: "Elevated Risk",
    className: "danger-text"
  };

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
        `${formatNumber(value, 0)} ppm`
      );


      setText(
        "environment-value",
        formatNumber(value, 0)
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
      ((value - 400) /
        800) *
        5;

  } else {

    performance =
      240 +
      ((value - 1200) /
        3800) *
        110;

  }


  performance =
    Math.round(
      clamp(
        performance,
        220,
        360
      )
    );


  setText(
    "performance-value",
    formatNumber(
      performance,
      0
    )
  );


  updatePerformanceDifference(
    performance
  );


  const status =
    getCO2State(value);


  setMetricStatus(
    "environment-status",
    status.label,
    status.className
  );


  setText(
    "science-title",
    "Interactive environmental adjustment"
  );


  setText(
    "science-text",
    "The slider changes the demonstration environmental value and a simulated performance indicator. These relationships are illustrative and are not validated physiological predictions."
  );


  updateEnvironmentMetrics();

  updateAnalysis();

}


function updatePerformanceDifference(
  performance
) {

  const baseline =
    SCENARIOS.baseline.performance;


  const difference =
    ((performance - baseline) /
      baseline) *
      100;


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

}


/* =========================================================
   CHART CREATION
   ========================================================= */

function destroyChart(
  chartName
) {

  const chart =
    state.charts[chartName];

  if (!chart) {
    return;
  }


  try {
    chart.destroy();
  } catch (error) {
    console.warn(
      "Chart cleanup warning:",
      error
    );
  }


  state.charts[chartName] =
    null;

}


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


function createEnvironmentChart() {

  const canvas =
    $("#environmentChart");

  if (!canvas) {
    return;
  }


  destroyChart(
    "environment"
  );


  try {

    state.charts.environment =
      new Chart(
        canvas,
        {

          type: "line",

          data: {

            labels:
              DEMO_DATA.labels,

            datasets: [{

              label: "CO₂",

              data:
                DEMO_DATA.environment,

              borderColor:
                "#51d7e8",

              backgroundColor:
                "rgba(81, 215, 232, 0.10)",

              borderWidth: 2,

              fill: true,

              tension: 0.35,

              pointRadius: 4,

              pointHoverRadius: 6

            }]

          },

          options: {

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
    "performance"
  );


  try {

    state.charts.performance =
      new Chart(
        canvas,
        {

          type: "line",

          data: {

            labels:
              DEMO_DATA.labels,

            datasets: [{

              label:
                "Reaction Time",

              data:
                DEMO_DATA.performance,

              borderColor:
                "#4ea1ff",

              backgroundColor:
                "rgba(78, 161, 255, 0.10)",

              borderWidth: 2,

              fill: true,

              tension: 0.35,

              pointRadius: 4,

              pointHoverRadius: 6

            }]

          },

          options: {

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


  state.charts.environment
    .data
    .labels =
      DEMO_DATA.labels;


  state.charts.environment
    .data
    .datasets[0]
    .data =
      offsets.map(
        offset =>
          Math.max(
            0,
            scenario.co2 +
            offset
          )
      );


  state.charts.environment.update(
    "none"
  );


  if (
    state.charts.performance
  ) {

    state.charts.performance
      .data
      .labels =
        DEMO_DATA.labels;

    state.charts.performance
      .data
      .datasets[0]
      .data =
        DEMO_DATA.performance;

    state.charts.performance.update(
      "none"
    );

  }

}


function updateCustomCharts() {

  const dataset =
    state.customDataset;


  if (!dataset) {
    return;
  }


  if (
    state.charts.environment
  ) {

    state.charts.environment
      .data
      .labels =
        dataset.labels;

    state.charts.environment
      .data
      .datasets[0]
      .data =
        dataset.values;

    state.charts.environment.update(
      "none"
    );

  }


  if (
    state.charts.performance
  ) {

    const performance =
      dataset.performance ||
      dataset.values.map(
        value =>
          estimatePerformance(
            value
          )
      );


    state.charts.performance
      .data
      .labels =
        dataset.labels;

    state.charts.performance
      .data
      .datasets[0]
      .data =
        performance;

    state.charts.performance.update(
      "none"
    );

  }

}


function estimatePerformance(
  value
) {

  const relative =
    (value - 1200) /
    1200;


  return Math.round(
    clamp(
      240 +
      relative * 70,
      180,
      450
    )
  );

}


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

  const clean =
    numericArray(values);


  if (!clean.length) {

    return {

      mean: 0,

      min: 0,

      max: 0,

      standardDeviation: 0,

      count: 0,

      range: 0

    };

  }


  const sum =
    clean.reduce(
      (total, value) =>
        total + value,
      0
    );


  const mean =
    sum / clean.length;


  const variance =
    clean.reduce(
      (total, value) =>
        total +
        Math.pow(
          value - mean,
          2
        ),
      0
    ) /
    clean.length;


  const standardDeviation =
    Math.sqrt(
      variance
    );


  const min =
    Math.min(...clean);

  const max =
    Math.max(...clean);


  return {

    mean,

    min,

    max,

    standardDeviation,

    count:
      clean.length,

    range:
      max - min

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


  setText(
    "co2-standard-deviation",
    `${formatNumber(
      stats.standardDeviation
    )} ppm`
  );


  setText(
    "co2-range",
    `${formatNumber(
      stats.range
    )} ppm`
  );

}


/* =========================================================
   TREND / PATTERN
   ========================================================= */

function calculateTrend(
  values
) {

  const clean =
    numericArray(values);


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
   CORRELATION
   ========================================================= */

function pearsonCorrelation(
  x,
  y
) {

  const length =
    Math.min(
      x.length,
      y.length
    );


  if (length < 2) {
    return null;
  }


  const xs =
    x.slice(0, length)
      .map(Number);

  const ys =
    y.slice(0, length)
      .map(Number);


  const meanX =
    xs.reduce(
      (a, b) => a + b,
      0
    ) / length;


  const meanY =
    ys.reduce(
      (a, b) => a + b,
      0
    ) / length;


  let numerator = 0;

  let denominatorX = 0;

  let denominatorY = 0;


  for (
    let i = 0;
    i < length;
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


function lagArrays(
  environment,
  performance,
  lag
) {

  const env =
    numericArray(
      environment
    );

  const perf =
    numericArray(
      performance
    );


  if (
    env.length !==
    perf.length
  ) {

    const n =
      Math.min(
        env.length,
        perf.length
      );

    return lagArrays(
      env.slice(0, n),
      perf.slice(0, n),
      lag
    );

  }


  if (
    lag <= 0
  ) {

    return {
      x: env,
      y: perf
    };

  }


  if (
    lag >= env.length
  ) {

    return {
      x: [],
      y: []
    };

  }


  return {

    x:
      env.slice(
        0,
        env.length - lag
      ),

    y:
      perf.slice(
        lag
      )

  };

}


function calculateLagCorrelation(
  lag
) {

  const dataset =
    getActiveDataset();


  const paired =
    lagArrays(
      dataset.values,
      dataset.performance,
      lag
    );


  const r =
    pearsonCorrelation(
      paired.x,
      paired.y
    );


  return {

    r,

    n:
      paired.x.length,

    lag

  };

}


function correlationInterpretation(
  r
) {

  if (
    r === null ||
    !Number.isFinite(r)
  ) {
    return "Insufficient data";
  }


  const absolute =
    Math.abs(r);


  if (
    absolute < 0.2
  ) {
    return "Very weak association";
  }


  if (
    absolute < 0.4
  ) {
    return "Weak association";
  }


  if (
    absolute < 0.6
  ) {
    return "Moderate association";
  }


  if (
    absolute < 0.8
  ) {
    return "Strong association";
  }


  return "Very strong association";

}


function setupLagSlider() {

  const slider =
    $("#lag-slider");

  if (!slider) {
    return;
  }


  slider.addEventListener(
    "input",
    () => {

      state.lag =
        Number(slider.value);

      updateCorrelation();

    }
  );

}


function updateCorrelation() {

  const result =
    calculateLagCorrelation(
      state.lag
    );


  setText(
    "lag-value",
    `${state.lag} hour${
      state.lag === 1
        ? ""
        : "s"
    }`
  );


  setText(
    "correlation-r",
    result.r === null
      ? "--"
      : result.r.toFixed(3)
  );


  setText(
    "correlation-lag",
    `${result.lag} h`
  );


  setText(
    "correlation-n",
    String(result.n)
  );


  setText(
    "correlation-interpretation",
    correlationInterpretation(
      result.r
    )
  );

}


/* =========================================================
   PREDICTIVE LATENCY
   ========================================================= */

function calculatePredictedLatency() {

  const co2 =
    state.currentCO2;

  const radiation =
    state.environment.radiation;

  const wakefulness =
    state.environment.wakefulness;


  const co2Effect =
    clamp(
      (co2 - 1200) /
      2800,
      0,
      1
    );


  const radiationEffect =
    clamp(
      (radiation - 1.8) /
      2.2,
      0,
      1
    );


  const sleepEffect =
    clamp(
      (wakefulness - 14) /
      8,
      0,
      1
    );


  const prediction =
    240 +

    co2Effect * 55 +

    radiationEffect * 20 +

    sleepEffect * 45;


  return Math.round(
    prediction
  );

}


function updatePrediction() {

  setText(
    "predicted-latency",
    `${calculatePredictedLatency()} ms`
  );

}


/* =========================================================
   ANALYSIS
   ========================================================= */

function getActiveDataset() {

  if (
    state.customDataset
  ) {

    return {

      values:
        numericArray(
          state.customDataset.values
        ),

      performance:
        numericArray(
          state.customDataset.performance ||
          state.customDataset.values.map(
            estimatePerformance
          )
        ),

      labels:
        state.customDataset.labels

    };

  }


  return {

    values:
      DEMO_DATA.environment,

    performance:
      DEMO_DATA.performance,

    labels:
      DEMO_DATA.labels

  };

}


function updateAnalysis() {

  const dataset =
    getActiveDataset();


  const trend =
    calculateTrend(
      dataset.values
    );


  setText(
    "trend-result",
    trend
  );


  const difference =
    ((state.currentCO2 -
      SCENARIOS.baseline.co2) /
      SCENARIOS.baseline.co2) *
      100;


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
    dataset.values
  );


  updateCorrelation();

  updatePrediction();

  updateEnvironmentMetrics();

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
    !browse ||
    !input
  ) {
    return;
  }


  browse.addEventListener(
    "click",
    () => input.click()
  );


  input.addEventListener(
    "change",
    event => {

      const file =
        event.target
          .files?.[0];


      if (file) {
        processCSV(file);
      }

    }
  );


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

          performance:
            parsed.performance,

          co2Column:
            parsed.co2Column,

          timeColumn:
            parsed.timeColumn

        };


        state.activeScenario =
          "baseline";


        updateDatasetInformation();

        updateCustomCharts();

        updateAnalysis();


        const latest =
          parsed.values[
            parsed.values.length - 1
          ];


        if (
          Number.isFinite(
            latest
          )
        ) {

          state.currentCO2 =
            latest;

        }


        setFileStatus(
          `Loaded ${file.name}: ${parsed.values.length} valid CO₂ values detected.`
        );


        if (clear) {
          clear.disabled =
            false;
        }


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


  let co2Index =
    -1;


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
          .includes(
            "carbon"
          )
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


  const performanceIndex =
    normalizedHeaders.findIndex(
      header =>
        header.includes("reactiontime") ||
        header.includes("reaction") ||
        header.includes("performance") ||
        header.includes("rt")
    );


  const values = [];

  const labels = [];

  const performance = [];


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
        String(
          rawValue ?? ""
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


    if (
      performanceIndex >= 0
    ) {

      const performanceValue =
        parseFloat(
          String(
            row[
              performanceIndex
            ] ?? ""
          )
            .replace(
              /,/g,
              ""
            )
            .trim()
        );


      if (
        Number.isFinite(
          performanceValue
        )
      ) {

        performance.push(
          performanceValue
        );

      } else {

        performance.push(
          estimatePerformance(
            value
          )
        );

      }

    } else {

      performance.push(
        estimatePerformance(
          value
        )
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

    performance,

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
      !insideQuotes
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

  if (
    !state.customDataset
  ) {

    setText(
      "dataset-badge",
      "DEMONSTRATION"
    );


    setText(
      "dataset-name",
      "Built-in demonstration data"
    );


    setText(
      "dataset-rows",
      String(
        DEMO_DATA.environment.length
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
   BUILT-IN DATASETS
   ========================================================= */

function setupBuiltInDatasets() {

  const issButton =
    $("#load-iss-btn");

  const sleepButton =
    $("#load-sleep-btn");


  if (issButton) {

    issButton.addEventListener(
      "click",
      () =>
        loadBuiltInDataset(
          "iss"
        )
    );

  }


  if (sleepButton) {

    sleepButton.addEventListener(
      "click",
      () =>
        loadBuiltInDataset(
          "sleep"
        )
    );

  }

}


function loadBuiltInDataset(
  name
) {

  const source =
    BUILT_IN_DATASETS[name];


  if (!source) {
    return;
  }


  state.customDataset = {

    name:
      source.name,

    values:
      [...source.environment],

    labels:
      [...source.labels],

    performance:
      [...source.performance],

    co2Column:
      "CO2",

    timeColumn:
      "Time"

  };


  state.currentCO2 =
    source.environment[
      source.environment.length - 1
    ];


  state.environment = {

    radiation:
      source.radiation[
        source.radiation.length - 1
      ],

    temperature:
      source.temperature[
        source.temperature.length - 1
      ],

    humidity:
      source.humidity[
        source.humidity.length - 1
      ],

    pressure:
      source.pressure[
        source.pressure.length - 1
      ],

    wakefulness:
      source.wakefulness[
        source.wakefulness.length - 1
      ]

  };


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


  updateDatasetInformation();

  updateCustomCharts();

  updateAnalysis();


  setFileStatus(
    `${source.name} loaded. This dataset is simulated demonstration data.`
  );


  const clear =
    $("#clear-csv-btn");


  if (clear) {
    clear.disabled =
      false;
  }


  setText(
    "co2-slider-value",
    `${formatNumber(
      state.currentCO2,
      0
    )} ppm`
  );

}


/* =========================================================
   CLEAR DATASET
   ========================================================= */

function clearDataset() {

  state.customDataset =
    null;


  state.currentCO2 =
    SCENARIOS[
      state.activeScenario
    ].co2;


  state.environment = {

    radiation:
      SCENARIOS[
        state.activeScenario
      ].radiation,

    temperature:
      SCENARIOS[
        state.activeScenario
      ].temperature,

    humidity:
      SCENARIOS[
        state.activeScenario
      ].humidity,

    pressure:
      SCENARIOS[
        state.activeScenario
      ].pressure,

    wakefulness:
      SCENARIOS[
        state.activeScenario
      ].wakefulness

  };


  const input =
    $("#csv-file-input");


  if (input) {
    input.value = "";
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


  if (
    state.charts.environment
  ) {

    state.charts.environment
      .data
      .labels =
        DEMO_DATA.labels;

    state.charts.environment
      .data
      .datasets[0]
      .data =
        DEMO_DATA.environment;

    state.charts.environment.update(
      "none"
    );

  }


  if (
    state.charts.performance
  ) {

    state.charts.performance
      .data
      .labels =
        DEMO_DATA.labels;

    state.charts.performance
      .data
      .datasets[0]
      .data =
        DEMO_DATA.performance;

    state.charts.performance.update(
      "none"
    );

  }


  applyScenario(
    SCENARIOS[
      state.activeScenario
    ]
  );

}


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

  const content = [

    "timestamp,CO2_ppm,reaction_time_ms",

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
      [content],
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

    if (
      pvt.timer
    ) {

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


  if (
    reactionTime < 150
  ) {

    pvt.falseStarts++;

  } else {

    pvt.trials.push(
      reactionTime
    );


    if (
      reactionTime > 500
    ) {

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


    if (
      reactionTime < 150
    ) {

      box.classList.add(
        "false-start"
      );

      box.textContent =
        `${reactionTime} ms — anticipation detected`;

    } else {

      box.textContent =
        `${reactionTime} ms — press Start Test for another trial`;

    }

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
    [...values]
      .sort(
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


function calculateMeanRRT(
  trials
) {

  if (
    !trials.length
  ) {
    return null;
  }


  const rrts =
    trials.map(
      rt =>
        1000 / rt
    );


  return (
    rrts.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    rrts.length
  );

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
    "pvt-false-starts",
    String(
      state.pvt.falseStarts
    )
  );


  setText(
    "pvt-lapses",
    String(
      state.pvt.lapses
    )
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
      "pvt-median",
      "-- ms"
    );

    setText(
      "pvt-mean-rrt",
      "-- s⁻¹"
    );

    setText(
      "pvt-rrt",
      "-- s⁻¹"
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


  const best =
    Math.min(
      ...trials
    );


  const median =
    calculateMedian(
      trials
    );


  const meanRRT =
    calculateMeanRRT(
      trials
    );


  setText(
    "pvt-score",
    `${last} ms`
  );


  setText(
    "pvt-average",
    `${Math.round(
      average
    )} ms`
  );


  setText(
    "pvt-best",
    `${best} ms`
  );


  setText(
    "pvt-median",
    `${Math.round(
      median
    )} ms`
  );


  setText(
    "pvt-mean-rrt",
    `${meanRRT.toFixed(
      3
    )} s⁻¹`
  );


  setText(
    "pvt-rrt",
    `${meanRRT.toFixed(
      3
    )} s⁻¹`
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


  const correlation =
    calculateLagCorrelation(
      state.lag
    );


  const index =
    calculateEnvironmentIndex();


  const pvt =
    state.pvt;


  const averageRT =
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


  const meanRRT =
    calculateMeanRRT(
      pvt.trials
    );


  const originalTitle =
    document.title;


  document.title =
    "Space NeuroHealth Research Summary";


  const message = [

    "SPACE NEUROHEALTH",

    "",

    `Scenario: ${scenario.name}`,

    `CO₂: ${formatNumber(
      state.currentCO2,
      0
    )} ppm`,

    `Radiation: ${formatNumber(
      state.environment.radiation,
      1
    )} mSv/day`,

    `Temperature: ${formatNumber(
      state.environment.temperature,
      1
    )} °C`,

    `Humidity: ${formatNumber(
      state.environment.humidity,
      0
    )}%`,

    `Pressure: ${formatNumber(
      state.environment.pressure,
      1
    )} kPa`,

    `Wakefulness: ${formatNumber(
      state.environment.wakefulness,
      0
    )} h`,

    "",

    `Environment Index: ${Math.round(
      index
    )}/100`,

    `Environment State: ${
      getIndexState(index).label
    }`,

    "",

    `Lag: ${state.lag} h`,

    `Pearson r: ${
      correlation.r === null
        ? "--"
        : correlation.r.toFixed(3)
    }`,

    `Correlation sample size: ${correlation.n}`,

    "",

    `PVT trials: ${pvt.trials.length}`,

    `Mean RT: ${
      averageRT === null
        ? "--"
        : `${averageRT} ms`
    }`,

    `Mean RRT: ${
      meanRRT === null
        ? "--"
        : `${meanRRT.toFixed(3)} s⁻¹`
    }`,

    `Lapses > 500 ms: ${pvt.lapses}`,

    `False starts < 150 ms: ${pvt.falseStarts}`,

    "",

    `Dataset: ${
      state.customDataset
        ? state.customDataset.name
        : "Built-in demonstration data"
    }`,

    "",

    "This report contains demonstration/interface data unless a validated dataset has been loaded. Exploratory correlations do not establish causation."

  ].join("\n");


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

  setupLagSlider();

  setupCSV();

  setupBuiltInDatasets();

  setupTemplateDownload();

  setupPVT();

  setupExport();

  setupKeyboardNavigation();


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

}


/* =========================================================
   START APPLICATION
   ========================================================= */

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
