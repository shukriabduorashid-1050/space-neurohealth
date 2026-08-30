/* =========================================================
   SPACE NEUROHEALTH
   NASA SPACE APPS CHALLENGE PROTOTYPE

   APPLICATION LOGIC

   IMPORTANT:
   Built-in values are demonstration data.

   They must not be presented as verified NASA measurements
   or as evidence of a causal relationship between CO₂ and
   cognitive performance.
   ========================================================= */


/* =========================================================
   DEMONSTRATION SCENARIOS
   ========================================================= */

const scenarios = {

  baseline: {
    environment: 1200,
    unit: "ppm CO₂",
    performance: 240,
    change: 0,

    environmentStatus:
      "Nominal Baseline",

    performanceStatus:
      "Demonstration reference",

    changeStatus:
      "No change",

    trend:
      "Stable",

    color:
      "#3fb950",

    noteTitle:
      "Baseline environmental condition",

    note:
      "This demonstration shows a baseline environmental " +
      "measurement. In the final project, this value should " +
      "come from a verified dataset and be interpreted using " +
      "documented scientific evidence."
  },


  elevated: {
    environment: 2800,
    unit: "ppm CO₂",
    performance: 285,
    change: 18.8,

    environmentStatus:
      "Elevated CO₂ Warning",

    performanceStatus:
      "Demonstration reference",

    changeStatus:
      "Higher than baseline",

    trend:
      "Increasing",

    color:
      "#d29922",

    noteTitle:
      "Elevated environmental measurement",

    note:
      "The prototype identifies a higher environmental " +
      "measurement than the baseline scenario. The displayed " +
      "performance indicator is a demonstration value and " +
      "should not be interpreted as evidence that CO₂ caused " +
      "a change in cognition."
  },


  high: {
    environment: 4100,
    unit: "ppm CO₂",
    performance: 350,
    change: 45.8,

    environmentStatus:
      "High Concentration Alert",

    performanceStatus:
      "Demonstration reference",

    changeStatus:
      "Higher than baseline",

    trend:
      "Increasing",

    color:
      "#f85149",

    noteTitle:
      "High demonstration value",

    note:
      "This scenario demonstrates how the application could " +
      "flag an unusually high environmental measurement for " +
      "further investigation. A real alert threshold should " +
      "only be defined after reviewing the relevant dataset, " +
      "mission requirements, and scientific evidence."
  }

};


/* =========================================================
   DEMONSTRATION TIME SERIES
   ========================================================= */

