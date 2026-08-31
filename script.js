/* =========================================================
   SPACE NEUROHEALTH
   FINAL APPLICATION JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DEMONSTRATION DATA
   ========================================================= */

const DEMO_DATA = {

  baseline: {
    name: "ISS Baseline Simulation",

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
      1140,
      1160,
      1180,
      1190,
      1200,
      1210,
      1200
    ],

    performance: [
      244,
      242,
      241,
      240,
      239,
      241,
      240
    ]
  },


  elevated: {
    name: "Elevated CO₂ Simulation",

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
      1500,
      1650,
      1800,
      2050,
      2300,
      2500,
      2700
    ],

    performance: [
      245,
      249,
      252,
      258,
      263,
      269,
      275
    ]
  },


  sleep: {
    name: "Sleep Deprivation Simulation",

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
      1200,
      1210,
      1200,
      1190,
      1200,
      1210,
      1200
    ],

    performance: [
      245,
      252,
      260,
      272,
      285,
      300,
      320
    ]
  }

};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

  activeDataset: {
    name: DEMO_DATA.baseline.name,
    labels: [...DEMO_DATA.baseline.labels],
    environment: [...DEMO_DATA.baseline.environment],
    performance: [...DEMO_DATA.baseline.performance]
  },

  source: "demo",

  environment: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  baselineEnvironment: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  pvt: {
    trials: [],
    falseStarts: 0,
    timer: null,
    started: false,
    waiting: false,
    startTime: null
  }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {

  const element = $(id);

  if (element) {
    element.textContent = value;
  }

}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, decimals = 2) {

  const factor = Math.pow(10, decimals);

  return Math.round(value * factor) / factor;
}

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
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

  const buttons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const targetId = button.dataset.section;

      buttons.forEach(btn => {

        btn.classList.toggle(
          "active",
          btn === button
        );

        btn.setAttribute(
          "aria-selected",
          btn === button ? "true" : "false"
        );

      });


      sections.forEach(section => {

        const isTarget =
          section.id === targetId;

        section.hidden = !isTarget;

        section.classList.toggle(
          "active-section",
          isTarget
        );

      });


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setTimeout(() => {

        resizeCharts();

      }, 100);

    });

  });

}


/* =========================================================
   ENVIRONMENT CONTROLS
   ========================================================= */

function readEnvironmentControls() {

  state.environment.co2 =
    Number($("co2-slider").value);

  state.environment.radiation =
    Number($("radiation-slider").value);

  state.environment.pressure =
    Number($("pressure-slider").value);

  state.environment.temperature =
    Number($("temperature-slider").value);

  state.environment.humidity =
    Number($("humidity-slider").value);

  state.environment.wakefulness =
    Number($("sleep-slider").value);

}


function updateControlLabels() {

  setText(
    "co2-slider-value",
    `${formatNumber(state.environment.co2)} ppm`
  );

  setText(
    "radiation-value",
    state.environment.radiation.toFixed(2)
  );

  setText(
    "pressure-value",
    state.environment.pressure.toFixed(1)
  );

  setText(
    "temperature-value",
    state.environment.temperature.toFixed(1)
  );

  setText(
    "humidity-value",
    formatNumber(state.environment.humidity)
  );

  setText(
    "sleep-value",
    formatNumber(state.environment.wakefulness)
  );

}


function attachEnvironmentListeners() {

  const ids = [
    "co2-slider",
    "radiation-slider",
    "pressure-slider",
    "temperature-slider",
    "humidity-slider",
    "sleep-slider"
  ];

  ids.forEach(id => {

    const input = $(id);

    if (!input) return;

    input.addEventListener("input", () => {

      readEnvironmentControls();

      updateControlLabels();

      updateEnvironmentInterface();

    });

  });

}


/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = {

  baseline: {
    co2: 1200,
    radiation: 1.8,
    pressure: 101.3,
    temperature: 22,
    humidity: 45,
    wakefulness: 2
  },

  elevated: {
    co2: 2200,
    radiation: 3.8,
    pressure: 98.5,
    temperature: 25,
    humidity: 62,
    wakefulness: 8
  },

  high: {
    co2: 3600,
    radiation: 7,
    pressure: 91,
    temperature: 28,
    humidity: 72,
    wakefulness: 16
  }

};


