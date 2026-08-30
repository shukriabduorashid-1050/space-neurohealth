<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Space NeuroHealth research and visualization prototype">
  <title>Space NeuroHealth</title>  <link rel="stylesheet" href="style.css">
</head><body>  <div class="app"><!-- HEADER -->

<header class="hero">

  <div class="mission-badge">
    NASA SPACE APPS • RESEARCH PROTOTYPE
  </div>

  <h1>🧠 Space NeuroHealth</h1>

  <p class="subtitle">
    Exploring the relationship between space-environment conditions
    and human cognitive performance
  </p>

  <div class="status-row">
    <span class="status-dot" aria-hidden="true"></span>
    <span>Prototype active</span>
    <span class="separator">•</span>
    <span class="demo-label">DEMONSTRATION DATA</span>
  </div>

</header>


<!-- NAVIGATION -->

<nav class="navigation" aria-label="Main navigation">

  <button
    type="button"
    class="nav-btn active"
    data-section="dashboard"
    aria-selected="true"
  >
    Dashboard
  </button>

  <button
    type="button"
    class="nav-btn"
    data-section="data"
    aria-selected="false"
  >
    NASA Data
  </button>

  <button
    type="button"
    class="nav-btn"
    data-section="analysis"
    aria-selected="false"
  >
    Analysis
  </button>

  <button
    type="button"
    class="nav-btn"
    data-section="about"
    aria-selected="false"
  >
    Scientific Context
  </button>

</nav>


<!-- =====================================================
     DASHBOARD
     ===================================================== -->

<main id="dashboard" class="section active-section">

  <div class="section-heading">

    <div>
      <span class="eyebrow">LIVE PROTOTYPE VIEW</span>
      <h2>Environmental &amp; Performance Explorer</h2>
    </div>

    <span class="data-status">
      DEMONSTRATION DATA
    </span>

  </div>


  <!-- SCENARIOS -->

  <div
    class="scenario-container"
    role="group"
    aria-label="Exposure scenarios"
  >

    <button
      type="button"
      class="scenario-btn active"
      data-scenario="baseline"
      aria-pressed="true"
    >
      <span class="scenario-dot safe" aria-hidden="true"></span>
      Baseline
    </button>

    <button
      type="button"
      class="scenario-btn"
      data-scenario="elevated"
      aria-pressed="false"
    >
      <span class="scenario-dot warning" aria-hidden="true"></span>
      Elevated
    </button>

    <button
      type="button"
      class="scenario-btn"
      data-scenario="high"
      aria-pressed="false"
    >
      <span class="scenario-dot danger" aria-hidden="true"></span>
      High Exposure
    </button>

  </div>


  <!-- METRICS -->

  <div class="metric-grid">

    <div class="metric-card">

      <div class="metric-header">
        <span class="metric-icon" aria-hidden="true">🌫️</span>

        <span class="metric-label">
          Environmental Measurement
        </span>
      </div>

      <div
        id="environment-value"
        class="metric-value"
      >
        1,200
      </div>

      <div
        id="environment-unit"
        class="metric-unit"
      >
        ppm CO₂
      </div>

      <div
        id="environment-status"
        class="metric-status safe-text"
      >
        Baseline condition
      </div>

    </div>


    <div class="metric-card">

      <div class="metric-header">
        <span class="metric-icon" aria-hidden="true">🧠</span>

        <span class="metric-label">
          Performance Indicator
        </span>
      </div>

      <div
        id="performance-value"
        class="metric-value"
      >
        240
      </div>

      <div class="metric-unit">
        ms reaction time*
      </div>

      <div
        id="performance-status"
        class="metric-status"
      >
        Reference indicator
      </div>

    </div>


    <div class="metric-card">

      <div class="metric-header">
        <span class="metric-icon" aria-hidden="true">📊</span>

        <span class="metric-label">
          Change From Baseline
        </span>
      </div>

      <div
        id="change-value"
        class="metric-value safe-text"
      >
        0%
      </div>

      <div class="metric-unit">
        relative change
      </div>

      <div
        id="change-status"
        class="metric-status safe-text"
      >
        No change
      </div>

    </div>

  </div>


  <!-- ENVIRONMENT CHART -->

  <div class="chart-card">

    <div class="chart-header">

      <div>
        <span class="eyebrow">
          TIME SERIES
        </span>

        <h3>
          Environmental Measurement
        </h3>
      </div>

      <span
        class="chart-unit"
        id="chart-unit"
      >
        ppm
      </span>

    </div>

    <div class="chart-container">
      <canvas
        id="environmentChart"
        aria-label="Environmental measurement over time"
      ></canvas>
    </div>

  </div>


  <!-- PERFORMANCE CHART -->

  <div class="chart-card">

    <div class="chart-header">

      <div>
        <span class="eyebrow">
          PERFORMANCE INDICATOR
        </span>

        <h3>
          Human Performance Reference
        </h3>

      </div>

      <span class="chart-unit">
        ms
      </span>

    </div>

    <div class="chart-container">
      <canvas
        id="performanceChart"
        aria-label="Human performance reference over time"
      ></canvas>
    </div>

    <p class="chart-disclaimer">
      * Demonstration performance values are placeholders.
      They do not represent individual astronaut measurements
      and do not establish a causal relationship with CO₂.
    </p>

  </div>


  <!-- SCIENTIFIC INTERPRETATION -->

  <div class="science-card">

    <div class="science-icon" aria-hidden="true">
      🔬
    </div>

    <div>

      <span class="eyebrow">
        SCIENTIFIC INTERPRETATION
      </span>

      <h3 id="science-title">
        Baseline environmental condition
      </h3>

      <p id="science-text">
        This demonstration shows an environmental measurement
        that can be monitored over time. The value can later
        be replaced with a verified NASA dataset and analyzed
        alongside an appropriate human-performance indicator.
      </p>

    </div>

  </div>


  <!-- LIMITATIONS -->

  <div class="limitation-card">

    <div class="limitation-title">
      <span aria-hidden="true">⚠️</span>
      Prototype limitations
    </div>

    <ul>

      <li>
        This prototype is not a medical diagnostic tool.
      </li>

      <li>
        Demonstration values are not presented as NASA measurements.
      </li>

      <li>
        Correlation does not establish causation.
      </li>

      <li>
        Final analysis will use verified NASA data and
        documented scientific sources.
      </li>

    </ul>

  </div>