const chartData = {

  baseline: {

    labels: [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00"
    ],

    environment: [
      1100,
      1150,
      1200,
      1180,
      1210,
      1190,
      1200
    ],

    performance: [
      235,
      238,
      240,
      239,
      241,
      240,
      240
    ]

  },


  elevated: {

    labels: [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00"
    ],

    environment: [
      1500,
      1800,
      2100,
      2350,
      2500,
      2700,
      2800
    ],

    performance: [
      245,
      250,
      260,
      265,
      275,
      280,
      285
    ]

  },


  high: {

    labels: [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00"
    ],

    environment: [
      2000,
      2500,
      3100,
      3400,
      3800,
      3950,
      4100
    ],

    performance: [
      260,
      275,
      300,
      315,
      330,
      340,
      350
    ]

  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const appState = {

  currentScenario:
    "baseline",

  currentEnvironmentData:
    [...chartData.baseline.environment],

  currentPerformanceData:
    [...chartData.baseline.performance],

  currentLabels:
    [...chartData.baseline.labels],

  datasetSource:
    "Demonstration dataset",

  datasetName:
    "Built-in demonstration data",

  co2Column:
    "environment",

  timeColumn:
    "labels",

  pvtResults:
    []

};


/* =========================================================
   GLOBAL CHART VARIABLES
   ========================================================= */

let environmentChart = null;
let performanceChart = null;


/* =========================================================
   PVT STATE
   ========================================================= */

let pvtState = "idle";

let pvtStartTime = 0;

let pvtTimer = null;


/* =========================================================
   CHART COLORS
   ========================================================= */

const chartTextColor =
  "#8b949e";

const chartGridColor =
  "#1d2a3a";


/* =========================================================
   SAFE DOM HELPER
   ========================================================= */

function getElement(id) {

  return document.getElementById(id);

}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(value, decimals = 0) {

  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  );

}


/* =========================================================
   HEX TO RGBA
   ========================================================= */

function hexToRgba(hex, alpha) {

  const cleanHex =
    hex.replace("#", "");

  const bigint =
    parseInt(cleanHex, 16);

  if (Number.isNaN(bigint)) {
    return `rgba(88, 166, 255, ${alpha})`;
  }

  const r =
    (bigint >> 16) & 255;

  const g =
    (bigint >> 8) & 255;

  const b =
    bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;

}


/* =========================================================
   CALCULATE MEAN
   ========================================================= */

function calculateMean(values) {

  const valid =
    values.filter(
      value =>
        Number.isFinite(value)
    );

  if (!valid.length) {
    return null;
  }

  const total =
    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  return total / valid.length;

}


/* =========================================================
   CALCULATE MINIMUM
   ========================================================= */

function calculateMinimum(values) {

  const valid =
    values.filter(
      value =>
        Number.isFinite(value)
    );

  if (!valid.length) {
    return null;
  }

  return Math.min(...valid);

}


/* =========================================================
   CALCULATE MAXIMUM
   ========================================================= */

function calculateMaximum(values) {

  const valid =
    values.filter(
      value =>
        Number.isFinite(value)
    );

  if (!valid.length) {
    return null;
  }

  return Math.max(...valid);

}


/* =========================================================
   DETERMINE TREND
   ========================================================= */

function determineTrend(values) {

  if (!values || values.length < 2) {
    return "Insufficient data";
  }

  const first =
    values[0];

  const last =
    values[values.length - 1];

  const difference =
    last - first;

  const tolerance =
    Math.max(
      Math.abs(first) * 0.03,
      1
    );

  if (difference > tolerance) {
    return "Increasing";
  }

  if (difference < -tolerance) {
    return "Decreasing";
  }

  return "Stable";

}


/* =========================================================
   CREATE ENVIRONMENT CHART
   ========================================================= */

function createEnvironmentChart() {

  const canvas =
    getElement("environmentChart");

  const errorBox =
    getElement("chart-error");

  if (!canvas) {
    return;
  }

  if (typeof Chart === "undefined") {

    if (errorBox) {
      errorBox.classList.remove("hidden");
    }

    return;
  }

  try {

    const ctx =
      canvas.getContext("2d");

    environmentChart =
      new Chart(
        ctx,
        {

          type: "line",

          data: {

            labels:
              appState.currentLabels,

            datasets: [
              {

                label:
                  "Environmental Measurement",

                data:
                  appState.currentEnvironmentData,

                borderColor:
                  "#58a6ff",

                backgroundColor:
                  "rgba(88,166,255,0.10)",

                borderWidth:
                  2,

                pointRadius:
                  3,

                pointHoverRadius:
                  5,

                tension:
                  0.3,

                fill:
                  true

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
                    "#f0f6fc",

                  font: {
                    size: 11
                  }

                }

              },

              tooltip: {

                backgroundColor:
                  "#101824",

                borderColor:
                  "#1d2a3a",

                borderWidth:
                  1,

                titleColor:
                  "#f0f6fc",

                bodyColor:
                  "#b6c2cf"

              }

            },

            scales: {

              x: {

                ticks: {
                  color:
                    chartTextColor
                },

                grid: {
                  color:
                    chartGridColor
                }

              },

              y: {

                beginAtZero:
                  false,

                ticks: {
                  color:
                    chartTextColor
                },

                grid: {
                  color:
                    chartGridColor
                },

                title: {

                  display:
                    true,

                  text:
                    "CO₂ concentration (ppm)",

                  color:
                    chartTextColor

                }

              }

            }

          }

        }
      );

  }

  catch (error) {

    console.error(
      "Environment chart error:",
      error
    );

    if (errorBox) {
      errorBox.classList.remove("hidden");
    }

  }

}


/* =========================================================
   CREATE PERFORMANCE CHART
   ========================================================= */

function createPerformanceChart() {

  const canvas =
    getElement("performanceChart");

  if (!canvas) {
    return;
  }

  if (typeof Chart === "undefined") {
    return;
  }

  try {

    const ctx =
      canvas.getContext("2d");

    performanceChart =
      new Chart(
        ctx,
        {

          type: "line",

          data: {

            labels:
              appState.currentLabels,

            datasets: [
              {

                label:
                  "Performance Reference",

                data:
                  appState.currentPerformanceData,

                borderColor:
                  "#56d4dd",

                backgroundColor:
                  "rgba(86,212,221,0.08)",

                borderWidth:
                  2,

                pointRadius:
                  3,

                pointHoverRadius:
                  5,

                tension:
                  0.3,

                fill:
                  true

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
                    "#f0f6fc",

                  font: {
                    size: 11
                  }

                }

              }

            },

            scales: {

              x: {

                ticks: {
                  color:
                    chartTextColor
                },

                grid: {
                  color:
                    chartGridColor
                }

              },

              y: {

                beginAtZero:
                  false,

                ticks: {
                  color:
                    chartTextColor
                },

                grid: {
                  color:
                    chartGridColor
                },

                title: {

                  display:
                    true,

                  text:
                    "Reaction time (ms)",

                  color:
                    chartTextColor

                }

              }

            }

          }

        }
      );

  }

  catch (error) {

    console.error(
      "Performance chart error:",
      error
    );

  }

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics(values) {

  const mean =
    calculateMean(values);

  const minimum =
    calculateMinimum(values);

  const maximum =
    calculateMaximum(values);

  const meanElement =
    getElement("mean-co2");

  const minElement =
    getElement("min-co2");

  const peakElement =
    getElement("peak-co2");

  const pointsElement =
    getElement("data-points");

  if (meanElement) {

    meanElement.textContent =
      mean === null
        ? "--"
        : `${formatNumber(mean)} ppm`;

  }

  if (minElement) {

    minElement.textContent =
      minimum === null
        ? "--"
        : `${formatNumber(minimum)} ppm`;

  }

  if (peakElement) {

    peakElement.textContent =
      maximum === null
        ? "--"
        : `${formatNumber(maximum)} ppm`;

  }

  if (pointsElement) {

    pointsElement.textContent =
      values.length.toLocaleString();

  }

}


