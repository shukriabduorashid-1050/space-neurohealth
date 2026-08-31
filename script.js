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
};


/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = {

  baseline: {
    name: "Baseline",
    co2: 1200,
    performance: 240,
    status: "Nominal Baseline",
    statusClass: "safe-text",
    interpretationTitle: "Baseline environmental condition",
    interpretationText:
      "This demonstration represents a baseline environmental condition. The simulated performance value is an interface reference and is not a validated physiological model."
  },

  elevated: {
    name: "Elevated",
    co2: 2500,
    performance: 275,
    status: "Elevated Demonstration",
    statusClass: "",
    interpretationTitle: "Elevated demonstration condition",
    interpretationText:
      "The simulator represents a higher environmental measurement. The associated performance value is illustrative and should not be interpreted as evidence of a physiological effect."
  },

  high: {
    name: "High",
    co2: 4000,
    performance: 330,
    status: "High Demonstration",
    statusClass: "",
    interpretationTitle: "High demonstration condition",
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

  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }

}

function formatNumber(value) {

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2
  });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  const buttons = $all(".nav-btn");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const sectionId = button.dataset.section;

      if (!sectionId) {
        return;
      }

      buttons.forEach(btn => {

        const active = btn === button;

        btn.classList.toggle("active", active);
        btn.setAttribute(
          "aria-selected",
          String(active)
        );

      });


      $all(".section").forEach(section => {

        const active = section.id === sectionId;

        section.hidden = !active;

        section.classList.toggle(
          "active-section",
          active
        );

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

    });

  });

}


/* =========================================================
   SCENARIOS
   ========================================================= */

function setupScenarios() {

  $all(".scenario-btn").forEach(button => {

    button.addEventListener("click", () => {

      const scenarioName = button.dataset.scenario;

      if (!SCENARIOS[scenarioName]) {
        return;
      }

      state.activeScenario = scenarioName;

      $all(".scenario-btn").forEach(btn => {
        btn.classList.toggle(
          "active",
          btn === button
        );
      });

      applyScenario(SCENARIOS[scenarioName]);

    });

  });

}