function loadScenario(name) {

  const scenario = SCENARIOS[name];

  if (!scenario) return;

  state.environment = {
    ...scenario
  };

  $("co2-slider").value =
    scenario.co2;

  $("radiation-slider").value =
    scenario.radiation;

  $("pressure-slider").value =
    scenario.pressure;

  $("temperature-slider").value =
    scenario.temperature;

  $("humidity-slider").value =
    scenario.humidity;

  $("sleep-slider").value =
    scenario.wakefulness;


  document
    .querySelectorAll(".scenario-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.scenario === name
      );

    });


  updateControlLabels();
  updateEnvironmentInterface();

}


function initializeScenarios() {

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
   RISK CALCULATIONS
   ========================================================= */

/*
  These functions create bounded demonstration deviations.

  They are NOT clinical thresholds.

  Each result is 0–100.
*/


function co2Risk(value) {

  if (value <= 1200) {
    return clamp(
      ((value - 400) / 800) * 8,
      0,
      8
    );
  }

  if (value <= 2000) {
    return 8 +
      ((value - 1200) / 800) * 35;
  }

  if (value <= 3500) {
    return 43 +
      ((value - 2000) / 1500) * 37;
  }

  return 80 +
    ((value - 3500) / 1500) * 20;
}


function radiationRisk(value) {

  return clamp(
    (value / 10) * 100,
    0,
    100
  );
}


function pressureRisk(value) {

  const ideal = 101.3;

  const deviation =
    Math.abs(value - ideal);

  return clamp(
    deviation * 9,
    0,
    100
  );
}


function temperatureRisk(value) {

  const ideal = 22;

  const deviation =
    Math.abs(value - ideal);

  return clamp(
    deviation * 8,
    0,
    100
  );
}


function humidityRisk(value) {

  const ideal = 45;

  const deviation =
    Math.abs(value - ideal);

  return clamp(
    deviation * 2.5,
    0,
    100
  );
}


function wakefulnessRisk(value) {

  return clamp(
    Math.pow(value / 24, 1.15) * 100,
    0,
    100
  );
}


function calculateRiskProfile() {

  const values = {

    co2:
      round(
        co2Risk(
          state.environment.co2
        )
      ),

    radiation:
      round(
        radiationRisk(
          state.environment.radiation
        )
      ),

    pressure:
      round(
        pressureRisk(
          state.environment.pressure
        )
      ),

    temperature:
      round(
        temperatureRisk(
          state.environment.temperature
        )
      ),

    humidity:
      round(
        humidityRisk(
          state.environment.humidity
        )
      ),

    sleep:
      round(
        wakefulnessRisk(
          state.environment.wakefulness
        )
      )

  };


  /*
    Transparent prototype weighting:

    CO2          30%
    Radiation    20%
    Pressure     10%
    Temperature  15%
    Humidity     10%
    Wakefulness  15%
  */

  const weighted =
    values.co2 * 0.30 +
    values.radiation * 0.20 +
    values.pressure * 0.10 +
    values.temperature * 0.15 +
    values.humidity * 0.10 +
    values.sleep * 0.15;


  return {
    ...values,
    total: round(
      clamp(weighted, 0, 100)
    )
  };

}


/* =========================================================
   RISK INTERPRETATION
   ========================================================= */

function getRiskState(score) {

  if (score < 30) {

    return {
      label: "NOMINAL",
      text: "Nominal",
      className: "safe-text"
    };

  }

  if (score < 60) {

    return {
      label: "CAUTION",
      text: "Caution",
      className: ""
    };

  }

  return {
    label: "ELEVATED",
    text: "Elevated",
    className: ""
  };

}


function updateRiskProfile() {

  const risk =
    calculateRiskProfile();

  /*
    Main environment index
  */

  setText(
    "risk-value",
    formatNumber(risk.total)
  );


  const riskState =
    getRiskState(risk.total);


  setText(
    "risk-status",
    riskState.text
  );


  const riskStatus =
    $("risk-status");

  if (riskStatus) {

    riskStatus.classList.toggle(
      "safe-text",
      risk.total < 30
    );

  }


  /*
    Badge
  */

  setText(
    "risk-badge",
    riskState.label
  );


  /*
    Individual bars
  */

  const mappings = {

    co2: [
      "risk-co2-bar",
      "risk-co2-score"
    ],

    radiation: [
      "risk-radiation-bar",
      "risk-radiation-score"
    ],

    pressure: [
      "risk-pressure-bar",
      "risk-pressure-score"
    ],

    temperature: [
      "risk-temperature-bar",
      "risk-temperature-score"
    ],

    humidity: [
      "risk-humidity-bar",
      "risk-humidity-score"
    ],

    sleep: [
      "risk-sleep-bar",
      "risk-sleep-score"
    ]

  };


  Object.entries(mappings)
    .forEach(([key, ids]) => {

      const bar = $(ids[0]);
      const score = $(ids[1]);

      if (bar) {

        bar.style.width =
          `${clamp(risk[key], 0, 100)}%`;

      }

      if (score) {

        score.textContent =
          formatNumber(risk[key]);

      }

    });

}


/* =========================================================
   PERFORMANCE REFERENCE
   ========================================================= */

function calculatePerformanceReference() {

  const base = 240;

  const co2Effect =
    Math.max(
      0,
      state.environment.co2 - 1200
    ) * 0.018;

  const radiationEffect =
    Math.max(
      0,
      state.environment.radiation - 1.8
    ) * 1.4;

  const pressureEffect =
    Math.abs(
      state.environment.pressure - 101.3
    ) * 1.3;

  const temperatureEffect =
    Math.abs(
      state.environment.temperature - 22
    ) * 1.5;

  const humidityEffect =
    Math.abs(
      state.environment.humidity - 45
    ) * 0.25;

  const sleepEffect =
    state.environment.wakefulness * 1.7;


  const result =
    base +
    co2Effect +
    radiationEffect +
    pressureEffect +
    temperatureEffect +
    humidityEffect +
    sleepEffect;


  return Math.round(result);

}


function updatePerformanceReference() {

  const performance =
    calculatePerformanceReference();

  setText(
    "performance-value",
    formatNumber(performance)
  );


  let status =
    "Demonstration reference";

  if (performance >= 320) {
    status = "Higher simulated RT";
  } else if (performance >= 280) {
    status = "Moderately elevated";
  } else if (performance >= 250) {
    status = "Slightly elevated";
  }

  setText(
    "performance-status",
    status
  );

}


/* =========================================================
   ENVIRONMENT STATUS
   ========================================================= */

function updateEnvironmentStatus() {

  const co2 =
    state.environment.co2;


  let status =
    "Nominal Demonstration";

  if (co2 >= 3500) {

    status =
      "High Demonstration Level";

  } else if (co2 >= 2000) {

    status =
      "Elevated Demonstration Level";

  } else if (co2 > 1200) {

    status =
      "Above Baseline";

  }


  setText(
    "environment-value",
    formatNumber(co2)
  );

  setText(
    "environment-status",
    status
  );


  const element =
    $("environment-status");

  if (element) {

    element.classList.toggle(
      "safe-text",
      co2 <= 1200
    );

  }

}


/* =========================================================
   BASELINE DIFFERENCE
   ========================================================= */

function updateBaselineDifference() {

  const current =
    state.environment.co2;

  const baseline =
    state.baselineEnvironment.co2;


  if (!baseline) return;


  const difference =
    ((current - baseline) /
      baseline) * 100;


  const rounded =
    round(difference, 1);


  const prefix =
    rounded >= 0 ? "+" : "";


  setText(
    "change-value",
    `${prefix}${rounded.toFixed(1)}%`
  );


  let status =
    "No change";

  if (rounded > 0) {

    status =
      "Above baseline";

  } else if (rounded < 0) {

    status =
      "Below baseline";

  }


  setText(
    "change-status",
    status
  );


  setText(
    "baseline-result",
    `${prefix}${rounded.toFixed(1)}%`
  );

}


/* =========================================================
   SCIENTIFIC INTERPRETATION
   ========================================================= */

function updateScienceInterpretation() {

  const risk =
    calculateRiskProfile();

  const title =
    $("science-title");

  const text =
    $("science-text");


  if (!title || !text) return;


  if (risk.total < 30) {

    title.textContent =
      "Baseline environmental condition";

    text.textContent =
      "The current demonstration profile remains within the nominal range of the prototype scoring model. The displayed values are interface references and should not be interpreted as validated physiological predictions.";

  } else if (risk.total < 60) {

    title.textContent =
      "Caution-level demonstration condition";

    text.textContent =
      "Several environmental inputs are contributing to a higher composite demonstration score. This interface highlights the change for exploratory analysis rather than making a clinical or operational prediction.";

  } else {

    title.textContent =
      "Elevated demonstration condition";

    text.textContent =
      "The combined environmental inputs produce a higher prototype index. The result is intended to show how multiple variables can influence an analytical score and does not represent a validated health-risk assessment.";

  }

}


/* =========================================================
   DASHBOARD UPDATE
   ========================================================= */

function updateEnvironmentInterface() {

  updateControlLabels();

  updateEnvironmentStatus();

  updatePerformanceReference();

  updateRiskProfile();

  updateBaselineDifference();

  updateScienceInterpretation();

  updateCharts();

}


/* =========================================================
   DATASET STATISTICS
   ========================================================= */

function calculateMean(values) {

  const valid =
    values.filter(
      Number.isFinite
    );

  if (!valid.length) {
    return NaN;
  }

  return valid.reduce(
    (sum, value) =>
      sum + value,
    0
  ) / valid.length;

}


function calculateMedian(values) {

  const valid =
    values
      .filter(Number.isFinite)
      .sort(
        (a, b) => a - b
      );

  if (!valid.length) {
    return NaN;
  }

  const middle =
    Math.floor(valid.length / 2);

  if (valid.length % 2) {

    return valid[middle];

  }

  return (
    valid[middle - 1] +
    valid[middle]
  ) / 2;

}


function determineTrend(values) {

  const valid =
    values.filter(
      Number.isFinite
    );

  if (valid.length < 2) {
    return "Insufficient data";
  }


  const first =
    valid[0];

  const last =
    valid[valid.length - 1];


  const difference =
    last - first;


  const tolerance =
    Math.max(
      1,
      Math.abs(first) * 0.005
    );


  if (difference > tolerance) {
    return "Increasing";
  }

  if (difference < -tolerance) {
    return "Decreasing";
  }

  return "Stable";

}


function updateStatistics() {

  const values =
    state.activeDataset.environment
      .filter(Number.isFinite);


  const mean =
    calculateMean(values);

  const peak =
    values.length
      ? Math.max(...values)
      : NaN;

  const minimum =
    values.length
      ? Math.min(...values)
      : NaN;


  setText(
    "mean-co2",
    Number.isFinite(mean)
      ? `${formatNumber(mean)} ppm`
      : "--"
  );

  setText(
    "peak-co2",
    Number.isFinite(peak)
      ? `${formatNumber(peak)} ppm`
      : "--"
  );

  setText(
    "min-co2",
    Number.isFinite(minimum)
      ? `${formatNumber(minimum)} ppm`
      : "--"
  );

  setText(
    "data-points",
    values.length
  );


  setText(
    "trend-result",
    determineTrend(values)
  );


  setText(
    "analysis-result",
    state.source === "upload"
      ? "User supplied"
      : "Exploratory"
  );


  setText(
    "statistics-source",
    state.activeDataset.name
  );

}


/* =========================================================
   CORRELATION
   ========================================================= */

function pearsonCorrelation(x, y) {

  if (
    !Array.isArray(x) ||
    !Array.isArray(y) ||
    x.length !== y.length ||
    x.length < 2
  ) {
    return NaN;
  }


  const meanX =
    calculateMean(x);

  const meanY =
    calculateMean(y);


  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;


  for (let i = 0; i < x.length; i++) {

    const dx =
      x[i] - meanX;

    const dy =
      y[i] - meanY;

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


  if (denominator === 0) {
    return NaN;
  }


  return numerator /
    denominator;

}


function calculateLaggedPairs(
  environment,
  performance,
  lag
) {

  const x = [];
  const y = [];


  /*
    Positive lag:
    environmental observation i
    is compared with performance
    observation i + lag.
  */

  const start =
    lag >= 0 ? 0 : -lag;

  const end =
    lag >= 0
      ? Math.min(
          environment.length,
          performance.length - lag
        )
      : Math.min(
          environment.length + lag,
          performance.length
        );


  for (
    let i = start;
    i < end;
    i++
  ) {

    const performanceIndex =
      i + lag;


    const envValue =
      environment[i];

    const perfValue =
      performance[performanceIndex];


    if (
      Number.isFinite(envValue) &&
      Number.isFinite(perfValue)
    ) {

      x.push(envValue);
      y.push(perfValue);

    }

  }


  return {
    x,
    y
  };

}


function interpretCorrelation(r) {

  if (!Number.isFinite(r)) {
    return "Insufficient variation";
  }


  const absolute =
    Math.abs(r);


  let strength;

  if (absolute >= 0.9) {

    strength = "Very strong";

  } else if (absolute >= 0.7) {

    strength = "Strong";

  } else if (absolute >= 0.5) {

    strength = "Moderate";

  } else if (absolute >= 0.3) {

    strength = "Weak";

  } else {

    strength = "Very weak";

  }


  if (r > 0) {

    return `${strength}, positive`;

  }

  if (r < 0) {

    return `${strength}, negative`;

  }

  return "No linear association";

}


function runCorrelationAnalysis() {

  const lag =
    Number(
      $("lag-select").value
    );


  const pairs =
    calculateLaggedPairs(
      state.activeDataset.environment,
      state.activeDataset.performance,
      lag
    );


  const r =
    pearsonCorrelation(
      pairs.x,
      pairs.y
    );


  setText(
    "correlation-value",
    Number.isFinite(r)
      ? r.toFixed(3)
      : "--"
  );


  setText(
    "correlation-lag",
    `${lag} h`
  );


  setText(
    "correlation-n",
    pairs.x.length
  );


  setText(
    "correlation-interpretation",
    interpretCorrelation(r)
  );

}


function initializeCorrelation() {

  const button =
    $("calculate-correlation-btn");

  if (!button) return;


  button.addEventListener(
    "click",
    runCorrelationAnalysis
  );

}


/* =========================================================
   CANVAS CHARTS
   ========================================================= */

function prepareCanvas(canvas) {

  if (!canvas) return null;


  const rect =
    canvas.getBoundingClientRect();

  const width =
    Math.max(
      300,
      rect.width
    );

  const height =
    Math.max(
      220,
      rect.height
    );


  const ratio =
    window.devicePixelRatio || 1;


  canvas.width =
    width * ratio;

  canvas.height =
    height * ratio;


  const ctx =
    canvas.getContext("2d");

  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  return {
    ctx,
    width,
    height
  };

}


function drawChart(
  canvas,
  values,
  labels,
  unit
) {

  if (!canvas) return;


  const prepared =
    prepareCanvas(canvas);

  if (!prepared) return;


  const {
    ctx,
    width,
    height
  } = prepared;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  const valid =
    values.filter(
      Number.isFinite
    );


  if (valid.length < 2) {

    const empty =
      $("environment-chart-empty");

    if (empty) {
      empty.classList.remove(
        "hidden"
      );
    }

    return;
  }


  const empty =
    $("environment-chart-empty");

  if (empty) {
    empty.classList.add(
      "hidden"
    );
  }


  const padding = {
    top: 25,
    right: 20,
    bottom: 42,
    left: 55
  };


  const chartWidth =
    width -
    padding.left -
    padding.right;

  const chartHeight =
    height -
    padding.top -
    padding.bottom;


  let min =
    Math.min(...valid);

  let max =
    Math.max(...valid);


  if (min === max) {

    min -= 1;
    max += 1;

  }


  const range =
    max - min;

  min -= range * 0.12;
  max += range * 0.12;


  /*
    Grid
  */

  ctx.lineWidth = 1;

  ctx.strokeStyle =
    "rgba(255,255,255,0.07)";

  ctx.fillStyle =
    "rgba(143,156,175,0.8)";

  ctx.font =
    "12px system-ui";


  const gridLines = 5;


  for (
    let i = 0;
    i <= gridLines;
    i++
  ) {

    const y =
      padding.top +
      (chartHeight / gridLines) *
      i;


    ctx.beginPath();

    ctx.moveTo(
      padding.left,
      y
    );

    ctx.lineTo(
      width - padding.right,
      y
    );

    ctx.stroke();


    const value =
      max -
      ((max - min) /
        gridLines) *
      i;


    ctx.fillText(
      formatNumber(value),
      8,
      y + 4
    );

  }


  /*
    X labels
  */

  labels.forEach(
    (label, index) => {

      const x =
        padding.left +
        (chartWidth /
          Math.max(1, labels.length - 1)) *
        index;


      if (
        index === 0 ||
        index === labels.length - 1 ||
        labels.length <= 8
      ) {

        ctx.fillText(
          label,
          x - 16,
          height - 15
        );

      }

    }
  );


  /*
    Line
  */

  ctx.beginPath();


  values.forEach(
    (value, index) => {

      if (!Number.isFinite(value)) {
        return;
      }


      const x =
        padding.left +
        (chartWidth /
          Math.max(1, values.length - 1)) *
        index;


      const y =
        padding.top +
        (
          (max - value) /
          (max - min)
        ) *
        chartHeight;


      if (index === 0) {

        ctx.moveTo(
          x,
          y
        );

      } else {

        ctx.lineTo(
          x,
          y
        );

      }

    }
  );


  ctx.strokeStyle =
    "#51d7e8";

  ctx.lineWidth = 3;

  ctx.stroke();


  /*
    Points
  */

  values.forEach(
    (value, index) => {

      if (!Number.isFinite(value)) {
        return;
      }


      const x =
        padding.left +
        (chartWidth /
          Math.max(1, values.length - 1)) *
        index;


      const y =
        padding.top +
        (
          (max - value) /
          (max - min)
        ) *
        chartHeight;


      ctx.beginPath();

      ctx.arc(
        x,
        y,
        4,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        "#51d7e8";

      ctx.fill();

    }
  );


  /*
    Unit
  */

  ctx.fillStyle =
    "rgba(143,156,175,0.9)";

  ctx.font =
    "11px system-ui";

  ctx.fillText(
    unit,
    padding.left,
    15
  );

}


function updateCharts() {

  drawChart(
    $("environmentChart"),
    state.activeDataset.environment,
    state.activeDataset.labels,
    "CO₂ • ppm"
  );


  drawChart(
    $("performanceChart"),
    state.activeDataset.performance,
    state.activeDataset.labels,
    "Reaction time • ms"
  );

}


function resizeCharts() {

  updateCharts();

}


/* =========================================================
   DEMO DATASETS
   ========================================================= */

function loadDemoDataset(type) {

  const dataset =
    DEMO_DATA[type];

  if (!dataset) return;


  state.activeDataset = {

    name:
      dataset.name,

    labels:
      [...dataset.labels],

    environment:
      [...dataset.environment],

    performance:
      [...dataset.performance]

  };


  state.source = "demo";


  /*
    Restore demonstration environment
    to the scenario corresponding to
    the selected dataset.
  */

  if (type === "baseline") {

    loadScenario("baseline");

  } else if (type === "elevated") {

    loadScenario("elevated");

  } else if (type === "sleep") {

    loadScenario("baseline");

    /*
      Sleep profile keeps environment
      baseline while performance changes.
    */

    state.environment.wakefulness = 12;

    $("sleep-slider").value = 12;

    updateEnvironmentInterface();

  }


  setText(
    "library-status",
    `${dataset.name} loaded successfully.`
  );


  updateDatasetMetadata();

  updateStatistics();

  runCorrelationAnalysis();

  updateCharts();

}


function initializeDemoLibrary() {

  const button =
    $("load-demo-btn");


  button.addEventListener(
    "click",
    () => {

      loadDemoDataset(
        $("dataset-library").value
      );

    }
  );

}


/* =========================================================
   CSV PARSING
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

    const char =
      line[i];


    if (char === '"') {

      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {

        current += '"';
        i++;

      } else {

        insideQuotes =
          !insideQuotes;

      }

    } else if (
      char === "," &&
      !insideQuotes
    ) {

      result.push(
        current.trim()
      );

      current = "";

    } else {

      current += char;

    }

  }


  result.push(
    current.trim()
  );


  return result;
}


function parseCSV(text) {

  const lines =
    text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);


  if (lines.length < 2) {

    throw new Error(
      "The CSV file does not contain enough rows."
    );

  }


  const headers =
    splitCSVLine(
      lines[0]
    ).map(
      header =>
        header
          .replace(/^"|"$/g, "")
          .trim()
          .toLowerCase()
    );


  const co2Candidates = [
    "co2",
    "co₂",
    "carbon_dioxide",
    "carbon dioxide",
    "environment",
    "environmental_co2",
    "co2_ppm"
  ];


  let co2Index =
    headers.findIndex(
      header =>
        co2Candidates.includes(
          header
        )
    );


  if (co2Index === -1) {

    co2Index =
      headers.findIndex(
        header =>
          header.includes("co2")
      );

  }


  if (co2Index === -1) {

    throw new Error(
      "No CO₂ column was found. Use a column such as co2, CO2, environment, or co2_ppm."
    );

  }


  const timeCandidates = [
    "time",
    "timestamp",
    "date",
    "datetime",
    "label",
    "labels"
  ];


  let timeIndex =
    headers.findIndex(
      header =>
        timeCandidates.includes(
          header
        )
    );


  const performanceCandidates = [
    "performance",
    "reaction_time",
    "reaction time",
    "rt",
    "reaction_ms",
    "cognitive_performance"
  ];


  let performanceIndex =
    headers.findIndex(
      header =>
        performanceCandidates.includes(
          header
        )
    );


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
      timeIndex >= 0 &&
      cells[timeIndex]
        ? cells[timeIndex]
        : `Row ${i}`;


    const perf =
      performanceIndex >= 0
        ? Number(
            cells[performanceIndex]
          )
        : NaN;


    labels.push(label);

    environment.push(co2);

    performance.push(perf);

  }


  if (!environment.length) {

    throw new Error(
      "No valid numerical CO₂ values were found."
    );

  }


  /*
    If performance is missing,
    create an empty series rather than
    pretending the data exist.
  */

  return {

    labels,

    environment,

    performance,

    co2Column:
      headers[co2Index],

    timeColumn:
      timeIndex >= 0
        ? headers[timeIndex]
        : "Generated row labels",

    performanceColumn:
      performanceIndex >= 0
        ? headers[performanceIndex]
        : "Not supplied"

  };

}


/* =========================================================
   CSV IMPORT
   ========================================================= */

function handleCSVFile(file) {

  if (!file) return;


  if (
    !file.name
      .toLowerCase()
      .endsWith(".csv")
  ) {

    setText(
      "file-status-msg",
      "Please select a CSV file."
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload = () => {

    try {

      const parsed =
        parseCSV(
          reader.result
        );


      state.activeDataset = {

        name:
          file.name,

        labels:
          parsed.labels,

        environment:
          parsed.environment,

        performance:
          parsed.performance

      };


      state.source = "upload";


      setText(
        "file-status-msg",
        `Loaded ${file.name} successfully.`
      );


      $("clear-csv-btn").disabled =
        false;


      setText(
        "dataset-badge",
        "USER DATA"
      );


      setText(
        "dataset-validation",
        "Valid CO₂ values detected"
      );


      $("dataset-validation")
        .classList.add(
          "safe-text"
        );


      setText(
        "dataset-name",
        file.name
      );


      setText(
        "dataset-rows",
        parsed.environment.length
      );


      setText(
        "dataset-co2-column",
        parsed.co2Column
      );


      setText(
        "dataset-time-column",
        parsed.timeColumn
      );


      updateStatistics();

      updateCharts();

      runCorrelationAnalysis();


    } catch (error) {

      setText(
        "file-status-msg",
        error.message
      );

    }

  };


  reader.onerror = () => {

    setText(
      "file-status-msg",
      "The file could not be read."
    );

  };


  reader.readAsText(file);

}


function initializeCSVUpload() {

  const input =
    $("csv-file-input");

  const browse =
    $("browse-csv-btn");

  const dropZone =
    $("drop-zone");


  browse.addEventListener(
    "click",
    () => input.click()
  );


  input.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      handleCSVFile(file);

    }
  );


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
        event.dataTransfer.files[0];

      handleCSVFile(file);

    }
  );

}