/* =========================================================
   UPDATE DASHBOARD STATISTICS
   ========================================================= */

function updateAnalysisDisplay() {

  const trendElement =
    getElement("trend-result");

  const baselineElement =
    getElement("baseline-result");

  const analysisElement =
    getElement("analysis-result");

  if (trendElement) {

    trendElement.textContent =
      determineTrend(
        appState.currentEnvironmentData
      );

  }

  if (baselineElement) {

    const baseline =
      scenarios.baseline.environment;

    const mean =
      calculateMean(
        appState.currentEnvironmentData
      );

    if (
      Number.isFinite(mean) &&
      baseline !== 0
    ) {

      const change =
        ((mean - baseline) / baseline) * 100;

      baselineElement.textContent =
        `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

    }

  }

  if (analysisElement) {

    analysisElement.textContent =
      appState.datasetSource ===
      "Demonstration dataset"
        ? "Exploratory"
        : "User dataset";

  }

  updateStatistics(
    appState.currentEnvironmentData
  );

}


/* =========================================================
   UPDATE CHARTS
   ========================================================= */

function updateCharts() {

  if (environmentChart) {

    environmentChart.data.labels =
      [...appState.currentLabels];

    environmentChart.data.datasets[0].data =
      [...appState.currentEnvironmentData];

    environmentChart.update();

  }

  if (performanceChart) {

    performanceChart.data.labels =
      [...appState.currentLabels];

    performanceChart.data.datasets[0].data =
      [...appState.currentPerformanceData];

    performanceChart.update();

  }

}


/* =========================================================
   UPDATE DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

  const name =
    getElement("dataset-name");

  const rows =
    getElement("dataset-rows");

  const co2Column =
    getElement("dataset-co2-column");

  const timeColumn =
    getElement("dataset-time-column");

  const validation =
    getElement("dataset-validation");

  const badge =
    getElement("dataset-badge");

  const statisticsSource =
    getElement("statistics-source");

  if (name) {
    name.textContent =
      appState.datasetName;
  }

  if (rows) {
    rows.textContent =
      appState.currentEnvironmentData.length;
  }

  if (co2Column) {
    co2Column.textContent =
      appState.co2Column;
  }

  if (timeColumn) {
    timeColumn.textContent =
      appState.timeColumn;
  }

  if (validation) {

    validation.textContent =
      appState.datasetSource ===
      "Demonstration dataset"
        ? "Demonstration dataset"
        : "Parsed successfully";

    validation.className =
      appState.datasetSource ===
      "Demonstration dataset"
        ? "safe-text"
        : "safe-text";

  }

  if (badge) {

    badge.textContent =
      appState.datasetSource ===
      "Demonstration dataset"
        ? "DEMONSTRATION"
        : "CUSTOM CSV";

  }

  if (statisticsSource) {

    statisticsSource.textContent =
      appState.datasetSource;

  }

}


/* =========================================================
   UPDATE PERFORMANCE INDICATOR
   ========================================================= */

function updatePerformanceIndicator(
  performance,
  change
) {

  const performanceElement =
    getElement("performance-value");

  const changeElement =
    getElement("change-value");

  if (performanceElement) {

    performanceElement.textContent =
      formatNumber(performance);

  }

  if (changeElement) {

    changeElement.textContent =
      change === 0
        ? "0%"
        : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

  }

}


/* =========================================================
   UPDATE ENVIRONMENT STATUS
   ========================================================= */

function updateEnvironmentStatus(
  value
) {

  const status =
    getElement("environment-status");

  if (!status) {
    return;
  }

  status.className =
    "metric-status";

  if (value < 1500) {

    status.textContent =
      "Nominal Baseline";

    status.classList.add(
      "safe-text"
    );

  }

  else if (value < 2500) {

    status.textContent =
      "Elevated CO₂ Warning";

    status.classList.add(
      "warning-text"
    );

  }

  else {

    status.textContent =
      "High Concentration Alert";

    status.classList.add(
      "danger-text"
    );

  }

}


/* =========================================================
   UPDATE SCIENCE MESSAGE
   ========================================================= */

function updateScienceMessage(
  value
) {

  const title =
    getElement("science-title");

  const text =
    getElement("science-text");

  if (!title || !text) {
    return;
  }

  if (value < 1500) {

    title.textContent =
      "Nominal demonstration condition";

    text.textContent =
      "The selected CO₂ concentration is within the " +
      "lower range of this demonstration simulator. " +
      "This classification is a prototype interface " +
      "condition and is not a clinical or mission threshold.";

  }

  else if (value < 2500) {

    title.textContent =
      "Elevated demonstration condition";

    text.textContent =
      "The simulator identifies a higher environmental " +
      "value than the baseline. The associated performance " +
      "indicator is generated by the prototype and should " +
      "not be interpreted as evidence of a causal effect.";

  }

  else {

    title.textContent =
      "High demonstration condition";

    text.textContent =
      "The simulator flags a high environmental value for " +
      "further investigation. A scientifically valid alert " +
      "threshold would require documented mission data and " +
      "appropriate scientific evidence.";

  }

}


/* =========================================================
   LOAD PRESET SCENARIO
   ========================================================= */

function loadScenario(type) {

  const selected =
    scenarios[type];

  const data =
    chartData[type];

  if (!selected || !data) {
    return;
  }

  appState.currentScenario =
    type;

  appState.currentEnvironmentData =
    [...data.environment];

  appState.currentPerformanceData =
    [...data.performance];

  appState.currentLabels =
    [...data.labels];

  appState.datasetSource =
    "Demonstration dataset";

  appState.datasetName =
    "Built-in demonstration data";

  appState.co2Column =
    "environment";

  appState.timeColumn =
    "labels";


  /* Environment */

  const environmentValue =
    getElement(
      "environment-value"
    );

  if (environmentValue) {

    environmentValue.textContent =
      formatNumber(
        selected.environment
      );

  }


  const environmentUnit =
    getElement(
      "environment-unit"
    );

  if (environmentUnit) {

    environmentUnit.textContent =
      selected.unit;

  }


  updateEnvironmentStatus(
    selected.environment
  );


  /* Performance */

  const performanceStatus =
    getElement(
      "performance-status"
    );

  if (performanceStatus) {

    performanceStatus.textContent =
      selected.performanceStatus;

  }

  updatePerformanceIndicator(
    selected.performance,
    selected.change
  );


  /* Change */

  const changeStatus =
    getElement(
      "change-status"
    );

  if (changeStatus) {

    changeStatus.textContent =
      selected.changeStatus;

    changeStatus.className =
      "metric-status";

    if (selected.change === 0) {

      changeStatus.classList.add(
        "safe-text"
      );

    }

    else if (selected.change < 20) {

      changeStatus.classList.add(
        "warning-text"
      );

    }

    else {

      changeStatus.classList.add(
        "danger-text"
      );

    }

  }


  /* Science */

  const scienceTitle =
    getElement(
      "science-title"
    );

  const scienceText =
    getElement(
      "science-text"
    );

  if (scienceTitle) {
    scienceTitle.textContent =
      selected.noteTitle;
  }

  if (scienceText) {
    scienceText.textContent =
      selected.note;
  }


  /* Analysis */

  updateAnalysisDisplay();


  /* Slider */

  const slider =
    getElement("co2-slider");

  const sliderDisplay =
    getElement(
      "co2-slider-value"
    );

  if (slider) {
    slider.value =
      selected.environment;
  }

  if (sliderDisplay) {

    sliderDisplay.textContent =
      `${formatNumber(selected.environment)} ppm`;

  }


  /* Charts */

  updateCharts();


  /* Active scenario */

  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.scenario === type
      );

    });


  updateDatasetInformation();

}


/* =========================================================
   LIVE CO₂ SIMULATOR
   ========================================================= */

function setupCO2Slider() {

  const slider =
    getElement("co2-slider");

  const display =
    getElement(
      "co2-slider-value"
    );

  if (!slider) {
    return;
  }

  slider.addEventListener(
    "input",
    function(event) {

      const value =
        parseInt(
          event.target.value,
          10
        );

      if (!Number.isFinite(value)) {
        return;
      }


      /* Display */

      if (display) {

        display.textContent =
          `${formatNumber(value)} ppm`;

      }


      /* Environmental value */

      const environmentValue =
        getElement(
          "environment-value"
        );

      if (environmentValue) {

        environmentValue.textContent =
          formatNumber(value);

      }


      /* Status */

      updateEnvironmentStatus(
        value
      );


      /*
       * IMPORTANT:
       *
       * This is intentionally a demonstration
       * mathematical indicator.
       *
       * It is NOT a validated biological relationship.
       */

      const estimatedReactionTime =
        Math.round(
          240 +
          ((value - 400) * 0.03)
        );

      const percentChange =
        ((estimatedReactionTime - 240) / 240) * 100;


      updatePerformanceIndicator(
        estimatedReactionTime,
        percentChange
      );


      const performanceStatus =
        getElement(
          "performance-status"
        );

      if (performanceStatus) {

        performanceStatus.textContent =
          "Simulated demonstration indicator";

      }


      const changeStatus =
        getElement(
          "change-status"
        );

      if (changeStatus) {

        changeStatus.textContent =
          percentChange === 0
            ? "No change"
            : "Simulated change";

        changeStatus.className =
          "metric-status";

        if (percentChange < 10) {

          changeStatus.classList.add(
            "safe-text"
          );

        }

        else if (percentChange < 20) {

          changeStatus.classList.add(
            "warning-text"
          );

        }

        else {

          changeStatus.classList.add(
            "danger-text"
          );

        }

      }


      /* Science explanation */

      updateScienceMessage(
        value
      );


      /* Generate smooth demonstration time series */

      const generatedData =
        Array.from(
          { length: 7 },
          (_, index) => {

            const wave =
              Math.sin(index * 0.9) * 70;

            const variation =
              (Math.random() * 60) - 30;

            return Math.max(
              0,
              Math.round(
                value +
                wave +
                variation
              )
            );

          }
        );


      appState.currentEnvironmentData =
        generatedData;

      appState.currentPerformanceData =
        generatedData.map(
          environment => {

            return Math.round(
              240 +
              ((environment - 400) * 0.03)
            );

          }
        );

      appState.currentLabels =
        [
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00"
        ];


      appState.datasetSource =
        "Live simulator";

      appState.datasetName =
        "Interactive CO₂ simulation";

      appState.co2Column =
        "simulated CO₂";

      appState.timeColumn =
        "simulation time";


      updateCharts();

      updateAnalysisDisplay();

      updateDatasetInformation();

    }
  );

}


/* =========================================================
   SCENARIO BUTTONS
   ========================================================= */

function setupScenarioButtons() {

  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          loadScenario(
            button.dataset.scenario
          );

        }
      );

    });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  const buttons =
    document.querySelectorAll(
      ".nav-btn"
    );

  const sections =
    document.querySelectorAll(
      ".section"
    );


  function activateSection(
    targetId,
    updateHash = true
  ) {

    const target =
      getElement(targetId);

    if (!target) {
      return;
    }


    buttons.forEach(
      button => {

        const isActive =
          button.dataset.section ===
          targetId;

        button.classList.toggle(
          "active",
          isActive
        );

        button.setAttribute(
          "aria-selected",
          String(isActive)
        );

        button.tabIndex =
          isActive ? 0 : -1;

      }
    );


    sections.forEach(
      section => {

        const isTarget =
          section.id === targetId;

        section.classList.toggle(
          "active-section",
          isTarget
        );

        section.hidden =
          !isTarget;

      }
    );


    if (updateHash) {

      try {

        history.replaceState(
          null,
          "",
          `#${targetId}`
        );

      }

      catch (error) {

        console.warn(
          "Could not update URL hash.",
          error
        );

      }

    }


    /*
     * Charts sometimes need a resize after their
     * parent section becomes visible.
     */

    setTimeout(
      () => {

        if (environmentChart) {
          environmentChart.resize();
        }

        if (performanceChart) {
          performanceChart.resize();
        }

      },
      50
    );

  }


  buttons.forEach(
    (button, index) => {

      button.addEventListener(
        "click",
        () => {

          activateSection(
            button.dataset.section
          );

        }
      );


      button.addEventListener(
        "keydown",
        event => {

          let newIndex =
            index;


          if (
            event.key === "ArrowRight"
          ) {

            newIndex =
              (index + 1) %
              buttons.length;

          }

          else if (
            event.key === "ArrowLeft"
          ) {

            newIndex =
              (index - 1 + buttons.length) %
              buttons.length;

          }

          else if (
            event.key === "Home"
          ) {

            newIndex = 0;

          }

          else if (
            event.key === "End"
          ) {

            newIndex =
              buttons.length - 1;

          }

          else {
            return;
          }


          event.preventDefault();

          buttons[newIndex].focus();

          activateSection(
            buttons[newIndex].dataset.section
          );

        }
      );

    }
  );


  /*
   * Allow direct navigation through:
   *
   * index.html#analysis
   * index.html#data
   * etc.
   */

  const validSections =
    [
      "dashboard",
      "analysis",
      "data",
      "methodology",
      "about"
    ];

  const hash =
    window.location.hash
      .replace("#", "");


  if (
    validSections.includes(hash)
  ) {

    activateSection(
      hash,
      false
    );

  }

}


