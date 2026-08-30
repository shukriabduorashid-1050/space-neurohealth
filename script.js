/* =========================================================
SPACE NEUROHEALTH
INTERACTIVE APPLICATION CONTROLLER

Demonstration values are clearly separated from
user-uploaded datasets.

This prototype does not establish medical or
causal conclusions.
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
SCENARIO INFORMATION
========================================================= */

const scenarios = {

baseline: {

environmentStatus:
  "Nominal Baseline",

trend:
  "Stable",

color:
  "#3fb950",

noteTitle:
  "Baseline environmental condition",

note:
  "This demonstration shows a baseline environmental measurement. In a final research implementation, the measurement should be replaced with a verified dataset and interpreted using documented scientific evidence."

},

elevated: {

environmentStatus:
  "Elevated CO₂ Warning",

trend:
  "Increasing",

color:
  "#d29922",

noteTitle:
  "Elevated environmental measurement",

note:
  "The simulator identifies a higher environmental measurement than the selected baseline. The performance indicator is a demonstration calculation and should not be interpreted as evidence of a causal cognitive effect."

},

high: {

environmentStatus:
  "High Concentration Alert",

trend:
  "Increasing",

color:
  "#f85149",

noteTitle:
  "High demonstration value",

note:
  "This scenario demonstrates how software could flag a high environmental measurement for further investigation. A real alert threshold would require an appropriate dataset, mission requirements, and scientific evidence."

}

};

/* =========================================================
GLOBAL VARIABLES
========================================================= */

let environmentChart = null;
let performanceChart = null;

let activeDataset = {
labels: [...demoData.labels],
environment: [...demoData.environment],
performance: [...demoData.performance],
name: "Demonstration Dataset",
source: "Demonstration values"
};

let currentScenario = "baseline";

let pvtState = "idle";
let pvtTimer = null;
let pvtStartTime = 0;

let pvtHistory = [];

/* =========================================================
DOM READY
========================================================= */

document.addEventListener(
"DOMContentLoaded",
initializeApp
);

/* =========================================================
INITIALIZATION
========================================================= */

function initializeApp() {

setupNavigation();

setupCO2Slider();

setupCSVUploader();

setupPVT();

setupExport();

createCharts();

updateDashboardFromCO2(1200);

updateStatistics();

renderCSVPreview(activeDataset);

renderPVTHistory();

}

/* =========================================================
NAVIGATION
========================================================= */

function setupNavigation() {

const buttons =
document.querySelectorAll(".nav-btn");

const sections =
document.querySelectorAll(".section");

buttons.forEach((button, index) => {

button.addEventListener(
  "click",
  () => {

    showSection(
      button.dataset.section
    );

  }
);


button.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {

      event.preventDefault();

      const nextIndex =
        (index + 1) % buttons.length;

      buttons[nextIndex].focus();

      showSection(
        buttons[nextIndex].dataset.section
      );

    }


    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {

      event.preventDefault();

      const previousIndex =
        (index - 1 + buttons.length)
        % buttons.length;

      buttons[previousIndex].focus();

      showSection(
        buttons[previousIndex].dataset.section
      );

    }

  }
);

});

function showSection(sectionId) {

buttons.forEach(button => {

  const isActive =
    button.dataset.section === sectionId;

  button.classList.toggle(
    "active",
    isActive
  );

  button.setAttribute(
    "aria-selected",
    String(isActive)
  );

});


sections.forEach(section => {

  const isActive =
    section.id === sectionId;

  section.classList.toggle(
    "active-section",
    isActive
  );

  section.hidden =
    !isActive;

});


const activeSection =
  document.getElementById(sectionId);

if (activeSection) {

  activeSection.focus({
    preventScroll: true
  });

}


/*
  Chart.js sometimes needs a resize after a hidden
  container becomes visible.
*/

setTimeout(() => {

  if (environmentChart) {
    environmentChart.resize();
  }

  if (performanceChart) {
    performanceChart.resize();
  }

}, 50);

}

}

/* =========================================================
CO₂ SLIDER
========================================================= */

function setupCO2Slider() {

const slider =
document.getElementById("co2-slider");

if (!slider) {
return;
}

slider.addEventListener(
"input",
event => {

  const value =
    Number(event.target.value);

  updateDashboardFromCO2(
    value
  );

}

);

}

/* =========================================================
LIVE CO₂ CALCULATION
========================================================= */