</main>


<!-- =====================================================
     NASA DATA
     ===================================================== -->

<section id="data" class="section">

  <div class="section-heading">

    <div>
      <span class="eyebrow">
        DATA PIPELINE
      </span>

      <h2>
        NASA Data
      </h2>
    </div>

    <span class="data-status">
      SOURCE PENDING
    </span>

  </div>


  <!-- DATA PIPELINE -->

  <div class="pipeline">

    <div class="pipeline-step">

      <span>01</span>

      <strong>
        NASA Data
      </strong>

      <p>
        Verified scientific dataset
      </p>

    </div>


    <div class="pipeline-arrow" aria-hidden="true">
      →
    </div>


    <div class="pipeline-step">

      <span>02</span>

      <strong>
        Processing
      </strong>

      <p>
        Clean and organize measurements
      </p>

    </div>


    <div class="pipeline-arrow" aria-hidden="true">
      →
    </div>


    <div class="pipeline-step">

      <span>03</span>

      <strong>
        Analysis
      </strong>

      <p>
        Compare measurements over time
      </p>

    </div>


    <div class="pipeline-arrow" aria-hidden="true">
      →
    </div>


    <div class="pipeline-step">

      <span>04</span>

      <strong>
        Visualization
      </strong>

      <p>
        Present results clearly
      </p>

    </div>

  </div>


  <!-- DATA INFORMATION -->

  <div class="data-card">

    <div class="data-card-header">

      <div>

        <span class="eyebrow">
          CURRENT PROTOTYPE
        </span>

        <h3>
          Dataset Information
        </h3>

      </div>

      <span class="demo-pill">
        DEMO
      </span>

    </div>


    <div class="data-table">

      <div class="data-row">

        <span>
          Data source
        </span>

        <strong>
          NASA dataset — to be selected
        </strong>

      </div>


      <div class="data-row">

        <span>
          Measurement
        </span>

        <strong>
          Environmental condition
        </strong>

      </div>


      <div class="data-row">

        <span>
          Unit
        </span>

        <strong>
          ppm CO₂ — prototype example
        </strong>

      </div>


      <div class="data-row">

        <span>
          Time resolution
        </span>

        <strong>
          Demonstration hourly values
        </strong>

      </div>


      <div class="data-row">

        <span>
          Data status
        </span>

        <strong class="warning-text">
          Placeholder
        </strong>

      </div>

    </div>

  </div>


  <!-- DATA QUESTIONS -->

  <div class="info-card">

    <h3>
      What the final dataset must answer
    </h3>

    <div class="question-grid">

      <div>
        <span>?</span>
        <p>
          What does the measurement represent?
        </p>
      </div>

      <div>
        <span>?</span>
        <p>
          What are the units?
        </p>
      </div>

      <div>
        <span>?</span>
        <p>
          Where did the data come from?
        </p>
      </div>

      <div>
        <span>?</span>
        <p>
          What can the data actually tell us?
        </p>
      </div>

    </div>

  </div>