/* =========================================================
   PVT TESTER
   ========================================================= */

function setupPVT() {

  const box =
    getElement("pvt-box");

  const button =
    getElement(
      "pvt-start-btn"
    );

  if (!box || !button) {
    return;
  }


  function resetBox() {

    pvtState =
      "idle";

    box.style.background =
      "#1d2a3a";

    box.textContent =
      'Click "Start Test" Below';

    button.disabled =
      false;

  }


  function startTest() {

    if (
      pvtState !== "idle"
    ) {
      return;
    }

    pvtState =
      "waiting";

    box.style.background =
      "#d29922";

    box.textContent =
      "Wait for GREEN...";

    button.disabled =
      true;


    const delay =
      Math.floor(
        Math.random() * 3000
      ) + 2000;


    clearTimeout(
      pvtTimer
    );


    pvtTimer =
      setTimeout(
        () => {

          pvtState =
            "ready";

          pvtStartTime =
            performance.now();

          box.style.background =
            "#3fb950";

          box.textContent =
            "CLICK NOW!";

        },
        delay
      );

  }


  function handlePVTClick() {

    if (
      pvtState === "waiting"
    ) {

      clearTimeout(
        pvtTimer
      );

      pvtState =
        "idle";

      box.style.background =
        "#f85149";

      box.textContent =
        "Too early! Click Start Test to retry.";

      button.disabled =
        false;

      return;

    }


    if (
      pvtState === "ready"
    ) {

      const elapsed =
        Math.round(
          performance.now() -
          pvtStartTime
        );


      pvtState =
        "idle";

      button.disabled =
        false;


      box.style.background =
        "#1d2a3a";

      box.textContent =
        elapsed > 500
          ? `Lapse Detected (${elapsed} ms).`
          : `Response Recorded (${elapsed} ms).`;


      recordPVTResult(
        elapsed
      );

    }

  }


  button.addEventListener(
    "click",
    startTest
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


/* =========================================================
   RECORD PVT RESULT
   ========================================================= */

function recordPVTResult(
  elapsed
) {

  if (
    !Number.isFinite(elapsed)
  ) {
    return;
  }


  appState.pvtResults.push(
    elapsed
  );


  const results =
    appState.pvtResults;


  const lastScore =
    getElement(
      "pvt-score"
    );

  const trials =
    getElement(
      "pvt-trials"
    );

  const average =
    getElement(
      "pvt-average"
    );

  const best =
    getElement(
      "pvt-best"
    );

  const lapses =
    getElement(
      "pvt-lapses"
    );


  if (lastScore) {

    lastScore.textContent =
      `${elapsed} ms`;

  }


  if (trials) {

    trials.textContent =
      results.length;

  }


  const mean =
    calculateMean(results);

  if (average) {

    average.textContent =
      mean === null
        ? "-- ms"
        : `${Math.round(mean)} ms`;

  }


  const bestValue =
    calculateMinimum(results);

  if (best) {

    best.textContent =
      bestValue === null
        ? "-- ms"
        : `${bestValue} ms`;

  }


  const lapseCount =
    results.filter(
      value =>
        value > 500
    ).length;

  if (lapses) {

    lapses.textContent =
      lapseCount;

  }

}


/* =========================================================
   CSV PARSING
   ========================================================= */

/*
 * This parser handles:
 *
 * - comma-separated CSV
 * - quoted fields
 * - commas inside quoted values
 * - Windows line endings
 * - simple headers
 */

function parseCSV(text) {

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

      row.push(
        cell.trim()
      );

      cell = "";

      continue;

    }


    if (
      (char === "\n" ||
       char === "\r") &&
      !insideQuotes
    ) {

      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }


      row.push(
        cell.trim()
      );

      cell = "";


      if (
        row.some(
          value =>
            value !== ""
        )
      ) {

        rows.push(row);

      }


      row = [];

      continue;

    }


    cell += char;

  }


  if (
    cell !== "" ||
    row.length
  ) {

    row.push(
      cell.trim()
    );

  }


  if (
    row.some(
      value =>
        value !== ""
    )
  ) {

    rows.push(row);

  }


  if (
    rows.length < 2
  ) {

    throw new Error(
      "The CSV must contain a header row and at least one data row."
    );

  }


  const headers =
    rows[0].map(
      header =>
        header.trim()
    );


  const dataRows =
    rows
      .slice(1)
      .map(
        values => {

          const object = {};

          headers.forEach(
            (header, index) => {

              object[header] =
                values[index] ?? "";

            }
          );

          return object;

        }
      );


  return {
    headers,
    rows: dataRows
  };

}