/* =========================================================
   DATA METADATA
   ========================================================= */

function updateDatasetMetadata() {

  setText(
    "dataset-name",
    state.activeDataset.name
  );


  setText(
    "dataset-rows",
    state.activeDataset.environment.length
  );


  if (
    state.source === "demo"
  ) {

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

  }

}


/* =========================================================
   CLEAR USER DATASET
   ========================================================= */

function clearDataset() {

  state.activeDataset = {

    name:
      DEMO_DATA.baseline.name,

    labels:
      [...DEMO_DATA.baseline.labels],

    environment:
      [...DEMO_DATA.baseline.environment],

    performance:
      [...DEMO_DATA.baseline.performance]

  };


  state.source = "demo";


  $("csv-file-input").value = "";

  $("clear-csv-btn").disabled =
    true;


  setText(
    "file-status-msg",
    "Demonstration dataset active."
  );


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
    7
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


  $("dataset-validation")
    .classList.add(
      "safe-text"
    );


  updateStatistics();

  runCorrelationAnalysis();

  updateCharts();

}


function initializeClearDataset() {

  $("clear-csv-btn")
    .addEventListener(
      "click",
      clearDataset
    );

}


/* =========================================================
   CSV TEMPLATE
   ========================================================= */

function downloadCSVTemplate() {

  const csv =
`time,co2,performance
T-6h,1140,244
T-5h,1160,242
T-4h,1180,241
T-3h,1190,240
T-2h,1200,239
T-1h,1210,241
Current,1200,240
`;


  const blob =
    new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "space-neurohealth-template.csv";


  document.body.appendChild(
    link
  );

  link.click();

  link.remove();


  URL.revokeObjectURL(url);

}


