"use strict";

/*
SPACE NEUROHEALTH
Interactive JavaScript

This prototype uses demonstration
values for educational visualization.

CO₂:
Baseline  = 1,200 ppm
Elevated  = 2,800 ppm
High      = 4,100 ppm

Reaction time:
Baseline  = 240 ms
Elevated  = 285 ms
High      = 350 ms
*/

/* =========================
DATA
========================= */

const scenarios = {

baseline: {
name: "Baseline Environment",
description:
"Reference conditions used for comparison.",
co2: 1200,
reaction: 240,
cognitive: "Reference",
co2Status: "Baseline reference",
reactionStatus: "Baseline reference",
interpretationTitle:
"Baseline reference condition",
interpretation:
"The baseline scenario provides a reference point for comparing the other environmental conditions in this demonstration."
},

elevated: {
name: "Elevated CO₂",
description:
"An elevated environmental CO₂ scenario.",
co2: 2800,
reaction: 285,
cognitive: "Elevated",
co2Status: "Elevated scenario",
reactionStatus: "Slower response",
interpretationTitle:
"Elevated environmental condition",
interpretation:
"The demonstration shows a higher CO₂ value together with a higher reaction-time value. This pattern is an observation within the example dataset, not proof of causation."
},

high: {
name: "High CO₂",
description:
"A high environmental CO₂ scenario.",
co2: 4100,
reaction: 350,
cognitive: "Changed",
co2Status: "High scenario",
reactionStatus: "Slowest response",
interpretationTitle:
"High environmental condition",
interpretation:
"The high scenario has the highest CO₂ and reaction-time values in the demonstration. Other factors would need to be controlled before drawing scientific conclusions."
}

};

/* =========================
DOM HELPERS
========================= */

function getElement(id) {
return document.getElementById(id);
}

function setText(id, value) {
const element = getElement(id);

if (element) {
element.textContent = value;
}
}

/* =========================
ELEMENTS
========================= */

const navButtons =
document.querySelectorAll(".nav-btn");

const sections =
document.querySelectorAll(".section");

const scenarioButtons =
document.querySelectorAll(".scenario-btn");

/* =========================
NAVIGATION
========================= */

function showSection(sectionId) {

sections.forEach((section) => {

const isActive =
  section.id === sectionId;

section.classList.toggle(
  "active-section",
  isActive
);

section.setAttribute(
  "aria-hidden",
  String(!isActive)
);

});

navButtons.forEach((button) => {

const isActive =
  button.dataset.section === sectionId;

button.classList.toggle(
  "active",
  isActive
);

button.setAttribute(
  "aria-current",
  isActive ? "page" : "false"
);

});

/*
When returning to the dashboard,
resize charts so Chart.js can correctly
calculate their container dimensions.
*/

if (sectionId === "dashboard") {

requestAnimationFrame(() => {

  if (co2Chart) {
    co2Chart.resize();
  }

  if (reactionChart) {
    reactionChart.resize();
  }

});

}
}

navButtons.forEach((button) => {

button.addEventListener("click", () => {

const sectionId =
  button.dataset.section;

if (!sectionId) {
  return;
}

showSection(sectionId);

window.scrollTo({
  top: 0,
  behavior: "smooth"
});

});

});

/* =========================
CHART DATA
========================= */

const labels = [
"Baseline",
"Elevated CO₂",
"High CO₂"
];

const co2Values = [
scenarios.baseline.co2,
scenarios.elevated.co2,
scenarios.high.co2
];

const reactionValues = [
scenarios.baseline.reaction,
scenarios.elevated.reaction,
scenarios.high.reaction
];

/* =========================
CHART CONFIGURATION
========================= */

let co2Chart = null;
let reactionChart = null;

