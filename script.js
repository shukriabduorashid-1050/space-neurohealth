/* =========================================================
SPACE NEUROHEALTH
NASA SPACE APPS CHALLENGE PROTOTYPE

IMPORTANT:
All values below are DEMONSTRATION DATA.

They are not presented as actual NASA measurements.
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
  "Baseline demonstration condition",

performanceStatus:
  "Reference indicator",

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
  "measurement. In the final project, this value will " +
  "come from a verified NASA dataset and will be " +
  "interpreted according to documented scientific evidence."

},

elevated: {

environment: 2800,

unit: "ppm CO₂",

performance: 285,

change: 18.8,

environmentStatus:
  "Elevated demonstration value",

performanceStatus:
  "Reference indicator",

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
  "should not be treated as evidence that the environmental " +
  "measurement caused a change in cognition."

},

high: {

environment: 4100,

unit: "ppm CO₂",

performance: 350,

change: 20,

environmentStatus:
  "High demonstration value",

performanceStatus:
  "Reference indicator",

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
  "further investigation. A real alert threshold would " +
  "only be added after reviewing the relevant NASA dataset, " +
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
GLOBAL VARIABLES
========================================================= */

let environmentChart = null;

let performanceChart = null;

/* =========================================================
CHART COLORS
========================================================= */

const chartTextColor =
"#8b949e";

const chartGridColor =
"#1d2a3a";

/* =========================================================
CREATE ENVIRONMENT CHART
========================================================= */