</section>


<!-- =====================================================
     ANALYSIS
     ===================================================== -->

<section id="analysis" class="section">

  <div class="section-heading">

    <div>

      <span class="eyebrow">
        DATA SCIENCE
      </span>

      <h2>
        Analysis
      </h2>

    </div>

  </div>


  <div class="analysis-grid">

    <div class="analysis-card">

      <span class="analysis-icon" aria-hidden="true">
        📈
      </span>

      <h3>
        Trend
      </h3>

      <div id="trend-result">
        Stable
      </div>

      <p>
        Describes how the environmental measurement
        changes across the displayed time period.
      </p>

    </div>


    <div class="analysis-card">

      <span class="analysis-icon" aria-hidden="true">
        Δ
      </span>

      <h3>
        Baseline Difference
      </h3>

      <div id="baseline-result">
        0%
      </div>

      <p>
        Shows the relative difference between the current
        value and the prototype baseline.
      </p>

    </div>


    <div class="analysis-card">

      <span class="analysis-icon" aria-hidden="true">
        🔎
      </span>

      <h3>
        Interpretation
      </h3>

      <div id="analysis-result">
        Exploratory
      </div>

      <p>
        The prototype describes patterns but does not
        claim medical causation.
      </p>

    </div>

  </div>


  <!-- METHOD -->

  <div class="method-card">

    <span class="eyebrow">
      METHOD
    </span>

    <h3>
      How the analysis works
    </h3>

    <div class="method-flow">

      <div>
        <span>1</span>
        <p>Collect</p>
      </div>

      <div class="method-line"></div>

      <div>
        <span>2</span>
        <p>Clean</p>
      </div>

      <div class="method-line"></div>

      <div>
        <span>3</span>
        <p>Compare</p>
      </div>

      <div class="method-line"></div>

      <div>
        <span>4</span>
        <p>Visualize</p>
      </div>

      <div class="method-line"></div>

      <div>
        <span>5</span>
        <p>Interpret</p>
      </div>

    </div>

  </div>

</section>


<!-- =====================================================
     SCIENTIFIC CONTEXT
     ===================================================== -->

