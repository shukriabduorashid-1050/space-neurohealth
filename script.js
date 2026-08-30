/* =========================================================
   SPACE NEUROHEALTH
   NASA SPACE APPS RESEARCH PROTOTYPE

   IMPORTANT:
   The built-in values are DEMONSTRATION DATA.

   They are not presented as actual NASA measurements.

   The application is designed so that verified datasets
   can replace the demonstration data.
   ========================================================= */


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const demoData = {

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

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  datasetName:
    "Demonstration Dataset",

  labels:
    [...demoData.labels],

  environment:
    [...demoData.environment],

  performance:
    [...demoData.performance],

  isCustomDataset:
    false

};


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let environmentChart = null;

let performanceChart = null;

let pvtState = "idle";

let pvtStartTime = 0;

let pvtTimer = null;


/* =========================================================
   DOM HELPER
   ========================================================= */

function getElement(id) {

  return document.getElementById(id);

}


/* =========================================================
   NUMBER FORMATTING
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
   HEX → RGBA
   ========================================================= */

function hexToRgba(hex, alpha) {

  const cleanHex =
    hex.replace("#", "");

  const bigint =
    parseInt(cleanHex, 16);

  const r =
    (bigint >> 16) & 255;

  const g =
    (bigint >> 8) & 255;

  const b =
    bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;

}


/* =========================================================
   CHART CREATION
   ========================================================= */

