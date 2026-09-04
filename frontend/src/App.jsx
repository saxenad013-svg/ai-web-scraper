import { useEffect, useState } from "react";
import "./App.css";

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage({ onStart }) {
  return (
    <div className="landing-page">

      {/* BACKGROUND */}
      <div className="cyber-grid"></div>

      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <div className="ambient ambient-three"></div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="landing-nav">

        <div className="nav-brand">
          <span className="nav-field">FIELD</span>
          <span className="nav-glass">GLASS</span>
        </div>

        <div className="nav-links">

          <a href="#platform">
            Platform
          </a>

          <a href="#features">
            Features
          </a>

          <button
            className="nav-launch"
            onClick={onStart}
          >
            Launch App <span>→</span>
          </button>

        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <main className="hero">

        <div className="hero-status">

          <span className="hero-status-dot"></span>

          AI SCRAPER ONLINE

        </div>


        <h1 className="hero-logo">

          <span className="logo-field">
            Field
          </span>

          <span
            className="logo-glass"
            data-text="glass"
          >
            glass
          </span>

        </h1>


        <p className="hero-description">
          AI-powered web data extraction built for turning
          complex websites into clean, useful information.
        </p>


        <div className="hero-actions">

          <button
            className="primary-button"
            onClick={onStart}
          >
            Start Scraping
            <span>→</span>
          </button>

          <a
            href="#platform"
            className="secondary-button"
          >
            Explore Platform
          </a>

        </div>

      </main>


      {/* =====================================================
          PLATFORM PREVIEW
      ===================================================== */}

      <section
        id="platform"
        className="platform-section"
      >

        <div className="section-label">

          <span>
            01
          </span>

          PLATFORM

        </div>


        <div className="platform-window">

          {/* WINDOW HEADER */}

          <div className="window-top">

            <div className="window-dots">

              <span></span>
              <span></span>
              <span></span>

            </div>

            <div className="window-title">
              FIELDGLASS / SCRAPER
            </div>

            <div className="window-status">

              <span></span>

              ONLINE

            </div>

          </div>


          {/* WINDOW BODY */}

          <div className="platform-layout">


            {/* SIDEBAR */}

            <aside className="platform-sidebar">

              <div className="sidebar-brand">

                <span>
                  FIELD
                </span>

                <strong>
                  GLASS
                </strong>

              </div>

              <div className="sidebar-label">
                WORKSPACE
              </div>


              <div className="sidebar-item active">

                <span>
                  ◇
                </span>

                Scraper

              </div>


              <div className="sidebar-item">

                <span>
                  ◇
                </span>

                Projects

              </div>


              <div className="sidebar-item">

                <span>
                  □
                </span>

                History

              </div>


              <div className="sidebar-item">

                <span>
                  ⚙
                </span>

                Settings

              </div>


              <div className="sidebar-bottom">

                <span className="sidebar-online"></span>

                SYSTEM READY

              </div>

            </aside>


            {/* MAIN PREVIEW */}

            <div className="platform-main">

              <div className="preview-heading">

                <div>

                  <h3>
                    Web Scraper
                  </h3>

                  <p>
                    Extract structured data from any website.
                  </p>

                </div>

                <span className="preview-badge">
                  AI ENABLED
                </span>

              </div>


              {/* URL PREVIEW */}

              <div className="preview-url">

                <span className="url-prefix">
                  URL
                </span>

                <span className="url-text">
                  https://example.com/products
                </span>

                <button>
                  SCRAPE
                </button>

              </div>


              {/* PREVIEW COLUMNS */}

              <div className="preview-columns">


                {/* SCRAPED CONTENT */}

                <div className="preview-box">

                  <div className="preview-box-header">

                    <span>
                      SCRAPED CONTENT
                    </span>

                    <span>
                      READY
                    </span>

                  </div>


                  <div className="preview-lines">

                    <div></div>

                    <div></div>

                    <div className="medium"></div>

                    <div></div>

                    <div className="short"></div>

                    <div></div>

                    <div className="medium"></div>

                    <div className="short"></div>

                  </div>

                </div>


                {/* AI PREVIEW */}

                <div className="preview-box ai-box">

                  <div className="preview-box-header">

                    <span>
                      AI EXTRACTION
                    </span>

                    <span className="yellow-text">
                      QWEN
                    </span>

                  </div>


                  <div className="ai-preview-text">

                    Extract all product names,
                    prices and descriptions from
                    the scraped webpage.

                  </div>


                  <div className="ai-result">

                    <span>
                      RESULT
                    </span>

                    <div>
                      Product Name&nbsp;&nbsp;&nbsp;&nbsp;Price
                    </div>

                    <div>
                      Wireless Headphones&nbsp;&nbsp;$49.99
                    </div>

                    <div>
                      Mechanical Keyboard&nbsp;&nbsp;$89.00
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="features-section"
      >

        <div className="section-label">

          <span>
            02
          </span>

          FEATURES

        </div>


        <div className="features-grid">


          <div className="feature-card">

            <span className="feature-number">
              01
            </span>

            <h3>
              Smart Scraping
            </h3>

            <p>
              Browser-based scraping designed to handle
              modern dynamic websites.
            </p>

          </div>


          <div className="feature-card">

            <span className="feature-number">
              02
            </span>

            <h3>
              AI Extraction
            </h3>

            <p>
              Turn messy webpage content into the exact
              information you actually need.
            </p>

          </div>


          <div className="feature-card">

            <span className="feature-number">
              03
            </span>

            <h3>
              Clean Output
            </h3>

            <p>
              Extract useful structured information without
              manually processing the entire webpage.
            </p>

          </div>


        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">

        <div>
          FIELDGLASS
        </div>

        <div className="footer-mono">
          AI-POWERED WEB DATA EXTRACTION
        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   RESULT DISPLAY
   Converts backend JSON into a clean visual interface
========================================================= */

function AIResultDisplay({ result }) {

  /* -------------------------------------------------------
     Parse the result
  ------------------------------------------------------- */

  let parsedResult = null;

  try {

    if (
      typeof result === "object" &&
      result !== null
    ) {

      parsedResult = result;

    } else if (
      typeof result === "string"
    ) {

      parsedResult = JSON.parse(result);

    }

  } catch (error) {

    parsedResult = null;

  }


  /* -------------------------------------------------------
     Invalid / plain text fallback
  ------------------------------------------------------- */

  if (
    !parsedResult ||
    typeof parsedResult !== "object"
  ) {

    return (
      <div className="result-plain-text">
        {String(result)}
      </div>
    );

  }


  const title =
    parsedResult.title ||
    "Extraction Results";


  const items =
    Array.isArray(parsedResult.items)
      ? parsedResult.items
      : [];


  const summary =
    parsedResult.summary ||
    "";


  /* -------------------------------------------------------
     Empty results
  ------------------------------------------------------- */

  if (items.length === 0) {

    return (
      <div className="structured-result">

        <div className="result-title">
          {title}
        </div>

        <div className="result-empty">

          <div className="result-empty-icon">
            ◇
          </div>

          <p>
            No matching information was found.
          </p>

          {summary && (
            <span>
              {summary}
            </span>
          )}

        </div>

      </div>
    );

  }


  /* -------------------------------------------------------
     Determine whether results contain details
  ------------------------------------------------------- */

  const hasDetails = items.some(
    (item) =>
      item &&
      typeof item === "object" &&
      item.details &&
      typeof item.details === "object" &&
      Object.keys(item.details).length > 0
  );


  /* -------------------------------------------------------
     Collect detail fields
  ------------------------------------------------------- */

  const detailFields = [];


  items.forEach((item) => {

    if (
      item &&
      typeof item === "object" &&
      item.details &&
      typeof item.details === "object"
    ) {

      Object.keys(item.details).forEach((key) => {

        if (!detailFields.includes(key)) {
          detailFields.push(key);
        }

      });

    }

  });


  /* -------------------------------------------------------
     Format field names
  ------------------------------------------------------- */

  function formatFieldName(field) {

    return field
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  }


  /* -------------------------------------------------------
     Render structured result
  ------------------------------------------------------- */

  return (

    <div className="structured-result">


      {/* RESULT TITLE */}

      <div className="result-title">
        {title}
      </div>


      {/* RESULT COUNT */}

      <div className="result-meta">

        <span className="result-count">

          {items.length} RESULT
          {items.length !== 1 ? "S" : ""}

        </span>

        <span className="result-line"></span>

      </div>


      {/* ===================================================
          SIMPLE LIST
      =================================================== */}

      {!hasDetails && (

        <div className="result-list">

          {items.map((item, index) => {

            let itemName = "";


            if (
              item &&
              typeof item === "object"
            ) {

              itemName =
                item.name ||
                item.title ||
                item.book ||
                item.product ||
                JSON.stringify(item);

            } else {

              itemName = String(item);

            }


            return (

              <div
                className="result-item"
                key={index}
              >

                <div className="result-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="result-item-name">
                  {itemName}
                </div>

              </div>

            );

          })}

        </div>

      )}


      {/* ===================================================
          TABLE WHEN DETAILS EXIST
      =================================================== */}

      {hasDetails && (

        <div className="result-table-wrapper">

          <table className="result-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  ITEM
                </th>

                {detailFields.map((field) => (

                  <th key={field}>
                    {formatFieldName(field)}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody>

              {items.map((item, index) => {

                const itemName =
                  item?.name ||
                  item?.title ||
                  item?.book ||
                  item?.product ||
                  "Unknown";


                return (

                  <tr key={index}>

                    <td className="table-number">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="table-item-name">
                      {itemName}
                    </td>


                    {detailFields.map((field) => {

                      let value =
                        item?.details?.[field];


                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {

                        value = "—";

                      }


                      return (

                        <td
                          key={field}
                          className="table-detail"
                        >
                          {String(value)}
                        </td>

                      );

                    })}

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      )}


      {/* ===================================================
          SUMMARY
      =================================================== */}

      {summary && (

        <div className="result-summary">

          <div className="summary-label">
            SUMMARY
          </div>

          <p>
            {summary}
          </p>

        </div>

      )}

    </div>

  );
}


/* =========================================================
   DASHBOARD PAGE
========================================================= */

function DashboardPage({ onBack }) {

  const [url, setUrl] = useState("");

  const [content, setContent] = useState("");

  const [description, setDescription] = useState("");

  const [result, setResult] = useState("");

  const [scraping, setScraping] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");


  /* =====================================================
     SCRAPE
  ===================================================== */

  async function handleScrape() {

    if (!url.trim()) {

      setError(
        "Please enter a website URL."
      );

      return;

    }


    setError("");

    setContent("");

    setResult("");

    setScraping(true);


    try {

      /*
        IMPORTANT:
        This request goes to the deployed
        Render backend, NOT localhost.
      */

      const response = await fetch(
        "https://fieldglass-backend.onrender.com/scrape",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: url.trim(),
          }),

        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to scrape website."
        );

      }


      setContent(
        data.content || ""
      );


    } catch (err) {

      setError(
        err.message ||
        "Failed to connect to the scraper backend."
      );

    } finally {

      setScraping(false);

    }

  }


  /* =====================================================
     AI ANALYZE
  ===================================================== */

  async function handleAnalyze() {

    if (!content) {

      setError(
        "Scrape a website first."
      );

      return;

    }


    if (!description.trim()) {

      setError(
        "Please enter an extraction instruction."
      );

      return;

    }


    setError("");

    setResult("");

    setAnalyzing(true);


    try {

      /*
        IMPORTANT:
        This request also goes to the deployed
        Render backend.
      */

      const response = await fetch(
        "https://fieldglass-backend.onrender.com/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            content: content,
            description: description.trim(),
          }),

        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to analyze content."
        );

      }


      setResult(
        data.result || ""
      );


    } catch (err) {

      setError(
        err.message ||
        "Failed to connect to the AI backend."
      );

    } finally {

      setAnalyzing(false);

    }

  }


  return (

    <div className="dashboard">


      {/* =====================================================
          DASHBOARD SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">


        {/* NEON LOGO */}

        <button
          className="dashboard-brand"
          onClick={onBack}
        >

          <span>
            Field
          </span>

          <strong data-text="glass">
            glass
          </strong>

        </button>


        <div className="dashboard-section-label">
          WORKSPACE
        </div>


        <button className="dashboard-nav active">

          <span>
            ◇
          </span>

          Scraper

        </button>


        <button className="dashboard-nav">

          <span>
            ◇
          </span>

          Projects

        </button>


        <button className="dashboard-nav">

          <span>
            □
          </span>

          History

        </button>


        <button className="dashboard-nav">

          <span>
            ⚙
          </span>

          Settings

        </button>


        <div className="dashboard-spacer"></div>


        <div className="dashboard-status">

          <span></span>

          AI SCRAPER ONLINE

        </div>


      </aside>


      {/* =====================================================
          DASHBOARD MAIN
      ===================================================== */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <div className="dashboard-eyebrow">
              FIELDGLASS / SCRAPER
            </div>

            <h1>
              Web Scraper
            </h1>

            <p>
              Extract and analyze information from the web.
            </p>

          </div>


          <button
            className="dashboard-back"
            onClick={onBack}
          >
            ← Home
          </button>

        </header>


        {/* ERROR */}

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {/* =====================================================
            DASHBOARD GRID
        ===================================================== */}

        <div className="dashboard-grid">


          {/* =================================================
              WEBSITE SOURCE
          ================================================= */}

          <section className="dashboard-card url-card">

            <div className="card-heading">

              <div>

                <span className="card-number">
                  01
                </span>

                <h2>
                  Website Source
                </h2>

              </div>

              <span className="card-status">
                INPUT
              </span>

            </div>


            <div className="url-control">

              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    handleScrape();
                  }

                }}
              />


              <button
                onClick={handleScrape}
                disabled={scraping}
              >

                {scraping
                  ? "SCRAPING..."
                  : "SCRAPE"}

              </button>

            </div>

          </section>


          {/* =================================================
              SCRAPED CONTENT
          ================================================= */}

          <section className="dashboard-card content-card">

            <div className="card-heading">

              <div>

                <span className="card-number">
                  02
                </span>

                <h2>
                  Scraped Content
                </h2>

              </div>


              <span className="card-status">

                {content
                  ? "READY"
                  : "WAITING"}

              </span>

            </div>


            <div className="content-viewer">

              {content ? (

                content

              ) : (

                <div className="empty-content">

                  <span>
                    ◇
                  </span>

                  <p>
                    Scraped webpage content will
                    appear here.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              AI EXTRACTION
          ================================================= */}

          <section className="dashboard-card ai-card">

            <div className="card-heading">

              <div>

                <span className="card-number">
                  03
                </span>

                <h2>
                  AI Extraction
                </h2>

              </div>


              <span className="ai-status">
                QWEN
              </span>

            </div>


            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Example: Extract all product names, prices and descriptions."
            />


            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={
                analyzing ||
                !content
              }
            >

              {analyzing
                ? "ANALYZING..."
                : "RUN AI EXTRACTION →"}

            </button>

          </section>


          {/* =================================================
              AI RESULT
          ================================================= */}

          <section className="dashboard-card result-card">

            <div className="card-heading">

              <div>

                <span className="card-number">
                  04
                </span>

                <h2>
                  AI Result
                </h2>

              </div>


              <span className="card-status yellow">
                OUTPUT
              </span>

            </div>


            <div className="result-viewer">

              {result ? (

                <AIResultDisplay
                  result={result}
                />

              ) : (

                <div className="empty-content">

                  <span>
                    ✦
                  </span>

                  <p>
                    AI extraction results will
                    appear here.
                  </p>

                </div>

              )}

            </div>

          </section>


        </div>

      </main>

    </div>

  );

}


/* =========================================================
   BROWSER HISTORY NAVIGATION
========================================================= */

function getPageFromHash() {

  return window.location.hash === "#dashboard"
    ? "dashboard"
    : "landing";

}


/* =========================================================
   APP
========================================================= */

function App() {

  const [page, setPage] =
    useState(getPageFromHash);


  /*
    Listen for browser Back / Forward buttons.
  */

  useEffect(() => {

    const handleNavigation = () => {

      setPage(
        getPageFromHash()
      );

    };


    window.addEventListener(
      "popstate",
      handleNavigation
    );


    window.addEventListener(
      "hashchange",
      handleNavigation
    );


    return () => {

      window.removeEventListener(
        "popstate",
        handleNavigation
      );


      window.removeEventListener(
        "hashchange",
        handleNavigation
      );

    };

  }, []);


  /*
    Landing → Dashboard
  */

  function goToDashboard() {

    if (
      window.location.hash !== "#dashboard"
    ) {

      window.history.pushState(
        {},
        "",
        `${window.location.pathname}${window.location.search}#dashboard`
      );

    }

    setPage("dashboard");

  }


  /*
    Dashboard → Landing
  */

  function goToLanding() {

    if (
      window.location.hash
    ) {

      window.history.pushState(
        {},
        "",
        `${window.location.pathname}${window.location.search}`
      );

    }

    setPage("landing");

  }


  /*
    Show Dashboard
  */

  if (
    page === "dashboard"
  ) {

    return (

      <DashboardPage
        onBack={goToLanding}
      />

    );

  }


  /*
    Show Landing Page
  */

  return (

    <LandingPage
      onStart={goToDashboard}
    />

  );

}


export default App;