/* =========================================================
   SPACE NEUROHEALTH
   APPLICATION JAVASCRIPT
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
    1140,
    1180,
    1170,
    1190,
    1210,
    1200
  ],

  performance: [
    235,
    238,
    241,
    239,
    243,
    245,
    240
  ]
};


const BASELINE_CO2 = 1200;


/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = {

  baseline: {
    co2: 1200,
    status: "Nominal Baseline",
    performance: 240,
    title: "Baseline environmental condition",
    text:
      "This demonstration shows a baseline environmental measurement. " +
      "In the final project, the value should come from a verified " +
      "dataset and be interpreted using documented scientific evidence."
  },

  elevated: {
    co2: 2500,
    status: "Elevated Demonstration",
    performance: 285,
    title: "Elevated demonstration condition",
    text:
      "The selected value represents an elevated demonstration condition. " +
      "The associated performance value is simulated and should not be " +
      "interpreted as a validated physiological response."
  },

  high: {
    co2: 4000,
    status: "High Demonstration",
    performance: 340,
    title: "High demonstration condition",
    text:
      "The selected value represents a high demonstration condition. " +
      "The simulated performance indicator is provided for interface " +
      "testing and does not establish a clinical or physiological effect."
  }

};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let environmentChart = null;
let performanceChart = null;

let activeData = {
  labels: [...DEMO_DATA.labels],
  environment: [...DEMO_DATA.environment],
  performance: [...DEMO_DATA.performance]
};

let customDatasetLoaded = false;


/* PVT STATE */

let pvtTimer = null;
let pvtStartTime = null;
let pvtReady = false;

let pvtScores = [];


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeNavigation();

  initializeSimulator();

  initializeCharts();

  initializeCSVUpload();

  initializePVT();

  initializeExport();

  updateDashboard();

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

  const buttons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const targetId = button.dataset.section;

      buttons.forEach((btn) => {

        const active = btn === button;

        btn.classList.toggle("active", active);

        btn.setAttribute(
          "aria-selected",
          String(active)
        );

      });


      sections.forEach((section) => {

        const active =
          section.id === targetId;

        section.hidden = !active;

        section.classList.toggle(
          "active-section",
          active
        );

      });


      /*
       * Chart.js sometimes needs a resize after a
       * previously hidden container becomes visible.
       */

      setTimeout(() => {

        if (environmentChart) {
          environmentChart.resize();
        }

        if (performanceChart) {
          performanceChart.resize();
        }

      }, 50);

    });

  });


  /* Keyboard navigation */

  buttons.forEach((button, index) => {

    button.addEventListener("keydown", (event) => {

      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % buttons.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex =
          (index - 1 + buttons.length) %
          buttons.length;
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft"
      ) {

        event.preventDefault();

        buttons[nextIndex].focus();
        buttons[nextIndex].click();

      }

    });

  });

}


/* =========================================================
   SIMULATOR
   ========================================================= */

function initializeSimulator() {

  const slider =
    document.getElementById("co2-slider");

  if (!slider) {
    return;
  }


  slider.addEventListener("input", () => {

    const value =
      Number(slider.value);

    updateSimulation(value);

  });


  document
    .querySelectorAll(".scenario-btn")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const scenarioName =
          button.dataset.scenario;

        const scenario =
          SCENARIOS[scenarioName];

        if (!scenario) {
          return;
        }


        document
          .querySelectorAll(".scenario-btn")
          .forEach((btn) => {

            btn.classList.toggle(
              "active",
              btn === button
            );

          });


        slider.value =
          scenario.co2;

        updateSimulation(
          scenario.co2,
          scenario
        );

      });

    });

}


function updateSimulation(
  co2,
  scenarioOverride = null
) {

  const scenario =
    scenarioOverride ||
    getScenarioForCO2(co2);


  const performance =
    calculatePerformance(co2);


  setText(
    "co2-slider-value",
    `${formatNumber(co2)} ppm`
  );


  setText(
    "environment-value",
    formatNumber(co2)
  );


  setText(
    "environment-status",
    scenario.status
  );


  setText(
    "performance-value",
    Math.round(performance)
  );


  const change =
    ((performance - SCENARIOS.baseline.performance) /
      SCENARIOS.baseline.performance) *
    100;


  setText(
    "change-value",
    `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`
  );


  setText(
    "change-status",
    change === 0
      ? "No change"
      : "Demonstration change"
  );


  setText(
    "science-title",
    scenario.title
  );


  setText(
    "science-text",
    scenario.text
  );


  updateStatusClasses(co2);


  updateAnalysis();

}