function initializeTemplateDownload() {

  $("download-template-btn")
    .addEventListener(
      "click",
      downloadCSVTemplate
    );

}


/* =========================================================
   PVT
   ========================================================= */

function clearPVTTimer() {

  if (
    state.pvt.timer !== null
  ) {

    clearTimeout(
      state.pvt.timer
    );

    state.pvt.timer = null;

  }

}


function setPVTMessage(
  message,
  className = ""
) {

  const box =
    $("pvt-box");


  if (!box) return;


  box.textContent =
    message;


  box.classList.remove(
    "ready",
    "false-start"
  );


  if (className) {

    box.classList.add(
      className
    );

  }

}


function startPVTTrial() {

  clearPVTTimer();


  state.pvt.waiting =
    true;

  state.pvt.started =
    true;


  setPVTMessage(
    "Wait...",
    ""
  );


  const delay =
    1800 +
    Math.random() * 4200;


  state.pvt.timer =
    setTimeout(
      () => {

        state.pvt.waiting =
          false;

        state.pvt.startTime =
          performance.now();


        setPVTMessage(
          "RESPOND",
          "ready"
        );

      },
      delay
    );

}


function recordPVTResponse() {

  if (
    !state.pvt.started
  ) {
    return;
  }


  /*
    Response before the stimulus
    counts as a false start.
  */

  if (
    state.pvt.waiting
  ) {

    state.pvt.falseStarts++;

    clearPVTTimer();


    setPVTMessage(
      "Too early. Press Start Trial again.",
      "false-start"
    );


    updatePVTDisplay();

    return;

  }


  if (
    !state.pvt.startTime
  ) {
    return;
  }


  const reactionTime =
    performance.now() -
    state.pvt.startTime;


  state.pvt.trials.push(
    reactionTime
  );


  state.pvt.startTime =
    null;


  setPVTMessage(
    "Recorded. Press Start Trial for another trial."
  );


  updatePVTDisplay();

}