function createCharts() {

if (
typeof Chart === "undefined"
) {
console.warn(
"Chart.js could not be loaded."
);

return;

}

const co2Canvas =
getElement("co2Chart");

const reactionCanvas =
getElement("reactionChart");

if (
!co2Canvas ||
!reactionCanvas
) {
return;
}

/*
Destroy existing charts first.
This prevents duplicate Chart.js
instances if initialization runs again.
*/

if (co2Chart) {
co2Chart.destroy();
}

if (reactionChart) {
reactionChart.destroy();
}

const commonOptions = {

responsive: true,

maintainAspectRatio: false,

interaction: {
  mode: "index",
  intersect: false
},

plugins: {

  legend: {
    display: false
  },

  tooltip: {
    callbacks: {

      label(context) {

        return `${context.dataset.label}: ${context.parsed.y}`;
      }

    }
  }

},

scales: {

  x: {

    grid: {
      color: "rgba(150, 180, 220, 0.08)"
    },

    ticks: {
      color: "#9eacc2"
    }

  },

  y: {

    beginAtZero: false,

    grid: {
      color: "rgba(150, 180, 220, 0.08)"
    },

    ticks: {
      color: "#9eacc2"
    }

  }

}

};

/* =========================
CO₂ CHART
========================== */

co2Chart = new Chart(
co2Canvas,
{

  type: "line",

  data: {

    labels,

    datasets: [

      {
        label: "CO₂",

        data: co2Values,

        borderColor: "#48d9ff",

        backgroundColor:
          "rgba(72, 217, 255, 0.12)",

        pointBackgroundColor:
          "#48d9ff",

        pointBorderColor:
          "#ffffff",

        pointBorderWidth: 1,

        pointRadius: 5,

        pointHoverRadius: 7,

        borderWidth: 3,

        tension: 0.35,

        fill: true
      }

    ]

  },

  options: {

    ...commonOptions,

    scales: {

      ...commonOptions.scales,

      y: {

        ...commonOptions.scales.y,

        title: {
          display: true,
          text: "CO₂ (ppm)",
          color: "#9eacc2"
        }

      }

    }

  }

}

);

/* =========================
REACTION TIME CHART
========================== */

reactionChart = new Chart(
reactionCanvas,
{

  type: "line",

  data: {

    labels,

    datasets: [

      {
        label: "Reaction Time",

        data: reactionValues,

        borderColor: "#62e6ad",

        backgroundColor:
          "rgba(98, 230, 173, 0.12)",

        pointBackgroundColor:
          "#62e6ad",

        pointBorderColor:
          "#ffffff",

        pointBorderWidth: 1,

        pointRadius: 5,

        pointHoverRadius: 7,

        borderWidth: 3,

        tension: 0.35,

        fill: true
      }

    ]

  },

  options: {

    ...commonOptions,

    scales: {

      ...commonOptions.scales,

      y: {

        ...commonOptions.scales.y,

        title: {
          display: true,
          text: "Reaction Time (ms)",
          color: "#9eacc2"
        }

      }

    }

  }

}

);

}

/* =========================
UPDATE DASHBOARD
========================= */

function updateDashboard(
scenarioKey
) {

const scenario =
scenarios[scenarioKey];

if (!scenario) {
return;
}

/* Scenario heading */

setText(
"scenario-title",
scenario.name
);

setText(
"scenario-description",
scenario.description
);

/* Metric values */

setText(
"co2-value",
scenario.co2.toLocaleString()
);

setText(
"reaction-value",
scenario.reaction
);

setText(
"cognitive-value",
scenario.cognitive
);

/* Metric descriptions */

setText(
"co2-status",
scenario.co2Status
);

setText(
"reaction-status",
scenario.reactionStatus
);

setText(
"cognitive-status",
"Comparison state"
);

/* Interpretation */

setText(
"interpretation-title",
scenario.interpretationTitle
);

setText(
"interpretation-text",
scenario.interpretation
);

/* Scenario buttons */

scenarioButtons.forEach(
(button) => {

  const isActive =
    button.dataset.scenario === scenarioKey;

  button.classList.toggle(
    "active",
    isActive
  );

  button.setAttribute(
    "aria-pressed",
    String(isActive)
  );

}

);

}

/* =========================
SCENARIO CONTROLS
========================= */

scenarioButtons.forEach(
(button) => {

button.setAttribute(
  "aria-pressed",
  button.classList.contains("active")
);

button.addEventListener(
  "click",
  () => {

    const scenarioKey =
      button.dataset.scenario;

    updateDashboard(
      scenarioKey
    );

  }
);

}
);

/* =========================
INITIALIZATION
========================= */

function initializeApp() {

/*
Set accessibility state
for the initial section.
*/

sections.forEach(
(section) => {

  section.setAttribute(
    "aria-hidden",
    String(
      !section.classList.contains(
        "active-section"
      )
    )
  );

}

);

navButtons.forEach(
(button) => {

  const isActive =
    button.classList.contains("active");

  button.setAttribute(
    "aria-current",
    isActive ? "page" : "false"
  );

}

);

updateDashboard("baseline");

createCharts();

}

/* =========================
START
========================= */

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