function createCharts() {

  if (
    typeof Chart === "undefined"
  ) {

    console.error(
      "Chart.js could not be loaded."
    );

    return;

  }


  const environmentCanvas =
    getElement("environmentChart");

  const performanceCanvas =
    getElement("performanceChart");


  if (
    environmentCanvas
  ) {

    environmentChart =
      new Chart(
        environmentCanvas.getContext("2d"),
        {

          type: "line",

          data: {

            labels:
              state.labels,

            datasets: [

              {

                label:
                  "CO₂ concentration",

                data:
                  state.environment,

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

          options: getChartOptions(
            "CO₂ concentration (ppm)"
          )

        }
      );

  }


  if (
    performanceCanvas
  ) {

    performanceChart =
      new Chart(
        performanceCanvas.getContext("2d"),
        {

          type: "line",

          data: {

            labels:
              state.labels,

            datasets: [

              {

                label:
                  "Performance reference",

                data:
                  state.performance,

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

          options: getChartOptions(
            "Reaction time (ms)"
          )

        }
      );

  }

}


/* =========================================================
   CHART OPTIONS
   ========================================================= */

function getChartOptions(yTitle) {

  return {

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
            "#8b949e"

        },

        grid: {

          color:
            "#1d2a3a"

        }

      },

      y: {

        beginAtZero:
          false,

        ticks: {

          color:
            "#8b949e"

        },

        grid: {

          color:
            "#1d2a3a"

        },

        title: {

          display:
            true,

          text:
            yTitle,

          color:
            "#8b949e"

        }

      }

    }

  };

}


/* =========================================================
   UPDATE CHARTS
   ========================================================= */

function updateCharts() {

  if (environmentChart) {

    environmentChart.data.labels =
      [...state.labels];

    environmentChart.data.datasets[0].data =
      [...state.environment];

    environmentChart.update();

  }


  if (performanceChart) {

    performanceChart.data.labels =
      [...state.labels];

    performanceChart.data.datasets[0].data =
      [...state.performance];

    performanceChart.update();

  }

}


/* =========================================================
   CALCULATE STATISTICS
   ========================================================= */

function calculateStatistics(values) {

  const validValues =
    values.filter(
      value =>
        Number.isFinite(value)
    );


  if (
    validValues.length === 0
  ) {

    return {

      mean: null,

      min: null,

      max: null

    };

  }


  const sum =
    validValues.reduce(
      (total, value) =>
        total + value,
      0
    );


  return {

    mean:
      sum / validValues.length,

    min:
      Math.min(...validValues),

    max:
      Math.max(...validValues)

  };

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics() {

  const stats =
    calculateStatistics(
      state.environment
    );


  const meanText =
    stats.mean === null
      ? "--"
      : `${formatNumber(stats.mean)} ppm`;

  const minText =
    stats.min === null
      ? "--"
      : `${formatNumber(stats.min)} ppm`;

  const maxText =
    stats.max === null
      ? "--"
      : `${formatNumber(stats.max)} ppm`;


  const meanElements = [

    getElement("mean-co2"),

    getElement("dataset-mean")

  ];

  const minElements = [

    getElement("minimum-co2"),

    getElement("dataset-min")

  ];

  const maxElements = [

    getElement("peak-co2"),

    getElement("dataset-max")

  ];


  meanElements.forEach(
    element => {

      if (element) {
        element.textContent =
          meanText;
      }

    }
  );


  minElements.forEach(
    element => {

      if (element) {
        element.textContent =
          minText;
      }

    }
  );


  maxElements.forEach(
    element => {

      if (element) {
        element.textContent =
          maxText;
      }

    }
  );


  const records =
    getElement(
      "dataset-records"
    );

  if (records) {

    records.textContent =
      state.environment.length;

  }

}


/* =========================================================
   SIMULATOR
   ========================================================= */

function updateDashboardFromCO2(
  value
) {

  const sliderDisplay =
    getElement(
      "co2-slider-value"
    );

  const environmentValue =
    getElement(
      "environment-value"
    );

  const performanceValue =
    getElement(
      "performance-value"
    );

  const changeValue =
    getElement(
      "change-value"
    );

  const environmentStatus =
    getElement(
      "environment-status"
    );

  const changeStatus =
    getElement(
      "change-status"
    );


  if (sliderDisplay) {

    sliderDisplay.textContent =
      `${formatNumber(value)} ppm`;

  }


  /*
    This is an illustrative model.

    It is intentionally NOT described as a physiological
    prediction.
  */

  const estimatedReactionTime =
    Math.round(
      240 +
      ((value - 400) * 0.03)
    );


  const percentChange =
    (
      (
        (
          estimatedReactionTime - 240
        ) / 240
      ) * 100
    ).toFixed(1);


  if (environmentValue) {

    environmentValue.textContent =
      formatNumber(value);

  }


  if (performanceValue) {

    performanceValue.textContent =
      formatNumber(
        estimatedReactionTime
      );

  }


  if (changeValue) {

    changeValue.textContent =
      percentChange === "0.0"
        ? "0%"
        : `+${percentChange}%`;

  }


  /*
    Risk classification is a prototype interface
    classification, not a medical threshold.
  */

  if (environmentStatus) {

    environmentStatus.className =
      "metric-status";


    if (value < 1500) {

      environmentStatus.textContent =
        "Nominal demonstration range";

      environmentStatus.classList.add(
        "safe-text"
      );

    }

    else if (value < 2500) {

      environmentStatus.textContent =
        "Elevated demonstration range";

      environmentStatus.classList.add(
        "warning-text"
      );

    }

    else {

      environmentStatus.textContent =
        "High demonstration range";

      environmentStatus.classList.add(
        "danger-text"
      );

    }

  }


  if (changeStatus) {

    changeStatus.className =
      "metric-status";


    if (value < 1500) {

      changeStatus.textContent =
        "Reference range";

      changeStatus.classList.add(
        "safe-text"
      );

    }

    else if (value < 2500) {

      changeStatus.textContent =
        "Illustrative increase";

      changeStatus.classList.add(
        "warning-text"
      );

    }

    else {

      changeStatus.textContent =
        "Illustrative high output";

      changeStatus.classList.add(
        "danger-text"
      );

    }

  }


  /*
    Generate a smooth demonstration time series around
    the selected value instead of using random noise.
  */

  const generatedData =
    state.labels.map(
      (_, index) => {

        const variation =
          Math.sin(index * 0.9) * 60;

        return Math.round(
          value + variation
        );

      }
    );


  if (environmentChart) {

    environmentChart.data.datasets[0].data =
      generatedData;

    environmentChart.data.datasets[0].borderColor =
      value < 1500
        ? "#3fb950"
        : value < 2500
          ? "#d29922"
          : "#f85149";

    environmentChart.data.datasets[0].backgroundColor =
      value < 1500
        ? hexToRgba("#3fb950", 0.10)
        : value < 2500
          ? hexToRgba("#d29922", 0.10)
          : hexToRgba("#f85149", 0.10);

    environmentChart.update();

  }

}


/* =========================================================
   RESET SIMULATOR
   ========================================================= */

function resetSimulator() {

  const slider =
    getElement("co2-slider");

  if (!slider) {
    return;
  }


  slider.value = "1200";

  updateDashboardFromCO2(
    1200
  );

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


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.section;


          buttons.forEach(
            btn => {

              const selected =
                btn === button;

              btn.classList.toggle(
                "active",
                selected
              );

              btn.setAttribute(
                "aria-selected",
                String(selected)
              );

            }
          );


          sections.forEach(
            section => {

              const isTarget =
                section.id === target;

              section.classList.toggle(
                "active-section",
                isTarget
              );

              section.hidden =
                !isTarget;

            }
          );


          /*
            Resize charts after switching tabs.
            This prevents Chart.js from calculating
            dimensions while a chart is hidden.
          */

          if (target === "dashboard") {

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

        }
      );


      button.addEventListener(
        "keydown",
        event => {

          const buttonList =
            [...buttons];

          const currentIndex =
            buttonList.indexOf(button);


          if (
            event.key === "ArrowRight"
          ) {

            event.preventDefault();

            const next =
              buttonList[
                (currentIndex + 1) %
                buttonList.length
              ];

            next.focus();
            next.click();

          }


          if (
            event.key === "ArrowLeft"
          ) {

            event.preventDefault();

            const previous =
              buttonList[
                (
                  currentIndex -
                  1 +
                  buttonList.length
                ) %
                buttonList.length
              ];

            previous.focus();
            previous.click();

          }

        }
      );

    }
  );

}


/* =========================================================
   PVT SELF TEST
   ========================================================= */

function setupPVT() {

  const box =
    getElement("pvt-box");

  const button =
    getElement("pvt-start-btn");

  const score =
    getElement("pvt-score");

  const result =
    getElement("pvt-result");


  if (
    !box ||
    !button
  ) {
    return;
  }


  function resetPVT() {

    pvtState =
      "idle";

    pvtStartTime =
      0;

    clearTimeout(
      pvtTimer
    );

    box.style.background =
      "#1d2a3a";

    box.textContent =
      'Click "Start Test" Below';

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


    if (score) {

      score.textContent =
        "-- ms";

    }


    if (result) {

      result.textContent =
        "";

    }


    const delay =
      Math.floor(
        Math.random() * 3000
      ) + 2000;


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
        "Too early. Start the test again.";

      if (result) {

        result.textContent =
          "Early response detected.";

      }

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


      box.style.background =
        "#1d2a3a";


      if (score) {

        score.textContent =
          `${elapsed} ms`;

      }


      if (
        elapsed > 500
      ) {

        box.textContent =
          `Lapse indicator: ${elapsed} ms`;

        if (result) {

          result.textContent =
            "The response exceeded the prototype's 500 ms demonstration threshold.";

          result.className =
            "pvt-result danger-text";

        }

      }

      else {

        box.textContent =
          `Response recorded: ${elapsed} ms`;

        if (result) {

          result.textContent =
            "Response recorded within the prototype's demonstration threshold.";

          result.className =
            "pvt-result safe-text";

        }

      }

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
   CSV PARSING
   ========================================================= */

function parseCSV(text) {

  const lines =
    text
      .split(/\r?\n/)
      .map(
        line => line.trim()
      )
      .filter(
        line => line.length > 0
      );


  if (
    lines.length < 2
  ) {

    throw new Error(
      "The CSV file does not contain enough rows."
    );

  }


  const headers =
    lines[0]
      .split(",")
      .map(
        header =>
          header
            .trim()
            .toLowerCase()
      );


  const timeIndex =
    findColumn(
      headers,
      [
        "time",
        "timestamp",
        "datetime",
        "date"
      ]
    );


  const co2Index =
    findColumn(
      headers,
      [
        "co2",
        "co₂",
        "carbon_dioxide",
        "carbon dioxide",
        "co2_ppm"
      ]
    );


  const performanceIndex =
    findColumn(
      headers,
      [
        "performance",
        "reaction_time",
        "reaction time",
        "reaction_time_ms",
        "reaction"
      ]
    );


  if (
    co2Index === -1
  ) {

    throw new Error(
      "No CO₂ column was found. Use a column named 'co2'."
    );

  }


  const labels = [];

  const environment = [];

  const performance = [];


  for (
    let i = 1;
    i < lines.length;
    i++
  ) {

    const cells =
      splitCSVLine(
        lines[i]
      );


    const co2 =
      Number(
        cells[co2Index]
      );


    if (
      !Number.isFinite(co2)
    ) {
      continue;
    }


    const label =
      timeIndex >= 0
        ? cells[timeIndex] || `${i}`
        : `${i}`;


    labels.push(label);

    environment.push(co2);


    if (
      performanceIndex >= 0
    ) {

      const performanceValue =
        Number(
          cells[performanceIndex]
        );


      performance.push(
        Number.isFinite(
          performanceValue
        )
          ? performanceValue
          : null
      );

    }

    else {

      performance.push(null);

    }

  }


  if (
    environment.length === 0
  ) {

    throw new Error(
      "No valid numeric CO₂ values were found."
    );

  }


  return {

    labels,

    environment,

    performance

  };

}


/* =========================================================
   FIND CSV COLUMN
   ========================================================= */

function findColumn(
  headers,
  possibleNames
) {

  for (
    const name of possibleNames
  ) {

    const index =
      headers.indexOf(name);

    if (
      index !== -1
    ) {

      return index;

    }

  }


  return -1;

}


/* =========================================================
   BASIC CSV LINE SPLITTER
   ========================================================= */

function splitCSVLine(line) {

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

      insideQuotes =
        !insideQuotes;

      continue;

    }


    if (
      character === "," &&
      !insideQuotes
    ) {

      result.push(
        current.trim()
      );

      current = "";

    }

    else {

      current +=
        character;

    }

  }


  result.push(
    current.trim()
  );


  return result;

}


/* =========================================================
   LOAD CSV
   ========================================================= */

function loadCSVFile(file) {

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


        state.datasetName =
          file.name;

        state.labels =
          parsed.labels;

        state.environment =
          parsed.environment;

        state.performance =
          parsed.performance;

        state.isCustomDataset =
          true;


        updateApplicationFromDataset();


        if (status) {

          status.textContent =
            `Successfully loaded ${file.name}. ${parsed.environment.length} valid records parsed.`;

          status.className =
            "file-status";

        }

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


  reader.readAsText(
    file
  );

}


/* =========================================================
   DATASET UPDATE
   ========================================================= */

function updateApplicationFromDataset() {

  updateCharts();

  updateStatistics();


  const datasetName =
    getElement(
      "dataset-name"
    );

  if (datasetName) {

    datasetName.textContent =
      state.datasetName;

  }


  const datasetStatus =
    getElement(
      "analysis-dataset-status"
    );

  if (datasetStatus) {

    datasetStatus.textContent =
      state.isCustomDataset
        ? "Custom uploaded dataset"
        : "Demonstration dataset";

  }


  /*
    Set the dashboard measurement to the final
    CO₂ value from the uploaded dataset.
  */

  const lastValue =
    state.environment[
      state.environment.length - 1
    ];


  if (
    Number.isFinite(lastValue)
  ) {

    const slider =
      getElement(
        "co2-slider"
      );


    if (slider) {

      const clampedValue =
        Math.min(
          5000,
          Math.max(
            400,
            lastValue
          )
        );


      slider.value =
        String(
          Math.round(
            clampedValue / 50
          ) * 50
        );

      updateDashboardFromCO2(
        Number(
          slider.value
        )
      );

    }

  }

}


/* =========================================================
   SHOW FILE ERROR
   ========================================================= */

function showFileError(message) {

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
    "file-status error";

}


/* =========================================================
   RESTORE DEMO DATA
   ========================================================= */

function restoreDemoData() {

  state.datasetName =
    "Demonstration Dataset";

  state.labels =
    [...demoData.labels];

  state.environment =
    [...demoData.environment];

  state.performance =
    [...demoData.performance];

  state.isCustomDataset =
    false;


  updateApplicationFromDataset();


  const status =
    getElement(
      "file-status-msg"
    );

  if (status) {

    status.textContent =
      "Demonstration dataset restored.";

    status.className =
      "file-status";

  }


  const input =
    getElement(
      "csv-file-input"
    );

  if (input) {

    input.value =
      "";

  }


  resetSimulator();

}


/* =========================================================
   CSV UPLOAD EVENTS
   ========================================================= */

function setupCSVUpload() {

  const input =
    getElement(
      "csv-file-input"
    );

  const dropZone =
    getElement(
      "upload-drop-zone"
    );


  if (!input) {
    return;
  }


  input.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      loadCSVFile(file);

    }
  );


  if (!dropZone) {
    return;
  }


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

      loadCSVFile(file);

    }
  );

}