function createEnvironmentChart() {

const canvas =
document.getElementById(
"environmentChart"
);

if (!canvas) {
console.warn(
"environmentChart canvas was not found."
);

return;

}

if (typeof Chart === "undefined") {

console.error(
  "Chart.js is not loaded."
);

return;

}

const ctx =
canvas.getContext("2d");

environmentChart =
new Chart(ctx, {

  type: "line",

  data: {

    labels:
      chartData.baseline.labels,

    datasets: [

      {

        label:
          "Environmental Measurement",

        data:
          chartData.baseline.environment,

        borderColor:
          scenarios.baseline.color,

        backgroundColor:
          hexToRgba(
            scenarios.baseline.color,
            0.10
          ),

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

});

}

/* =========================================================
CREATE PERFORMANCE CHART
========================================================= */

function createPerformanceChart() {

const canvas =
document.getElementById(
"performanceChart"
);

if (!canvas) {

console.warn(
  "performanceChart canvas was not found."
);

return;

}

if (typeof Chart === "undefined") {

console.error(
  "Chart.js is not loaded."
);

return;

}

const ctx =
canvas.getContext("2d");

performanceChart =
new Chart(ctx, {

  type: "line",

  data: {

    labels:
      chartData.baseline.labels,

    datasets: [

      {

        label:
          "Performance Reference",

        data:
          chartData.baseline.performance,

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
            "Reaction time (ms)",

          color:
            chartTextColor

        }

      }

    }

  }

});

}

/* =========================================================
UPDATE DASHBOARD
========================================================= */

function loadScenario(type) {

const selected =
scenarios[type];

const data =
chartData[type];

if (!selected || !data) {

console.error(
  "Unknown scenario:",
  type
);

return;

}

/* -----------------------------------------
ENVIRONMENT
----------------------------------------- */

const environmentValue =
document.getElementById(
"environment-value"
);

if (environmentValue) {

environmentValue.textContent =
  selected.environment.toLocaleString();

}

const environmentUnit =
document.getElementById(
"environment-unit"
);

if (environmentUnit) {

environmentUnit.textContent =
  selected.unit;

}

const environmentStatus =
document.getElementById(
"environment-status"
);

if (environmentStatus) {

environmentStatus.textContent =
  selected.environmentStatus;

environmentStatus.className =
  "metric-status";

if (type === "baseline") {

  environmentStatus.classList.add(
    "safe-text"
  );

}

else if (type === "elevated") {

  environmentStatus.classList.add(
    "warning-text"
  );

}

else {

  environmentStatus.classList.add(
    "danger-text"
  );

}

}

/* -----------------------------------------
PERFORMANCE
----------------------------------------- */

const performanceValue =
document.getElementById(
"performance-value"
);

if (performanceValue) {

performanceValue.textContent =
  selected.performance;

}

const performanceStatus =
document.getElementById(
"performance-status"
);

if (performanceStatus) {

performanceStatus.textContent =
  selected.performanceStatus;

}

/* -----------------------------------------
CHANGE
----------------------------------------- */

const changeValue =
document.getElementById(
"change-value"
);

if (changeValue) {

changeValue.textContent =
  selected.change === 0
    ? "0%"
    : "+" + selected.change + "%";

}

const changeStatus =
document.getElementById(
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

/* -----------------------------------------
SCIENTIFIC INTERPRETATION
----------------------------------------- */

const scienceTitle =
document.getElementById(
"science-title"
);

if (scienceTitle) {

scienceTitle.textContent =
  selected.noteTitle;

}

const scienceText =
document.getElementById(
"science-text"
);

if (scienceText) {

scienceText.textContent =
  selected.note;

}

/* -----------------------------------------
ANALYSIS
----------------------------------------- */

const trendResult =
document.getElementById(
"trend-result"
);

if (trendResult) {

trendResult.textContent =
  selected.trend;

}

const baselineResult =
document.getElementById(
"baseline-result"
);

if (baselineResult) {

baselineResult.textContent =
  selected.change === 0
    ? "0%"
    : "+" + selected.change + "%";

}

const analysisResult =
document.getElementById(
"analysis-result"
);

if (analysisResult) {

analysisResult.textContent =
  "Exploratory";

}

/* -----------------------------------------
ENVIRONMENT CHART
----------------------------------------- */

if (environmentChart) {

environmentChart.data.labels =
  data.labels;

environmentChart.data.datasets[0].data =
  data.environment;

environmentChart.data.datasets[0].borderColor =
  selected.color;

environmentChart.data.datasets[0].backgroundColor =
  hexToRgba(
    selected.color,
    0.10
  );

environmentChart.update();

}

/* -----------------------------------------
PERFORMANCE CHART
----------------------------------------- */

if (performanceChart) {

performanceChart.data.labels =
  data.labels;

performanceChart.data.datasets[0].data =
  data.performance;

performanceChart.update();

}

/* -----------------------------------------
SCENARIO BUTTONS
----------------------------------------- */

document
.querySelectorAll(".scenario-btn")
.forEach(button => {

  const isActive =
    button.dataset.scenario === type;

  button.classList.toggle(
    "active",
    isActive
  );

  button.setAttribute(
    "aria-pressed",
    String(isActive)
  );

});

}

/* =========================================================
HEX → RGBA
========================================================= */

function hexToRgba(
hex,
alpha
) {

const cleanHex =
hex.replace("#", "");

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

if (!buttons.length) {

console.warn(
  "No navigation buttons found."
);

return;

}

buttons.forEach(button => {

button.addEventListener(
  "click",
  () => {

    const target =
      button.dataset.section;


    if (!target) {

      console.error(
        "Navigation button has no data-section:",
        button
      );

      return;
    }


    /* ---------------------------------
       UPDATE BUTTONS
    --------------------------------- */

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


    /* ---------------------------------
       UPDATE SECTIONS
    --------------------------------- */

    sections.forEach(section => {

      const isTarget =
        section.id === target;

      section.classList.toggle(
        "active-section",
        isTarget
      );

      section.hidden =
        !isTarget;

    });


    /* ---------------------------------
       ACCESSIBILITY FOCUS
    --------------------------------- */

    const targetSection =
      document.getElementById(target);

    if (targetSection) {

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }
);

});

}

/* =========================================================
KEYBOARD NAVIGATION
========================================================= */

function setupKeyboardNavigation() {

const buttons =
Array.from(
document.querySelectorAll(".nav-btn")
);

buttons.forEach(
(button, index) => {

  button.addEventListener(
    "keydown",
    event => {

      let nextIndex = null;


      if (event.key === "ArrowRight") {

        nextIndex =
          (index + 1) %
          buttons.length;

      }


      else if (
        event.key === "ArrowLeft"
      ) {

        nextIndex =
          (index - 1 + buttons.length) %
          buttons.length;

      }


      if (nextIndex !== null) {

        event.preventDefault();

        buttons[nextIndex].focus();

        buttons[nextIndex].click();

      }

    }
  );

}

);

}

/* =========================================================
SCENARIO BUTTONS
========================================================= */

function setupScenarioButtons() {

const buttons =
document.querySelectorAll(
".scenario-btn"
);

buttons.forEach(button => {

button.addEventListener(
  "click",
  () => {

    const scenario =
      button.dataset.scenario;

    loadScenario(
      scenario
    );

  }
);

});

}

/* =========================================================
INITIALIZE APPLICATION
========================================================= */

function initializeApp() {

console.log(
"Space NeuroHealth initializing..."
);

/* Make sure the dashboard is visible */
const sections =
document.querySelectorAll(
".section"
);

sections.forEach(section => {

const isDashboard =
  section.id === "dashboard";

section.classList.toggle(
  "active-section",
  isDashboard
);

section.hidden =
  !isDashboard;

});

/* Set dashboard navigation state */
const navButtons =
document.querySelectorAll(
".nav-btn"
);

navButtons.forEach(button => {

const isDashboard =
  button.dataset.section === "dashboard";

button.classList.toggle(
  "active",
  isDashboard
);

button.setAttribute(
  "aria-selected",
  String(isDashboard)
);

});

/* Create charts */
createEnvironmentChart();

createPerformanceChart();

/* Activate navigation */
setupNavigation();

setupKeyboardNavigation();

/* Activate scenarios */
setupScenarioButtons();

/* Load initial scenario */
loadScenario(
"baseline"
);

console.log(
"Space NeuroHealth initialized successfully."
);

}

/* =========================================================
START
========================================================= */

if (
document.readyState === "loading"
) {

document.addEventListener(
"DOMContentLoaded",
initializeApp
);

}

else {

initializeApp();

  }