function updateDashboardFromCO2(value) {

const sliderDisplay =
document.getElementById(
"co2-slider-value"
);

const environmentValue =
document.getElementById(
"environment-value"
);

const performanceValue =
document.getElementById(
"performance-value"
);

const changeValue =
document.getElementById(
"change-value"
);

if (
!sliderDisplay ||
!environmentValue ||
!performanceValue ||
!changeValue
) {

return;

}

/*
Demonstration calculation.

This is intentionally labeled as a prototype
indicator rather than a scientifically validated
physiological model.

*/

const estimatedReactionTime =
Math.round(
240 +
((value - 400) * 0.03)
);

const percentChange =
(
(
(estimatedReactionTime - 240)
/ 240
) * 100
).toFixed(1);

sliderDisplay.textContent =
"${value.toLocaleString()} ppm";

environmentValue.textContent =
value.toLocaleString();

performanceValue.textContent =
estimatedReactionTime;

changeValue.textContent =
percentChange === "0.0"
? "0%"
: "+${percentChange}%";

updateRiskStatus(
value,
Number(percentChange)
);

updateAnalysisMetrics(
value,
Number(percentChange)
);

updateChartsFromSlider(
value,
estimatedReactionTime
);

}

/* =========================================================
RISK STATUS
========================================================= */