function calculatePerformance(co2) {

  /*
   * Demonstration-only relationship.
   * This is intentionally NOT a physiological model.
   */

  if (co2 <= BASELINE_CO2) {
    return 240;
  }

  const difference =
    co2 - BASELINE_CO2;

  return 240 + difference * 0.04;
}


function getScenarioForCO2(co2) {

  if (co2 < 1800) {
    return SCENARIOS.baseline;
  }

  if (co2 < 3200) {
    return SCENARIOS.elevated;
  }

  return SCENARIOS.high;
}


function updateStatusClasses(co2) {

  const environmentStatus =
    document.getElementById(
      "environment-status"
    );

  const changeStatus =
    document.getElementById(
      "change-status"
    );


  environmentStatus.classList.remove(
    "safe-text"
  );

  changeStatus.classList.remove(
    "safe-text"
  );


  if (co2 < 1800) {

    environmentStatus.classList.add(
      "safe-text"
    );

    changeStatus.classList.add(
      "safe-text"
    );

  }

}


/* =========================================================
   CHARTS
   ========================================================= */

function initializeCharts() {

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
    document.getElementById(
      "environmentChart"
    );

  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  environmentChart =
    new Chart(ctx, {

      type: "line",

      data: {

        labels: activeData.labels,

        datasets: [

          {
            label: "CO₂",

            data: activeData.environment,

            borderWidth: 3,

            pointRadius: 4,

            pointHoverRadius: 6,

            tension: 0.35,

            fill: true,

            backgroundColor:
              "rgba(69, 215, 255, 0.10)",

            borderColor:
              "#45d7ff",

            pointBackgroundColor:
              "#45d7ff"
          }

        ]

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
            display: false
          },

          tooltip: {
            callbacks: {

              label: (context) => {

                return (
                  ` CO₂: ${formatNumber(
                    context.parsed.y
                  )} ppm`
                );

              }

            }
          }

        },

        scales: {

          x: {

            grid: {
              color:
                "rgba(255,255,255,0.06)"
            },

            ticks: {
              color: "#9ba8ba"
            }

          },

          y: {

            grid: {
              color:
                "rgba(255,255,255,0.06)"
            },

            ticks: {

              color: "#9ba8ba",

              callback: (value) =>
                `${value} ppm`

            }

          }

        }

      }

    });

}