/* =========================================================
   FIND CO₂ COLUMN
   ========================================================= */

function findCO2Column(
  headers
) {

  const normalized =
    headers.map(
      header => ({
        original: header,
        normalized:
          header
            .toLowerCase()
            .replace(
              /[^a-z0-9]/g,
              ""
            )
      })
    );


  const exactMatches = [
    "co2",
    "carbon dioxide",
    "carbondioxide",
    "co2ppm",
    "co2concentration",
    "co2concentrationppm"
  ];


  for (
    const match of exactMatches
  ) {

    const found =
      normalized.find(
        item =>
          item.normalized ===
          match.replace(
            /[^a-z0-9]/g,
            ""
          )
      );

    if (found) {
      return found.original;
    }

  }


  const contains =
    normalized.find(
      item =>
        item.normalized.includes("co2") ||
        (
          item.normalized.includes("carbon") &&
          item.normalized.includes("dioxide")
        )
    );


  return contains
    ? contains.original
    : null;

}


/* =========================================================
   FIND TIME COLUMN
   ========================================================= */

function findTimeColumn(
  headers
) {

  const normalized =
    headers.map(
      header => ({
        original: header,
        normalized:
          header
            .toLowerCase()
            .replace(
              /[^a-z0-9]/g,
              ""
            )
      })
    );


  const preferred = [
    "time",
    "timestamp",
    "datetime",
    "date",
    "elapsedtime",
    "missiontime"
  ];


  for (
    const name of preferred
  ) {

    const found =
      normalized.find(
        item =>
          item.normalized === name
      );

    if (found) {
      return found.original;
    }

  }


  const contains =
    normalized.find(
      item =>
        item.normalized.includes("time") ||
        item.normalized.includes("date")
    );


  return contains
    ? contains.original
    : null;

}