/* =========================================================
   EXPORT / PRINT
   ========================================================= */

function exportResearchSummary() {

  window.print();

}


/* =========================================================
   ADD EXPORT BUTTON
   ========================================================= */

function createExportButton() {

  const dashboard =
    getElement(
      "dashboard"
    );


  if (!dashboard) {
    return;
  }


  const heading =
    dashboard.querySelector(
      ".section-heading"
    );


  if (!heading) {
    return;
  }


  const existingButton =
    getElement(
      "export-summary-btn"
    );


  if (existingButton) {
    return;
  }


  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";

  button.id =
    "export-summary-btn";

  button.className =
    "secondary-btn";

  button.textContent =
    "Export Summary";


  button.addEventListener(
    "click",
    exportResearchSummary
  );


  heading.appendChild(
    button
  );

}


/* =========================================================
   SCENARIO / DASHBOARD CONTROLS
   ========================================================= */

function setupControls() {

  const slider =
    getElement(
      "co2-slider"
    );


  if (slider) {

    slider.addEventListener(
      "input",
      event => {

        const value =
          Number(
            event.target.value
          );

        updateDashboardFromCO2(
          value
        );

      }
    );

  }


  const resetButton =
    getElement(
      "reset-simulator"
    );


  if (resetButton) {

    resetButton.addEventListener(
      "click",
      resetSimulator
    );

  }


  const resetDataButton =
    getElement(
      "reset-data"
    );


  if (resetDataButton) {

    resetDataButton.addEventListener(
      "click",
      restoreDemoData
    );

  }

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

  try {

    setupNavigation();

    createCharts();

    setupControls();

    setupPVT();

    setupCSVUpload();

    createExportButton();


    updateStatistics();

    updateDashboardFromCO2(
      1200
    );


  }

  catch (error) {

    console.error(
      "Space NeuroHealth initialization error:",
      error
    );

  }

}


/* =========================================================
   START APPLICATION
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