function applyScenario(scenario) {

  state.currentCO2 = scenario.co2;

  const slider = $("#co2-slider");

  if (slider) {
    slider.value = scenario.co2;
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

  const status = $("#environment-status");

  if (status) {

    status.classList.remove("safe-text");

    if (scenario.statusClass) {
      status.classList.add(
        scenario.statusClass
      );
    }

  }


  setText(
    "performance-value",
    formatNumber(scenario.performance)
  );

  setText(
    "performance-status",
    "Demonstration reference"
  );


  const baselineDifference =
    ((scenario.performance -
      SCENARIOS.baseline.performance) /
      SCENARIOS.baseline.performance) *
    100;

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


  updateEnvironmentChartForScenario();
  updateAnalysis();

}


/* =========================================================
   SLIDER
   ========================================================= */

function setupSlider() {

  const slider = $("#co2-slider");

  if (!slider) {
    return;
  }

  slider.addEventListener("input", () => {

    const value = Number(slider.value);

    state.currentCO2 = value;

    setText(
      "co2-slider-value",
      `${formatNumber(value)} ppm`
    );

    setText(
      "environment-value",
      formatNumber(value)
    );

    updateFromSlider(value);

  });

}


function updateFromSlider(value) {

  let performance;

  if (value <= 1200) {

    performance = 240 -
      ((value - 400) / 800) * 5;

  } else {

    performance =
      240 +
      ((value - 1200) / 3800) * 110;

  }

  performance = Math.round(
    Math.max(220, Math.min(360, performance))
  );


  setText(
    "performance-value",
    formatNumber(performance)
  );


  const baselineDifference =
    ((performance -
      SCENARIOS.baseline.performance) /
      SCENARIOS.baseline.performance) *
    100;


  setText(
    "change-value",
    `${baselineDifference >= 0 ? "+" : ""}${baselineDifference.toFixed(1)}%`
  );


  if (value <= 1500) {

    setText(
      "environment-status",
      "Nominal Demonstration"
    );

  } else if (value <= 3000) {

    setText(
      "environment-status",
      "Elevated Demonstration"
    );

  } else {

    setText(
      "environment-status",
      "High Demonstration"
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

  updateAnalysis();

}


/* =========================================================
   CHART CREATION
   ========================================================= */

function createCharts() {

  if (
    typeof Chart === "undefined"
  ) {

    const error = $("#chart-error");

    if (error) {
      error.classList.remove("hidden");
    }

    return;
  }


  createEnvironmentChart();
  createPerformanceChart();

}


function createEnvironmentChart() {

  const canvas = $("#environmentChart");

  if (!canvas) {
    return;
  }

  try {

    state.charts.environment =
      new Chart(canvas, {

        type: "line",

        data: {
          labels: DEMO_DATA.labels,

          datasets: [{
            label: "CO₂",
            data: DEMO_DATA.environment,
            borderColor: "#51d7e8",
            backgroundColor: "rgba(81, 215, 232, 0.10)",
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
                color: "#edf4ff"
              }
            }
          },

          scales: {

            x: {
              ticks: {
                color: "#8f9caf"
              },

              grid: {
                color: "rgba(255,255,255,0.06)"
              }
            },

            y: {
              ticks: {
                color: "#8f9caf"
              },

              grid: {
                color: "rgba(255,255,255,0.06)"
              }
            }

          }

        }

      });

  } catch (error) {

    console.error(
      "Environment chart error:",
      error
    );

    showChartError();

  }

}


function createPerformanceChart() {

  const canvas = $("#performanceChart");

  if (!canvas) {
    return;
  }

  if (
    typeof Chart === "undefined"
  ) {
    return;
  }

  try {

    state.charts.performance =
      new Chart(canvas, {

        type: "line",

        data: {
          labels: DEMO_DATA.labels,

          datasets: [{
            label: "Reaction Time",
            data: DEMO_DATA.performance,
            borderColor: "#4ea1ff",
            backgroundColor: "rgba(78, 161, 255, 0.10)",
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

          plugins: {
            legend: {
              labels: {
                color: "#edf4ff"
              }
            }
          },

          scales: {

            x: {
              ticks: {
                color: "#8f9caf"
              },

              grid: {
                color: "rgba(255,255,255,0.06)"
              }
            },

            y: {
              ticks: {
                color: "#8f9caf"
              },

              grid: {
                color: "rgba(255,255,255,0.06)"
              }
            }

          }

        }

      });

  } catch (error) {

    console.error(
      "Performance chart error:",
      error
    );

  }

}


/* =========================================================
   CHART UPDATE
   ========================================================= */

function updateEnvironmentChartForScenario() {

  const chart = state.charts.environment;

  if (!chart) {
    return;
  }


  const scenario = SCENARIOS[state.activeScenario];

  if (!scenario) {
    return;
  }


  const base = scenario.co2;

  const offsets = [
    -100,
    -50,
    -20,
    0,
    10,
    -10,
    0
  ];


  chart.data.datasets[0].data =
    offsets.map(offset =>
      Math.max(0, base + offset)
    );


  chart.update();

}


function resizeCharts() {

  setTimeout(() => {

    if (state.charts.environment) {
      state.charts.environment.resize();
    }

    if (state.charts.performance) {
      state.charts.performance.resize();
    }

  }, 100);

}


function showChartError() {

  const error = $("#chart-error");

  if (error) {
    error.classList.remove("hidden");
  }

}


/* =========================================================
   STATISTICS
   ========================================================= */

function calculateStatistics(values) {

  if (!values.length) {

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

    mean: sum / values.length,

    min: Math.min(...values),

    max: Math.max(...values),

    count: values.length

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
   ANALYSIS
   ========================================================= */

function calculateTrend(values) {

  if (values.length < 2) {
    return "Insufficient data";
  }


  const first =
    values[0];

  const last =
    values[values.length - 1];

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


function updateAnalysis() {

  const values =
    state.customDataset
      ? state.customDataset.values
      : DEMO_DATA.environment;


  const trend =
    calculateTrend(values);


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


  updateStatistics(values);

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


  if (!browse || !input) {
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
        event.target.files?.[0];

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
    ].forEach(eventName => {

      dropZone.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          dropZone.classList.add(
            "drag-active"
          );

        }
      );

    });


    [
      "dragleave",
      "drop"
    ].forEach(eventName => {

      dropZone.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          dropZone.classList.remove(
            "drag-active"
          );

        }
      );

    });


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


  reader.onload = event => {

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
        name: file.name,
        values: parsed.values,
        labels: parsed.labels,
        co2Column: parsed.co2Column,
        timeColumn: parsed.timeColumn
      };


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
          .replace(/[^a-z0-9]/g, "")
    );


  const co2Keywords = [
    "co2",
    "carbon dioxide",
    "carbon_dioxide",
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
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
          )
      )
    ) {

      co2Index = i;
      break;

    }

  }


  if (co2Index === -1) {

    for (
      let i = 0;
      i < normalizedHeaders.length;
      i++
    ) {

      if (
        normalizedHeaders[i]
          .includes("carbon")
      ) {

        co2Index = i;
        break;

      }

    }

  }


  if (co2Index === -1) {

    return {
      success: false,
      message:
        "No CO₂ measurement column was detected. Try a column named CO2, carbon_dioxide, CO2_ppm, or environment."
    };

  }


  let timeIndex =
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


    if (!row.length) {
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

    co2Column:
      headers[co2Index],

    timeColumn:
      timeIndex >= 0
        ? headers[timeIndex]
        : "Not detected"

  };

}