<section id="about" class="section">

  <div class="section-heading">

    <div>

      <span class="eyebrow">
        KEY SCIENTIFIC CONTEXT
      </span>

      <h2>
        Why CO₂ and Cognitive Performance?
      </h2>

    </div>

  </div>


  <!-- PROJECT INTRODUCTION -->

  <div class="about-card">

    <div class="about-icon" aria-hidden="true">
      🧠
    </div>

    <div>

      <h3>
        The Space NeuroHealth idea
      </h3>

      <p>
        Space NeuroHealth is a research and monitoring prototype
        designed to explore how space-environment conditions may
        relate to human cognitive and neurological performance.
      </p>

      <p>
        The application combines NASA data, scientific analysis,
        data visualization, and web development in one accessible
        interface.
      </p>

    </div>

  </div>


  <!-- SCIENTIFIC CONTEXT CARDS -->

  <div class="science-context">


    <!-- CO2 -->

    <div class="context-card">

      <div class="context-icon" aria-hidden="true">
        🌍
      </div>

      <h3>
        The Environmental Driver
      </h3>

      <p>
        Atmospheric CO₂ on Earth is roughly
        <strong>400+ ppm</strong>. Spacecraft have a different
        atmospheric environment because astronauts continuously
        produce CO₂ and spacecraft depend on environmental control
        and life-support systems to remove it.
      </p>

      <p>
        NASA has identified elevated spacecraft CO₂ as a
        potential human-health and performance concern.
      </p>

    </div>


    <!-- PVT -->

    <div class="context-card">

      <div class="context-icon" aria-hidden="true">
        🧠
      </div>

      <h3>
        The Cognitive Metric
      </h3>

      <p>
        The
        <strong>Psychomotor Vigilance Task (PVT)</strong>
        is a reaction-time test used to evaluate sustained
        attention and alertness.
      </p>

      <p>
        NASA research uses PVT-based measures of reaction time
        and lapses. A response slower than
        <strong>500 ms</strong> is commonly classified as a
        PVT lapse.
      </p>

    </div>


    <!-- RESEARCH -->

    <div class="context-card">

      <div class="context-icon" aria-hidden="true">
        🔬
      </div>

      <h3>
        Supporting Research
      </h3>

      <p>
        Ground-based research by
        <strong>Satish et al. (2012)</strong>
        reported changes in several decision-making measures
        during controlled exposure to 1,000 and 2,500 ppm CO₂.
      </p>

      <p>
        These findings provide scientific motivation for
        investigating CO₂ and cognitive performance, but they
        do not prove a causal relationship in astronauts.
      </p>

    </div>

  </div>


  <!-- RESEARCH GAP -->

  <div class="research-gap">

    <span class="eyebrow">
      RESEARCH QUESTION
    </span>

    <h3>
      What is the relationship between spacecraft CO₂ exposure
      and human performance?
    </h3>

    <p>
      NASA research has investigated elevated CO₂ as a potential
      contributor to performance and physiological effects during
      spaceflight. Space NeuroHealth explores how environmental
      measurements could be visualized alongside appropriate
      human-performance indicators to help identify patterns
      that deserve further investigation.
    </p>

  </div>


  <!-- PROJECT AREAS -->

  <div class="about-grid">

    <div class="about-small-card">

      <span aria-hidden="true">🧬</span>

      <h3>
        Neuroscience
      </h3>

      <p>
        Exploring human cognition and neurological performance.
      </p>

    </div>


    <div class="about-small-card">

      <span aria-hidden="true">⚙️</span>

      <h3>
        Engineering
      </h3>

      <p>
        Turning scientific measurements into a useful interface.
      </p>

    </div>


    <div class="about-small-card">

      <span aria-hidden="true">📊</span>

      <h3>
        Data Science
      </h3>

      <p>
        Processing and visualizing scientific measurements.
      </p>

    </div>


    <div class="about-small-card">

      <span aria-hidden="true">🚀</span>

      <h3>
        Space Medicine
      </h3>

      <p>
        Investigating environmental factors relevant to
        astronaut health.
      </p>

    </div>

  </div>


  <!-- FUTURE -->

  <div class="future-card">

    <span class="eyebrow">
      FUTURE DEVELOPMENT
    </span>

    <h3>
      From prototype to research tool
    </h3>

    <p>
      Future versions could incorporate additional verified
      datasets, automated data processing, more physiological
      indicators, statistical analysis, and mission-specific
      monitoring.
    </p>

  </div>


  <!-- SCIENTIFIC SCOPE -->

  <div class="source-note">

    <strong>
      Scientific scope:
    </strong>

    This application is a research and visualization prototype.
    It does not diagnose neurological conditions and does not
    claim that CO₂ exposure directly causes a specific cognitive
    outcome. Final conclusions will depend on verified NASA
    datasets, documented measurement methods, and appropriate
    statistical analysis.

  </div>

</section>


<!-- FOOTER -->

<footer>

  <div>

    <strong>
      🧠 Space NeuroHealth
    </strong>

    <span>
      NASA Space Apps Challenge Prototype
    </span>

  </div>

  <div class="footer-note">
    Research prototype • Not a medical device
  </div>

</footer>

  </div>  <!-- =====================================================
       CHART.JS
       ===================================================== -->  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>  <!-- =====================================================
       SPACE NEUROHEALTH JAVASCRIPT
       ===================================================== -->  <script src="script.js"></script></body>
</html>
