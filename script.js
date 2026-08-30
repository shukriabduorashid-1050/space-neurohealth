/* =========================================================
   SPACE NEUROHEALTH
   NASA SPACE APPS CHALLENGE PROTOTYPE

   IMPORTANT:
   The values below are DEMONSTRATION DATA.

   They are NOT presented as actual NASA measurements.

   Replace them with verified NASA data after selecting
   the official challenge dataset.
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
   GLOBAL CHART VARIABLES
   ========================================================= */

let environmentChart;

let performanceChart;


/* =========================================================
   CHART SETTINGS
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
    return;
  }


  /* -----------------------------------------
     ENVIRONMENT
     ----------------------------------------- */

  const environmentValue =
    document.getElementById(
      "environment-value"
    );

  environmentValue.textContent =
    selected.environment.toLocaleString();


  document.getElementById(
    "environment-unit"
  ).textContent =
    selected.unit;


  const environmentStatus =
    document.getElementById(
      "environment-status"
    );

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


  /* -----------------------------------------
     PERFORMANCE
     ----------------------------------------- */

  document.getElementById(
    "performance-value"
  ).textContent =
    selected.performance;


  document.getElementById(
    "performance-status"
  ).textContent =
    selected.performanceStatus;


  /* -----------------------------------------
     CHANGE
     ----------------------------------------- */

  document.getElementById(
    "change-value"
  ).textContent =
    selected.change === 0
      ? "0%"
      : "+" + selected.change + "%";


  const changeStatus =
    document.getElementById(
      "change-status"
    );

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


  /* -----------------------------------------
     SCIENTIFIC INTERPRETATION
     ----------------------------------------- */

  document.getElementById(
    "science-title"
  ).textContent =
    selected.noteTitle;


  document.getElementById(
    "science-text"
  ).textContent =
    selected.note;


  /* -----------------------------------------
     ANALYSIS
     ----------------------------------------- */

  document.getElementById(
    "trend-result"
  ).textContent =
    selected.trend;


  document.getElementById(
    "baseline-result"
  ).textContent =
    selected.change === 0
      ? "0%"
      : "+" + selected.change + "%";


  document.getElementById(
    "analysis-result"
  ).textContent =
    "Exploratory";


  /* -----------------------------------------
     UPDATE ENVIRONMENT CHART
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
     UPDATE PERFORMANCE CHART
     ----------------------------------------- */

  if (performanceChart) {

    performanceChart.data.labels =
      data.labels;

    performanceChart.data.datasets[0].data =
      data.performance;

    performanceChart.update();

  }


  /* -----------------------------------------
     UPDATE ACTIVE SCENARIO
     ----------------------------------------- */

  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.classList.remove(
        "active"
      );


      if (
        button.dataset.scenario === type
      ) {

        button.classList.add(
          "active"
        );

      }

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
    `rgba(${r}, ${g}, ${b}, ${alpha})`
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


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      function() {

        const target =
          this.dataset.section;


        buttons.forEach(btn => {

          btn.classList.remove(
            "active"
          );

        });


        sections.forEach(section => {

          section.classList.remove(
            "active-section"
          );

        });


        this.classList.add(
          "active"
        );


        const targetSection =
          document.getElementById(
            target
          );


        if (targetSection) {

          targetSection.classList.add(
            "active-section"
          );

        }

      }

    );

  });

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
      function() {

        const scenario =
          this.dataset.scenario;

        loadScenario(
          scenario
        );

      }

    );

  });

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

  createEnvironmentChart();

  createPerformanceChart();

  setupNavigation();

  setupScenarioButtons();

  loadScenario(
    "baseline"
  );

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

}

else {

  initializeApp();

      }