function createPerformanceChart() {

  const canvas =
    document.getElementById(
      "performanceChart"
    );

  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  performanceChart =
    new Chart(ctx, {

      type: "line",

      data: {

        labels: activeData.labels,

        datasets: [

          {
            label: "Reaction time",

            data: activeData.performance,

            borderWidth: 3,

            pointRadius: 4,

            tension: 0.35,

            borderColor:
              "#9b8cff",

            backgroundColor:
              "rgba(155, 140, 255, 0.10)",

            fill: true
          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          x: {

            grid: {
              color:
                "rgba(255,255,255,0.06)"
            },

            ticks: {
              color: "#9ba8ba"
            }

          },

          y: {

            grid: {
              color:
                "rgba(255,255,255,0.06)"
            },

            ticks: {

              color: "#9ba8ba",

              callback: (value) =>
                `${value} ms`

            }

          }

        }

      }

    });

}


function updateCharts() {

  if (environmentChart) {

    environmentChart.data.labels =
      activeData.labels;

    environmentChart.data.datasets[0].data =
      activeData.environment;

    environmentChart.update();

  }


  if (performanceChart) {

    performanceChart.data.labels =
      activeData.labels;

    performanceChart.data.datasets[0].data =
      activeData.performance;

    performanceChart.update();

  }

}


function showChartError() {

  const error =
    document.getElementById(
      "chart-error"
    );

  if (error) {
    error.classList.remove("hidden");
  }

}


/* =========================================================
   ANALYSIS
   ========================================================= */

function updateDashboard() {

  updateSimulation(
    Number(
      document.getElementById(
        "co2-slider"
      )?.value || 1200
    )
  );

  updateStatistics();

  updateAnalysis();

}


function updateStatistics() {

  const values =
    activeData.environment
      .filter(Number.isFinite);


  if (!values.length) {
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


  setText(
    "mean-co2",
    `${Math.round(mean).toLocaleString()} ppm`
  );


  setText(
    "peak-co2",
    `${peak.toLocaleString()} ppm`
  );


  setText(
    "min-co2",
    `${minimum.toLocaleString()} ppm`
  );


  setText(
    "data-points",
    values.length
  );


  setText(
    "dataset-rows",
    values.length
  );

}


function updateAnalysis() {

  const values =
    activeData.environment;


  if (values.length < 2) {
    return;
  }


  const first =
    values[0];

  const last =
    values[values.length - 1];


  const difference =
    last - first;


  let trend = "Stable";


  if (difference > 50) {
    trend = "Increasing";
  }

  else if (difference < -50) {
    trend = "Decreasing";
  }


  setText(
    "trend-result",
    trend
  );


  const current =
    Number(
      document.getElementById(
        "co2-slider"
      )?.value || BASELINE_CO2
    );


  const baselineDifference =
    ((current - BASELINE_CO2) /
      BASELINE_CO2) *
    100;


  setText(
    "baseline-result",
    `${baselineDifference >= 0 ? "+" : ""}${baselineDifference.toFixed(1)}%`
  );

}


/* =========================================================
   CSV UPLOAD
   ========================================================= */

function initializeCSVUpload() {

  const fileInput =
    document.getElementById(
      "csv-file-input"
    );

  const browseButton =
    document.getElementById(
      "browse-csv-btn"
    );

  const clearButton =
    document.getElementById(
      "clear-csv-btn"
    );

  const dropZone =
    document.getElementById(
      "drop-zone"
    );


  if (
    !fileInput ||
    !browseButton ||
    !clearButton ||
    !dropZone
  ) {
    return;
  }


  browseButton.addEventListener(
    "click",
    () => fileInput.click()
  );


  fileInput.addEventListener(
    "change",
    () => {

      const file =
        fileInput.files?.[0];

      if (file) {
        processCSVFile(file);
      }

    }
  );


  clearButton.addEventListener(
    "click",
    clearCustomDataset
  );


  [
    "dragenter",
    "dragover"
  ].forEach((eventName) => {

    dropZone.addEventListener(
      eventName,
      (event) => {

        event.preventDefault();

        dropZone.classList.add(
          "drag-over"
        );

      }
    );

  });


  [
    "dragleave",
    "drop"
  ].forEach((eventName) => {

    dropZone.addEventListener(
      eventName,
      (event) => {

        event.preventDefault();

        dropZone.classList.remove(
          "drag-over"
        );

      }
    );

  });


  dropZone.addEventListener(
    "drop",
    (event) => {

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
          "Please select a CSV file."
        );

        return;
      }


      processCSVFile(file);

    }
  );

}