/* =========================================================
   SIMPLE CSV ROW PARSER
   Handles quoted commas.
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
    String(dataset.values.length)
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
   CUSTOM CHARTS
   ========================================================= */

function updateCustomCharts() {

  const dataset =
    state.customDataset;


  if (!dataset) {
    return;
  }


  if (state.charts.environment) {

    state.charts.environment.data.labels =
      dataset.labels;

    state.charts.environment.data.datasets[0].data =
      dataset.values;

    state.charts.environment.update();

  }


  if (state.charts.performance) {

    const estimatedReference =
      dataset.values.map(
        value => {

          const relative =
            (value - 1200) /
            1200;

          return Math.round(
            240 +
            relative * 70
          );

        }
      );


    state.charts.performance.data.labels =
      dataset.labels;

    state.charts.performance.data.datasets[0].data =
      estimatedReference;

    state.charts.performance.update();

  }


  state.currentCO2 =
    dataset.values[
      dataset.values.length - 1
    ];

  setText(
    "environment-value",
    formatNumber(state.currentCO2)
  );

  setText(
    "co2-slider-value",
    `${formatNumber(state.currentCO2)} ppm`
  );


  const slider =
    $("#co2-slider");

  if (slider) {

    slider.value =
      Math.min(
        Number(slider.max),
        Math.max(
          Number(slider.min),
          state.currentCO2
        )
      );

  }

}


/* =========================================================
   CLEAR DATASET
   ========================================================= */

function clearDataset() {

  state.customDataset = null;

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


  if (state.charts.environment) {

    state.charts.environment.data.labels =
      DEMO_DATA.labels;

    state.charts.environment.data.datasets[0].data =
      DEMO_DATA.environment;

    state.charts.environment.update();

  }


  if (state.charts.performance) {

    state.charts.performance.data.labels =
      DEMO_DATA.labels;

    state.charts.performance.data.datasets[0].data =
      DEMO_DATA.performance;

    state.charts.performance.update();

  }


  state.currentCO2 =
    SCENARIOS[state.activeScenario].co2;


  applyScenario(
    SCENARIOS[state.activeScenario]
  );


  updateAnalysis();

}


/* =========================================================
   FILE STATUS
   ========================================================= */

function setFileStatus(message) {

  const element =
    $("#file-status-msg");

  if (element) {
    element.textContent = message;
  }

}


/* =========================================================
   PVT TEST
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


  pvt.running = true;
  pvt.ready = false;
  pvt.startTime = null;


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


  pvt.ready = true;

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
      clearTimeout(pvt.timer);
    }


    pvt.running = false;
    pvt.ready = false;


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


  pvt.trials.push(
    reactionTime
  );


  if (reactionTime > 500) {
    pvt.lapses++;
  }


  pvt.running = false;
  pvt.ready = false;


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
      "pvt-lapses",
      String(state.pvt.lapses)
    );

    return;

  }


  const last =
    trials[trials.length - 1];


  const average =
    trials.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / count;


  const best =
    Math.min(...trials);


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
    String(state.pvt.lapses)
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

  const currentScenario =
    SCENARIOS[state.activeScenario];


  const originalTitle =
    document.title;


  document.title =
    "Space NeuroHealth Research Summary";


  const message =
    `Space NeuroHealth

Scenario: ${currentScenario.name}
CO₂: ${formatNumber(state.currentCO2)} ppm
Performance indicator: ${$("#performance-value")?.textContent || "--"} ms
Change from baseline: ${$("#change-value")?.textContent || "--"}

Dataset:
${state.customDataset
  ? state.customDataset.name
  : "Built-in demonstration data"}

PVT trials:
${state.pvt.trials.length}

PVT average:
${state.pvt.trials.length
  ? `${Math.round(
      state.pvt.trials.reduce(
        (a, b) => a + b,
        0
      ) / state.pvt.trials.length
    )} ms`
  : "--"}

This report contains demonstration/interface data
unless a validated dataset has been loaded.`;


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
        }


        state.pvt.running = false;
        state.pvt.ready = false;


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

  setupPVT();

  setupExport();

  setupKeyboardNavigation();


  updateStatistics(
    DEMO_DATA.environment
  );


  updateDatasetInformation();


  /*
    Chart.js is loaded with defer before this script,
    so DOMContentLoaded is sufficient for initialization.
  */

  createCharts();


  applyScenario(
    SCENARIOS.baseline
  );


  updateAnalysis();

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