function updatePVTDisplay() {

  const trials =
    state.pvt.trials;


  const count =
    trials.length;


  setText(
    "pvt-trials",
    count
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
      "pvt-rrt",
      "--"
    );

    setText(
      "pvt-best",
      "-- ms"
    );

    setText(
      "pvt-lapses",
      state.pvt.falseStarts
    );

    setText(
      "pvt-false-starts",
      state.pvt.falseStarts
    );

    setText(
      "pvt-median",
      "-- ms"
    );

    return;

  }


  const last =
    trials[trials.length - 1];


  const average =
    calculateMean(trials);


  const best =
    Math.min(...trials);


  const median =
    calculateMedian(
      [...trials]
    );


  const meanRRT =
    calculateMean(
      trials.map(
        rt => 1000 / rt
      )
    );


  const lapses =
    trials.filter(
      rt => rt >= 500
    ).length;


  setText(
    "pvt-score",
    `${Math.round(last)} ms`
  );


  setText(
    "pvt-average",
    `${Math.round(average)} ms`
  );


  setText(
    "pvt-rrt",
    Number.isFinite(meanRRT)
      ? meanRRT.toFixed(3)
      : "--"
  );


  setText(
    "pvt-best",
    `${Math.round(best)} ms`
  );


  setText(
    "pvt-lapses",
    lapses
  );


  setText(
    "pvt-false-starts",
    state.pvt.falseStarts
  );


  setText(
    "pvt-median",
    `${Math.round(median)} ms`
  );

}