/* =========================================================
   PARSE NUMERIC VALUE
   ========================================================= */

function parseNumericValue(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const cleaned =
    String(value)
      .replace(/,/g, "")
      .trim();


  if (
    cleaned === ""
  ) {
    return null;
  }


  const number =
    Number(cleaned);


  return Number.isFinite(number)
    ? number
    : null;

}


/* =========================================================
   LOAD CSV DATA
   ========================================================= */

function processCSVFile(
  file
) {

  const status =
    getElement(
      "file-status-msg"
    );

  if (!file) {
    return;
  }


  if (
    !file.name
      .toLowerCase()
      .endsWith(".csv")
  ) {

    showFileStatus(
      "Please select a CSV file.",
      "error"
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload =
    function(event) {

      try {

        const text =
          event.target.result;


        const parsed =
          parseCSV(text);


        const co2Column =
          findCO2Column(
            parsed.headers
          );


        if (!co2Column) {

          throw new Error(
            "No CO₂ column was detected. Use a header such as CO2, CO2_ppm, or carbon_dioxide."
          );

        }


        const timeColumn =
          findTimeColumn(
            parsed.headers
          );


        const values = [];

        const labels = [];


        parsed.rows.forEach(
          row => {

            const numeric =
              parseNumericValue(
                row[co2Column]
              );


            if (
              numeric !== null
            ) {

              values.push(
                numeric
              );


              if (timeColumn) {

                labels.push(
                  row[timeColumn] ||
                  String(
                    values.length
                  )
                );

              }

              else {

                labels.push(
                  String(
                    values.length
                  )
                );

              }

            }

          }
        );


        if (
          values.length === 0
        ) {

          throw new Error(
            "The detected CO₂ column does not contain usable numeric values."
          );

        }


        if (
          values.length > 1000
        ) {

          console.warn(
            "Large dataset detected. The chart will display all parsed points."
          );

        }


        appState.currentEnvironmentData =
          values;

        appState.currentLabels =
          labels;

        /*
         * We do not invent cognitive measurements from
         * uploaded data. If no performance column exists,
         * retain a neutral reference series.
         */

        const performanceColumn =
          parsed.headers.find(
            header =>
              /reaction|response|latency|performance/i
                .test(header)
          );


        if (performanceColumn) {

          const performanceValues =
            parsed.rows
              .map(
                row =>
                  parseNumericValue(
                    row[performanceColumn]
                  )
              )
              .filter(
                value =>
                  value !== null
              );

          if (
            performanceValues.length ===
            values.length
          ) {

            appState.currentPerformanceData =
              performanceValues;

          }

          else {

            appState.currentPerformanceData =
              values.map(
                () => null
              );

          }

        }

        else {

          appState.currentPerformanceData =
            values.map(
              () => null
            );

        }


        appState.datasetSource =
          "Custom CSV dataset";

        appState.datasetName =
          file.name;

        appState.co2Column =
          co2Column;

        appState.timeColumn =
          timeColumn ||
          "Generated row index";


        updateCharts();

        updateAnalysisDisplay();

        updateDatasetInformation();


        showFileStatus(
          `Successfully loaded ${file.name}. ` +
          `${values.length.toLocaleString()} valid CO₂ data points parsed.`,
          "success"
        );


        const clearButton =
          getElement(
            "clear-csv-btn"
          );

        if (clearButton) {
          clearButton.disabled =
            false;
        }

      }

      catch (error) {

        console.error(
          "CSV processing error:",
          error
        );


        showFileStatus(
          error.message ||
          "The CSV could not be processed.",
          "error"
        );

      }

    };


  reader.onerror =
    function() {

      showFileStatus(
        "The browser could not read this file.",
        "error"
      );

    };


  reader.readAsText(
    file
  );

}


/* =========================================================
   FILE STATUS
   ========================================================= */

function showFileStatus(
  message,
  type = "success"
) {

  const status =
    getElement(
      "file-status-msg"
    );

  if (!status) {
    return;
  }


  status.textContent =
    message;


  status.className =
    "file-status";


  if (
    type === "error"
  ) {

    status.classList.add(
      "error"
    );

  }

  else if (
    type === "warning"
  ) {

    status.classList.add(
      "warning"
    );

  }

}


/* =========================================================
   CSV UPLOAD CONTROLS
   ========================================================= */

function setupCSVUpload() {

  const input =
    getElement(
      "csv-file-input"
    );

  const browse =
    getElement(
      "browse-csv-btn"
    );

  const clear =
    getElement(
      "clear-csv-btn"
    );

  const dropZone =
    getElement(
      "drop-zone"
    );


  if (
    !input ||
    !browse ||
    !dropZone
  ) {
    return;
  }


  browse.addEventListener(
    "click",
    () => {

      input.click();

    }
  );


  input.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      if (file) {
        processCSVFile(file);
      }

    }
  );


  [
    "dragenter",
    "dragover"
  ].forEach(
    eventName => {

      dropZone.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          event.stopPropagation();

          dropZone.classList.add(
            "drag-over"
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

          event.stopPropagation();

          dropZone.classList.remove(
            "drag-over"
          );

        }
      );

    }
  );


  dropZone.addEventListener(
    "drop",
    event => {

      const file =
        event.dataTransfer.files[0];

      if (file) {
        processCSVFile(file);
      }

    }
  );


  if (clear) {

    clear.addEventListener(
      "click",
      clearCustomDataset
    );

  }

}