function processCSVFile(file) {

  const reader =
    new FileReader();


  setFileStatus(
    `Reading ${file.name}...`
  );


  reader.onload = (event) => {

    try {

      const text =
        String(
          event.target.result || ""
        );


      const parsed =
        parseCSV(text);


      if (
        !parsed.rows.length
      ) {

        throw new Error(
          "No valid rows were found."
        );

      }


      const columnInfo =
        detectColumns(
          parsed.headers,
          parsed.rows
        );


      if (
        !columnInfo.co2Column
      ) {

        throw new Error(
          "No numeric CO₂/environment column could be identified."
        );

      }


      const extracted =
        extractDataset(
          parsed,
          columnInfo
        );


      if (
        extracted.environment.length < 2
      ) {

        throw new Error(
          "At least two valid numeric CO₂ values are required."
        );

      }


      activeData =
        extracted;


      customDatasetLoaded =
        true;


      updateDatasetInformation(
        file,
        parsed,
        columnInfo
      );


      document
        .getElementById(
          "clear-csv-btn"
        )
        .disabled = false;


      setFileStatus(
        `Loaded ${file.name} successfully. ` +
        `${extracted.environment.length} valid data points detected.`
      );


      updateStatistics();

      updateAnalysis();

      updateCharts();

    }

    catch (error) {

      setFileStatus(
        `Could not load dataset: ${error.message}`
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
   SIMPLE CSV PARSER
   ========================================================= */

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


    if (char === '"') {

      insideQuotes =
        !insideQuotes;

      continue;
    }


    if (
      char === "," &&
      !insideQuotes
    ) {

      row.push(cell.trim());

      cell = "";

      continue;
    }


    if (
      (char === "\n" || char === "\r") &&
      !insideQuotes
    ) {

      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }


      row.push(cell.trim());

      cell = "";


      if (
        row.some(
          value => value !== ""
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

    row.push(cell.trim());

    if (
      row.some(
        value => value !== ""
      )
    ) {

      rows.push(row);

    }

  }


  if (!rows.length) {

    return {
      headers: [],
      rows: []
    };

  }


  const headers =
    rows[0].map(
      header =>
        header.trim()
    );


  const dataRows =
    rows
      .slice(1)
      .map((values) => {

        const object = {};

        headers.forEach(
          (header, index) => {

            object[header] =
              values[index] ?? "";

          }
        );

        return object;

      });


  return {
    headers,
    rows: dataRows
  };

}


/* =========================================================
   COLUMN DETECTION
   ========================================================= */

function detectColumns(
  headers,
  rows
) {

  const normalized =
    headers.map(
      header => ({
        original: header,

        normalized:
          header
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
      })
    );


  const co2Keywords = [
    "co2",
    "carbon dioxide",
    "carbondioxide",
    "co2ppm",
    "carbon"
  ];


  let co2Column = null;


  for (
    const keyword of co2Keywords
  ) {

    const normalizedKeyword =
      keyword
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");


    const match =
      normalized.find(
        item =>
          item.normalized.includes(
            normalizedKeyword
          )
      );


    if (match) {

      co2Column =
        match.original;

      break;

    }

  }


  if (!co2Column) {

    for (
      const item of normalized
    ) {

      const numericCount =
        rows.filter(
          row =>
            Number.isFinite(
              parseNumber(
                row[item.original]
              )
            )
        ).length;


      if (
        numericCount >=
        Math.max(
          2,
          Math.ceil(rows.length * 0.5)
        )
      ) {

        co2Column =
          item.original;

        break;

      }

    }

  }


  const timeKeywords = [
    "time",
    "date",
    "datetime",
    "timestamp",
    "label",
    "elapsed"
  ];


  let timeColumn = null;


  for (
    const keyword of timeKeywords
  ) {

    const normalizedKeyword =
      keyword
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");


    const match =
      normalized.find(
        item =>
          item.normalized.includes(
            normalizedKeyword
          )
      );


    if (match) {

      timeColumn =
        match.original;

      break;

    }

  }


  return {
    co2Column,
    timeColumn
  };

}


/* =========================================================
   EXTRACT DATA
   ========================================================= */

function extractDataset(
  parsed,
  columnInfo
) {

  const labels = [];
  const environment = [];


  parsed.rows.forEach(
    (row, index) => {

      const value =
        parseNumber(
          row[columnInfo.co2Column]
        );


      if (
        Number.isFinite(value)
      ) {

        const label =
          columnInfo.timeColumn
            ? row[columnInfo.timeColumn]
            : `Point ${index + 1}`;


        labels.push(
          label || `Point ${index + 1}`
        );

        environment.push(value);

      }

    }
  );


  /*
   * Performance values are kept as demonstration
   * references unless the uploaded dataset contains
   * a suitable performance column.
   */

  const performance =
    environment.map(
      () => 240
    );


  return {
    labels,
    environment,
    performance
  };

}


function parseNumber(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return NaN;
  }


  const cleaned =
    String(value)
      .replace(/,/g, "")
      .replace(/[^\d.-]/g, "");


  return Number(cleaned);

}


/* =========================================================
   DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation(
  file,
  parsed,
  columnInfo
) {

  setText(
    "dataset-name",
    file.name
  );


  setText(
    "dataset-rows",
    parsed.rows.length
  );


  setText(
    "dataset-co2-column",
    columnInfo.co2Column ||
      "Detected numeric column"
  );


  setText(
    "dataset-time-column",
    columnInfo.timeColumn ||
      "Generated labels"
  );


  setText(
    "dataset-validation",
    "Browser formatting check passed"
  );


  const validation =
    document.getElementById(
      "dataset-validation"
    );


  validation.classList.add(
    "safe-text"
  );


  setText(
    "dataset-badge",
    "CUSTOM DATA"
  );


  setText(
    "statistics-source",
    "Custom browser dataset"
  );

}


function clearCustomDataset() {

  activeData = {
    labels: [...DEMO_DATA.labels],
    environment: [...DEMO_DATA.environment],
    performance: [...DEMO_DATA.performance]
  };


  customDatasetLoaded =
    false;


  setText(
    "dataset-name",
    "Built-in demonstration data"
  );


  setText(
    "dataset-rows",
    "7"
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


  setText(
    "dataset-badge",
    "DEMONSTRATION"
  );


  setText(
    "statistics-source",
    "Demonstration dataset"
  );


  const fileInput =
    document.getElementById(
      "csv-file-input"
    );


  if (fileInput) {
    fileInput.value = "";
  }


  const clearButton =
    document.getElementById(
      "clear-csv-btn"
    );


  if (clearButton) {
    clearButton.disabled = true;
  }


  setFileStatus(
    "No custom dataset loaded."
  );


  updateStatistics();

  updateAnalysis();

  updateCharts();

}


/* =========================================================
   PVT TEST
   ========================================================= */

function initializePVT() {

  const startButton =
    document.getElementById(
      "pvt-start-btn"
    );

  const pvtBox =
    document.getElementById(
      "pvt-box"
    );


  if (
    !startButton ||
    !pvtBox
  ) {
    return;
  }


  startButton.addEventListener(
    "click",
    startPVT
  );


  pvtBox.addEventListener(
    "click",
    handlePVTResponse
  );


  pvtBox.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        handlePVTResponse();

      }

    }
  );

}