function updateRiskStatus(
co2,
percentChange
) {

const status =
document.getElementById(
"environment-status"
);

const changeStatus =
document.getElementById(
"change-status"
);

if (!status || !changeStatus) {
return;
}

status.className =
"metric-status";

changeStatus.className =
"metric-status";

if (co2 < 1500) {

status.textContent =
  "Nominal Baseline";

status.classList.add(
  "safe-text"
);

}

else if (co2 < 2500) {

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

if (percentChange <= 0) {

changeStatus.textContent =
  "No change";

changeStatus.classList.add(
  "safe-text"
);

}

else if (percentChange < 20) {

changeStatus.textContent =
  "Higher than baseline";

changeStatus.classList.add(
  "warning-text"
);

}

else {

changeStatus.textContent =
  "Large simulated difference";

changeStatus.classList.add(
  "danger-text"
);

}

}

/* =========================================================
ANALYSIS METRICS
========================================================= */

function updateAnalysisMetrics(
co2,
percentChange
) {

const trend =
document.getElementById(
"trend-result"
);

const baseline =
document.getElementById(
"baseline-result"
);

const analysis =
document.getElementById(
"analysis-result"
);

if (trend) {

if (co2 < 1500) {
  trend.textContent = "Stable";
}

else if (co2 < 2500) {
  trend.textContent = "Elevated";
}

else {
  trend.textContent = "High";
}

}

if (baseline) {

baseline.textContent =
  percentChange === 0
    ? "0%"
    : `+${percentChange}%`;

}

if (analysis) {

analysis.textContent =
  "Exploratory";

}

}

/* =========================================================
CHART CREATION
========================================================= */

function createCharts() {

if (
typeof Chart === "undefined"
) {

console.error(
  "Chart.js did not load."
);

return;

}

const environmentCanvas =
document.getElementById(
"environmentChart"
);

const performanceCanvas =
document.getElementById(
"performanceChart"
);

if (
environmentCanvas &&
!environmentChart
) {

environmentChart =
  new Chart(
    environmentCanvas.getContext("2d"),
    {

      type: "line",

      data: {

        labels:
          activeDataset.labels,

        datasets: [

          {

            label:
              "Environmental Measurement",

            data:
              activeDataset.environment,

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

      options:
        getChartOptions(
          "CO₂ concentration (ppm)"
        )

    }
  );

}

if (
performanceCanvas &&
!performanceChart
) {

performanceChart =
  new Chart(
    performanceCanvas.getContext("2d"),
    {

      type: "line",

      data: {

        labels:
          activeDataset.labels,

        datasets: [

          {

            label:
              "Performance Reference",

            data:
              activeDataset.performance,

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

      options:
        getChartOptions(
          "Reaction time (ms)"
        )

    }
  );

}

}

/* =========================================================
CHART OPTIONS
========================================================= */

function getChartOptions(
yAxisTitle
) {

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

      color: "#f0f6fc",

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

    borderWidth: 1,

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

    beginAtZero: false,

    ticks: {

      color:
        "#8b949e"

    },

    grid: {

      color:
        "#1d2a3a"

    },

    title: {

      display: true,

      text:
        yAxisTitle,

      color:
        "#8b949e"

    }

  }

}

};

}

/* =========================================================
UPDATE CHART FROM SLIDER
========================================================= */

function updateChartsFromSlider(
co2,
reactionTime
) {

if (!environmentChart) {
return;
}

/*
Generate a smooth demonstration series around
the selected CO₂ value instead of using random
values every time the slider moves.
*/

const offsets = [
-100,
-50,
0,
40,
70,
30,
0
];

const generatedEnvironment =
offsets.map(
offset =>
Math.max(
0,
Math.round(co2 + offset)
)
);

const performanceOffsets = [
-5,
-3,
0,
2,
4,
6,
0
];

const generatedPerformance =
performanceOffsets.map(
offset =>
Math.max(
1,
reactionTime + offset
)
);

environmentChart.data.labels =
demoData.labels;

environmentChart.data.datasets[0].data =
generatedEnvironment;

performanceChart.data.labels =
demoData.labels;

performanceChart.data.datasets[0].data =
generatedPerformance;

const selectedColor =
getRiskColor(co2);

environmentChart.data.datasets[0].borderColor =
selectedColor;

environmentChart.data.datasets[0].backgroundColor =
hexToRgba(
selectedColor,
0.10
);

environmentChart.update("none");

performanceChart.update("none");

updateScienceText(
co2
);

/*
Update statistics to reflect the currently
generated demonstration series.
*/

activeDataset = {

labels: [...demoData.labels],

environment:
  generatedEnvironment,

performance:
  generatedPerformance,

name:
  "Live Simulator",

source:
  "Generated demonstration values"

};

updateStatistics();

renderCSVPreview(
activeDataset
);

}

/* =========================================================
RISK COLOR
========================================================= */

function getRiskColor(
value
) {

if (value < 1500) {
return "#3fb950";
}

if (value < 2500) {
return "#d29922";
}

return "#f85149";

}

/* =========================================================
SCIENTIFIC TEXT
========================================================= */

function updateScienceText(
co2
) {

const title =
document.getElementById(
"science-title"
);

const text =
document.getElementById(
"science-text"
);

if (!title || !text) {
return;
}

if (co2 < 1500) {

title.textContent =
  "Baseline environmental condition";

text.textContent =
  "The simulator is operating near its baseline demonstration range. The displayed performance indicator is an exploratory calculation and does not represent a validated physiological relationship.";

}

else if (co2 < 2500) {

title.textContent =
  "Elevated demonstration condition";

text.textContent =
  "The selected environmental value is higher than the prototype baseline. The interface flags the change for investigation without claiming that the environmental measurement caused a cognitive effect.";

}

else {

title.textContent =
  "High demonstration condition";

text.textContent =
  "The selected value is within the high range of the simulator. This prototype demonstrates how software could identify a measurement for further investigation. Real thresholds would require validated evidence.";

}

}

/* =========================================================
STATISTICS
========================================================= */

function updateStatistics() {

const values =
activeDataset.environment
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

const meanElement =
document.getElementById(
"mean-co2"
);

const peakElement =
document.getElementById(
"peak-co2"
);

const minElement =
document.getElementById(
"min-co2"
);

const countElement =
document.getElementById(
"data-points"
);

if (meanElement) {

meanElement.textContent =
  `${Math.round(mean).toLocaleString()} ppm`;

}

if (peakElement) {

peakElement.textContent =
  `${peak.toLocaleString()} ppm`;

}

if (minElement) {

minElement.textContent =
  `${minimum.toLocaleString()} ppm`;

}

if (countElement) {

countElement.textContent =
  values.length;

}

}

/* =========================================================
CSV UPLOADER
========================================================= */

function setupCSVUploader() {

const input =
document.getElementById(
"csv-file-input"
);

const browseButton =
document.getElementById(
"browse-csv-btn"
);

const uploadCard =
document.getElementById(
"upload-card"
);

const resetButton =
document.getElementById(
"reset-data-btn"
);

if (
!input ||
!browseButton
) {

return;

}

browseButton.addEventListener(
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

    processCSVFile(
      file
    );

  }

}

);

if (uploadCard) {

uploadCard.addEventListener(
  "dragover",
  event => {

    event.preventDefault();

    uploadCard.classList.add(
      "drag-over"
    );

  }
);


uploadCard.addEventListener(
  "dragleave",
  () => {

    uploadCard.classList.remove(
      "drag-over"
    );

  }
);


uploadCard.addEventListener(
  "drop",
  event => {

    event.preventDefault();

    uploadCard.classList.remove(
      "drag-over"
    );


    const file =
      event.dataTransfer.files[0];


    if (
      file &&
      file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {

      processCSVFile(
        file
      );

    }

    else {

      showFileStatus(
        "Please drop a CSV file.",
        true
      );

    }

  }
);

}

if (resetButton) {

resetButton.addEventListener(
  "click",
  restoreDemoData
);

}

}

/* =========================================================
PROCESS CSV
========================================================= */

function processCSVFile(
file
) {

const status =
document.getElementById(
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
  true
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
      !parsed.environment.length
    ) {

      throw new Error(
        "No numeric CO₂ values were detected."
      );

    }


    activeDataset = {

      labels:
        parsed.labels,

      environment:
        parsed.environment,

      performance:
        parsed.performance,

      name:
        file.name,

      source:
        "User-uploaded CSV"

    };


    updateChartsFromDataset();

    updateDatasetInformation(
      file.name,
      parsed
    );

    updateStatistics();

    renderCSVPreview(
      activeDataset
    );


    showFileStatus(
      `Successfully loaded ${file.name} • ${parsed.environment.length} data points parsed.`,
      false
    );

  }

  catch (error) {

    console.error(
      "CSV parsing error:",
      error
    );


    showFileStatus(
      `Could not read the dataset: ${error.message}`,
      true
    );

  }

};

reader.onerror =
() => {

  showFileStatus(
    "The browser could not read this file.",
    true
  );

};

reader.readAsText(
file
);

}

/* =========================================================
CSV PARSER
========================================================= */

function parseCSV(
text
) {

const rows =
text
.replace(/^\uFEFF/, "")
.split(/\r?\n/)
.map(line => line.trim())
.filter(Boolean);

if (rows.length < 2) {

throw new Error(
  "The CSV must contain a header and at least one data row."
);

}

const headers =
splitCSVLine(
rows[0]
).map(
header =>
normalizeHeader(header)
);

const co2Index =
findColumn(
headers,
[
"co2",
"co2ppm",
"co2ppm",
"carbondioxide",
"carbondioxideppm",
"carbon dioxide",
"co₂",
"co₂ppm"
]
);

const timeIndex =
findColumn(
headers,
[
"time",
"timestamp",
"datetime",
"date",
"elapsedtime"
]
);

const performanceIndex =
findColumn(
headers,
[
"performance",
"reactiontime",
"reactiontimems",
"reaction",
"latency",
"response",
"response_time"
]
);

if (co2Index === -1) {

throw new Error(
  "No CO₂ column found. Try a column named CO2, CO₂, or co2_ppm."
);

}

const labels = [];
const environment = [];
const performance = [];

for (
let i = 1;
i < rows.length;
i++
) {

const columns =
  splitCSVLine(
    rows[i]
  );


const co2 =
  parseNumber(
    columns[co2Index]
  );


if (!Number.isFinite(co2)) {
  continue;
}


const time =
  timeIndex !== -1 &&
  columns[timeIndex]
    ? columns[timeIndex]
    : String(i);


let performanceValue =
  performanceIndex !== -1
    ? parseNumber(
        columns[performanceIndex]
      )
    : NaN;


if (!Number.isFinite(performanceValue)) {

  /*
    If the uploaded file does not contain performance
    data, use an empty value rather than pretending
    that it was measured.
  */

  performanceValue =
    null;

}


labels.push(
  time
);

environment.push(
  co2
);

performance.push(
  performanceValue
);

}

return {

labels,
environment,
performance

};

}

/* =========================================================
CSV LINE SPLITTER
========================================================= */

function splitCSVLine(
line
) {

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

  }

  else {

    insideQuotes =
      !insideQuotes;

  }

}