/* =========================================================
   CLEAR CUSTOM DATASET
   ========================================================= */

function clearCustomDataset() {

  appState.currentEnvironmentData =
    [...chartData.baseline.environment];

  appState.currentPerformanceData =
    [...chartData.baseline.performance];

  appState.currentLabels =
    [...chartData.baseline.labels];

  appState.datasetSource =
    "Demonstration dataset";

  appState.datasetName =
    "Built-in demonstration data";

  appState.co2Column =
    "environment";

  appState.timeColumn =
    "labels";


  updateCharts();

  updateAnalysisDisplay();

  updateDatasetInformation();


  const input =
    getElement(
      "csv-file-input"
    );

  if (input) {
    input.value = "";
  }


  const clear =
    getElement(
      "clear-csv-btn"
    );

  if (clear) {
    clear.disabled = true;
  }


  showFileStatus(
    "Custom dataset cleared. Demonstration data restored.",
    "success"
  );

}


/* =========================================================
   EXPORT / PRINT
   ========================================================= */

function setupExport() {

  const button =
    getElement(
      "export-btn"
    );

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      /*
       * The browser's native print system lets the reviewer
       * select "Save as PDF".
       */

      window.print();

    }
  );

}


/* =========================================================
   KEYBOARD / USER EXPERIENCE
   ========================================================= */