function startPVT() {

  clearPVTTimer();


  state.pvt.started =
    true;

  state.pvt.waiting =
    true;

  state.pvt.startTime =
    null;


  startPVTTrial();

}


function resetPVT() {

  clearPVTTimer();


  state.pvt = {

    trials: [],

    falseStarts: 0,

    timer: null,

    started: false,

    waiting: false,

    startTime: null

  };


  setPVTMessage(
    "Press Start Test"
  );


  updatePVTDisplay();

}


function initializePVT() {

  $("pvt-start-btn")
    .addEventListener(
      "click",
      startPVT
    );


  $("pvt-reset-btn")
    .addEventListener(
      "click",
      resetPVT
    );


  $("pvt-box")
    .addEventListener(
      "click",
      recordPVTResponse
    );


  $("pvt-box")
    .addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          recordPVTResponse();

        }

      }
    );

}


/* =========================================================
   EXPORT / PRINT
   ========================================================= */

function exportProjectSummary() {

  /*
    Make sure current values are calculated
    before opening print.
  */

  updateEnvironmentInterface();

  updateStatistics();

  runCorrelationAnalysis();


  setTimeout(
    () => {

      window.print();

    },
    100
  );

}


function initializeExport() {

  $("export-btn")
    .addEventListener(
      "click",
      exportProjectSummary
    );

}


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

let resizeTimeout = null;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimeout
    );


    resizeTimeout =
      setTimeout(
        resizeCharts,
        150
      );

  }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApplication() {

  initializeNavigation();

  initializeScenarios();

  attachEnvironmentListeners();

  initializeDemoLibrary();

  initializeCorrelation();

  initializeCSVUpload();

  initializeClearDataset();

  initializeTemplateDownload();

  initializePVT();

  initializeExport();


  /*
    Initial interface state
  */

  loadScenario(
    "baseline"
  );


  updateDatasetMetadata();

  updateStatistics();

  runCorrelationAnalysis();

  updatePVTDisplay();

  updateCharts();

}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
  );

} else {

  initializeApplication();

}