else if (
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
NORMALIZE HEADER
========================================================= */

function normalizeHeader(
header
) {

return String(header)
.trim()
.toLowerCase()
.replace(/["']/g, "")
.replace(/[_-\s]/g, "");

}

/* =========================================================
FIND COLUMN
========================================================= */

function findColumn(
headers,
possibleNames
) {

const normalizedNames =
possibleNames.map(
name =>
normalizeHeader(name)
);

return headers.findIndex(
header =>
normalizedNames.includes(
header
)
);

}

/* =========================================================
NUMBER PARSER
========================================================= */

function parseNumber(
value
) {

if (
value === undefined ||
value === null ||
value === ""
) {

return NaN;

}

const cleaned =
String(value)
.replace(/,/g, "")
.replace(/[^\d.+-]/g, "");

return Number(
cleaned
);

}

/* =========================================================
UPDATE CHARTS FROM DATASET
========================================================= */

function updateChartsFromDataset() {

if (
!environmentChart ||
!performanceChart
) {

return;

}

environmentChart.data.labels =
activeDataset.labels;

environmentChart.data.datasets[0].data =
activeDataset.environment;

environmentChart.data.datasets[0].borderColor =
"#58a6ff";

environmentChart.data.datasets[0].backgroundColor =
"rgba(88,166,255,0.10)";

performanceChart.data.labels =
activeDataset.labels;

const performanceValues =
activeDataset.performance
.map(
value =>
Number.isFinite(value)
? value
: null
);

performanceChart.data.datasets[0].data =
performanceValues;

environmentChart.update();

performanceChart.update();

const firstValue =
activeDataset.environment[0];

if (
Number.isFinite(firstValue)
) {

updateDashboardFromCO2(
  firstValue
);

}

}

/* =========================================================
DATASET INFORMATION
========================================================= */

function updateDatasetInformation(
fileName,
parsed
) {

const name =
document.getElementById(
"dataset-name"
);

const count =
document.getElementById(
"dataset-count"
);

const source =
document.getElementById(
"dataset-source"
);

const status =
document.getElementById(
"dataset-status"
);

if (name) {

name.textContent =
  fileName;

}

if (count) {

count.textContent =
  `${parsed.environment.length} POINTS`;

}

if (source) {

source.textContent =
  "User-uploaded CSV";

}

if (status) {

status.textContent =
  "Loaded";

status.className =
  "safe-text";

}

}

/* =========================================================
CSV PREVIEW
========================================================= */

function renderCSVPreview(
dataset
) {

const body =
document.getElementById(
"csv-preview-body"
);

if (!body) {
return;
}

body.innerHTML = "";

const previewLength =
Math.min(
dataset.labels.length,
10
);

for (
let i = 0;
i < previewLength;
i++
) {

const row =
  document.createElement(
    "tr"
  );


const timeCell =
  document.createElement(
    "td"
  );

const co2Cell =
  document.createElement(
    "td"
  );

const performanceCell =
  document.createElement(
    "td"
  );


timeCell.textContent =
  dataset.labels[i];


co2Cell.textContent =
  `${Number(
    dataset.environment[i]
  ).toLocaleString()} ppm`;


if (
  Number.isFinite(
    dataset.performance[i]
  )
) {

  performanceCell.textContent =
    `${dataset.performance[i]} ms`;

}

else {

  performanceCell.textContent =
    "Not provided";

}


row.appendChild(
  timeCell
);

row.appendChild(
  co2Cell
);

row.appendChild(
  performanceCell
);


body.appendChild(
  row
);

}

if (
dataset.labels.length > 10
) {

const row =
  document.createElement(
    "tr"
  );


const cell =
  document.createElement(
    "td"
  );


cell.colSpan = 3;

cell.textContent =
  `Showing first 10 of ${dataset.labels.length} records.`;


cell.style.color =
  "var(--muted)";


row.appendChild(
  cell
);

body.appendChild(
  row
);

}

}

/* =========================================================
FILE STATUS
========================================================= */

function showFileStatus(
message,
isError
) {

const status =
document.getElementById(
"file-status-msg"
);

if (!status) {
return;
}

status.textContent =
message;

status.className =
isError
? "file-status danger-text"
: "file-status safe-text";

}

/* =========================================================
RESTORE DEMO DATA
========================================================= */

function restoreDemoData() {

activeDataset = {

labels:
  [...demoData.labels],

environment:
  [...demoData.environment],

performance:
  [...demoData.performance],

name:
  "Demonstration Dataset",

source:
  "Demonstration values"

};

const name =
document.getElementById(
"dataset-name"
);

const count =
document.getElementById(
"dataset-count"
);

const source =
document.getElementById(
"dataset-source"
);

const status =
document.getElementById(
"dataset-status"
);

if (name) {
name.textContent =
"Demonstration Dataset";
}

if (count) {
count.textContent =
"7 POINTS";
}

if (source) {
source.textContent =
"Demonstration values";
}

if (status) {

status.textContent =
  "Ready";

status.className =
  "safe-text";

}

updateChartsFromDataset();

updateStatistics();

renderCSVPreview(
activeDataset
);

showFileStatus(
"Demonstration dataset restored.",
false
);

const input =
document.getElementById(
"csv-file-input"
);

if (input) {
input.value = "";
}

}

/* =========================================================
PVT SETUP
========================================================= */

function setupPVT() {

const button =
document.getElementById(
"pvt-start-btn"
);

const box =
document.getElementById(
"pvt-box"
);

const clearHistory =
document.getElementById(
"clear-pvt-history"
);

if (
!button ||
!box
) {

return;

}

button.addEventListener(
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

if (clearHistory) {

clearHistory.addEventListener(
  "click",
  () => {

    pvtHistory = [];

    renderPVTHistory();

  }
);

}

}

/* =========================================================
START PVT
========================================================= */

function startPVT() {

const box =
document.getElementById(
"pvt-box"
);

const button =
document.getElementById(
"pvt-start-btn"
);

const score =
document.getElementById(
"pvt-score"
);

const result =
document.getElementById(
"pvt-result"
);

if (
!box ||
!button
) {

return;

}

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
"WAIT FOR GREEN...";

button.disabled =
true;

button.textContent =
"Test Running...";

if (score) {

score.textContent =
  "-- ms";

}

if (result) {

result.textContent =
  "Stay ready. The test will change when the response target appears.";

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


    if (result) {

      result.textContent =
        "Target appeared. Respond now.";

    }

  },
  delay
);

}

/* =========================================================
PVT CLICK
========================================================= */

function handlePVTClick() {

const box =
document.getElementById(
"pvt-box"
);

const button =
document.getElementById(
"pvt-start-btn"
);

const score =
document.getElementById(
"pvt-score"
);

const result =
document.getElementById(
"pvt-result"
);

if (!box) {
return;
}

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
  "TOO EARLY";


if (result) {

  result.textContent =
    "You responded before the target appeared. Press Start Test to retry.";

}


resetPVTButton();

return;

}

if (
pvtState !== "ready"
) {

return;

}

const elapsed =
Math.round(
performance.now() -
pvtStartTime
);

pvtState =
"idle";

box.style.background =
"#1d2a3a";

box.textContent =
"${elapsed} ms";

if (score) {

score.textContent =
  `${elapsed} ms`;

}

const isLapse =
elapsed > 500;

if (isLapse) {

if (result) {

  result.textContent =
    `Simulated vigilance lapse: ${elapsed} ms.`;

}

}

else {

if (result) {

  result.textContent =
    `Response recorded: ${elapsed} ms.`;

}

}

pvtHistory.unshift({

time:
  new Date(),

score:
  elapsed,

lapse:
  isLapse

});

/*
Keep the interface compact.
*/

pvtHistory =
pvtHistory.slice(
0,
10
);

renderPVTHistory();

resetPVTButton();

}

/* =========================================================
RESET PVT BUTTON
========================================================= */

function resetPVTButton() {

const button =
document.getElementById(
"pvt-start-btn"
);

if (!button) {
return;
}

button.disabled =
false;

button.textContent =
"Start Test";

}

/* =========================================================
PVT HISTORY
========================================================= */

function renderPVTHistory() {

const container =
document.getElementById(
"pvt-history"
);

if (!container) {
return;
}

if (!pvtHistory.length) {

container.innerHTML =
  '<div class="empty-state">No tests completed yet.</div>';

return;

}

container.innerHTML = "";

pvtHistory.forEach(
item => {

  const row =
    document.createElement(
      "div"
    );


  row.className =
    "history-item";


  const time =
    document.createElement(
      "span"
    );


  time.className =
    "history-time";


  time.textContent =
    item.time.toLocaleTimeString();


  const score =
    document.createElement(
      "strong"
    );


  score.className =
    "history-score";


  score.textContent =
    `${item.score} ms`;


  const status =
    document.createElement(
      "span"
    );


  status.className =
    item.lapse
      ? "history-status danger-text"
      : "history-status safe-text";


  status.textContent =
    item.lapse
      ? "Simulated lapse"
      : "Recorded response";


  row.appendChild(
    time
  );

  row.appendChild(
    score
  );

  row.appendChild(
    status
  );


  container.appendChild(
    row
  );

}

);

}

/* =========================================================
EXPORT / PRINT
========================================================= */

function setupExport() {

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
HEX → RGBA
========================================================= */

function hexToRgba(
hex,
alpha
) {

const cleanHex =
hex.replace(
"#",
""
);

const bigint =
parseInt(
cleanHex,
16
);

const r =
(bigint >> 16) & 255;

const g =
(bigint >> 8) & 255;

const b =
bigint & 255;

return (
"rgba(${r}, ${g}, ${b}, ${alpha})"
);

      }