function startPVT() {

  const box =
    document.getElementById(
      "pvt-box"
    );

  const button =
    document.getElementById(
      "pvt-start-btn"
    );


  if (!box || !button) {
    return;
  }


  clearTimeout(pvtTimer);


  pvtReady = false;

  pvtStartTime = null;


  box.classList.remove(
    "ready"
  );

  box.classList.add(
    "waiting"
  );


  box.textContent =
    "Wait for green...";


  button.disabled = true;


  const delay =
    1500 +
    Math.random() * 3500;


  pvtTimer =
    setTimeout(() => {

      pvtReady = true;

      pvtStartTime =
        performance.now();


      box.classList.remove(
        "waiting"
      );

      box.classList.add(
        "ready"
      );


      box.textContent =
        "CLICK NOW!";

    }, delay);

}


function handlePVTResponse() {

  const box =
    document.getElementById(
      "pvt-box"
    );


  if (!box) {
    return;
  }


  if (!pvtReady) {

    return;

  }


  const reaction =
    Math.round(
      performance.now() -
      pvtStartTime
    );


  pvtReady = false;

  pvtScores.push(reaction);


  box.classList.remove(
    "ready"
  );


  box.textContent =
    `${reaction} ms`;


  setText(
    "pvt-score",
    `${reaction} ms`
  );


  updatePVTStatistics();


  const button =
    document.getElementById(
      "pvt-start-btn"
    );


  if (button) {
    button.disabled = false;
  }

}


function updatePVTStatistics() {

  const trials =
    pvtScores.length;


  if (!trials) {
    return;
  }


  const average =
    pvtScores.reduce(
      (sum, score) =>
        sum + score,
      0
    ) / trials;


  const best =
    Math.min(...pvtScores);


  const lapses =
    pvtScores.filter(
      score => score > 500
    ).length;


  setText(
    "pvt-trials",
    trials
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
    lapses
  );

}


/* =========================================================
   EXPORT
   ========================================================= */

function initializeExport() {

  const button =
    document.getElementById(
      "export-btn"
    );


  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      window.print();

    }
  );

}


/* =========================================================
   HELPERS
   ========================================================= */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (element) {
    element.textContent = value;
  }

}


function setFileStatus(message) {

  const element =
    document.getElementById(
      "file-status-msg"
    );


  if (element) {
    element.textContent = message;
  }

}


function formatNumber(value) {

  return Number(value)
    .toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 0
      }
    );

             }