function setupGeneralInteractions() {

  /*
   * Prevent accidental form-like submission behavior from
   * buttons if the interface is embedded elsewhere.
   */

  document
    .querySelectorAll("button")
    .forEach(
      button => {

        button.setAttribute(
          "type",
          button.getAttribute("type") ||
          "button"
        );

      }
    );

}


/* =========================================================
   WAIT FOR CHART.JS
   ========================================================= */

function waitForChartJS(
  callback,
  attempts = 30
) {

  if (
    typeof Chart !== "undefined"
  ) {

    callback();

    return;

  }


  if (
    attempts <= 0
  ) {

    console.warn(
      "Chart.js was not available."
    );

    callback();

    return;

  }


  setTimeout(
    () => {

      waitForChartJS(
        callback,
        attempts - 1
      );

    },
    100
  );

}


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

function initializeApp() {

  setupGeneralInteractions();

  setupNavigation();

  setupScenarioButtons();

  setupCO2Slider();

  setupPVT();

  setupCSVUpload();

  setupExport();


  /*
   * Chart.js is loaded separately with defer.
   * Wait briefly until it becomes available.
   */

  waitForChartJS(
    () => {

      createEnvironmentChart();

      createPerformanceChart();

      loadScenario(
        "baseline"
      );

    }
  );

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

}

else {

  initializeApp();

   }
