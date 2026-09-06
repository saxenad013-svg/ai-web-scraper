import { useEffect, useState } from "react";
import "./App.css";

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage({ onStart }) {
  const [previewTab, setPreviewTab] = useState("scraper");
  const [demoStage, setDemoStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStage((stage) => (stage + 1) % 5);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const demoRows = [
    ["PRODUCT", "Arc Light Headphones"],
    ["PRICE", "$129.00"],
    ["RATING", "4.8 / 5"],
    ["AVAILABILITY", "In stock"],
  ];

  const previewData = {
    scraper: {
      title: "Web Scraper",
      text: "Preview the extraction pipeline before launching the full workspace.",
    },
    projects: {
      title: "Projects",
      text: "Save repeatable extraction workflows and run them from one workspace.",
    },
    history: {
      title: "History",
      text: "Keep track of completed extraction runs and revisit previous results.",
    },
    settings: {
      title: "Settings",
      text: "Control workspace behavior, output preferences and interface effects.",
    },
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const replayPreview = () => {
    setDemoStage(0);
    setPreviewTab("scraper");
  };

  return (
    <div className="landing-page" id="top">
      <div className="cyber-grid"></div>
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <div className="ambient ambient-three"></div>

      <nav className="landing-nav">
        <button className="nav-brand nav-brand-button" onClick={() => scrollToSection("top")}>
          <span className="nav-field">SCRAPE</span>
          <span className="nav-glass">NOVE</span>
        </button>
        <div className="nav-links">
          <button onClick={() => scrollToSection("platform")}>Platform</button>
          <button onClick={() => scrollToSection("features")}>Features</button>
          <button className="nav-launch" onClick={onStart}>Launch App <span>→</span></button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-status"><span className="hero-status-dot"></span>SCRAPER ONLINE</div>
        <h1 className="hero-logo" data-text="SCRAPENOVE">
          <span className="logo-field">SCRAPE</span>
          <span className="logo-glass" data-text="NOVE">NOVE</span>
        </h1>
        <p className="hero-description">
          AI-powered web data extraction built for turning complex websites into clean, useful information.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onStart}>Start Scraping <span>→</span></button>
          <button type="button" onClick={() => scrollToSection("platform")} className="secondary-button">Explore Platform</button>
        </div>
      </main>

      <section id="platform" className="platform-section">
        <div className="section-label"><span>01</span>PLATFORM</div>
        <div className="platform-window">
          <div className="window-top">
            <div className="window-dots"><span></span><span></span><span></span></div>
            <div className="window-title">SCRAPENOVE / EXTRACTOR</div>
            <div className="window-status"><span></span>ONLINE</div>
          </div>

          <div className="platform-layout">
            <aside className="platform-sidebar">
              <div className="sidebar-brand"><span>SCRAPE</span><strong>NOVE</strong></div>
              <div className="sidebar-label">WORKSPACE</div>
              <button className={`sidebar-item ${previewTab === "scraper" ? "active" : ""}`} onClick={() => setPreviewTab("scraper")}><span>◇</span>Scraper</button>
              <button className={`sidebar-item ${previewTab === "projects" ? "active" : ""}`} onClick={() => setPreviewTab("projects")}><span>◇</span>Projects</button>
              <button className={`sidebar-item ${previewTab === "history" ? "active" : ""}`} onClick={() => setPreviewTab("history")}><span>□</span>History</button>
              <button className={`sidebar-item ${previewTab === "settings" ? "active" : ""}`} onClick={() => setPreviewTab("settings")}><span>⚙</span>Settings</button>
              <div className="sidebar-bottom"><span className="sidebar-online"></span>SYSTEM READY</div>
            </aside>

            <div className="platform-main">
              <div className="preview-heading">
                <div>
                  <h3>{previewData[previewTab].title}</h3>
                  <p>{previewData[previewTab].text}</p>
                </div>
                <span className="preview-badge">{demoStage === 4 ? "READY" : "PROCESSING"}</span>
              </div>

              {previewTab === "scraper" ? (
                <>
                  <div className="preview-demo-url">
                    <span className="url-prefix">URL</span>
                    <span>https://example.com/products</span>
                    <span className="preview-demo-caret">▌</span>
                  </div>

                  <div className="preview-demo-instruction">
                    <span className="url-prefix">ASK</span>
                    <span>Extract product names, prices and availability.</span>
                  </div>

                  <div className="preview-columns">
                    <div className="preview-box">
                      <div className="preview-box-header"><span>PAGE CONTENT</span><span>{demoStage > 0 ? "PARSED" : "SCANNING"}</span></div>
                      <div className="preview-scan-lines">
                        {Array.from({ length: 8 }).map((_, i) => <div key={i} className={demoStage > 0 ? "revealed" : ""}></div>)}
                      </div>
                    </div>
                    <div className="preview-box ai-box">
                      <div className="preview-box-header"><span>STRUCTURED DATA</span><span className="yellow-text">READY</span></div>
                      <div className="preview-data-grid">
                        {demoRows.map(([label, value], i) => (
                          <div className={`preview-data-row ${demoStage >= 2 ? "revealed" : ""}`} key={label} style={{ transitionDelay: `${i * 120}ms` }}>
                            <span>{label}</span><strong>{value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="preview-process-bar">
                    <span className={demoStage >= 1 ? "done" : ""}>SCAN</span>
                    <i></i>
                    <span className={demoStage >= 2 ? "done" : ""}>EXTRACT</span>
                    <i></i>
                    <span className={demoStage >= 3 ? "done" : ""}>STRUCTURE</span>
                  </div>

                  <div className="preview-footer-actions">
                    <span className="preview-teaser-note">LIVE WORKSPACE AVAILABLE</span>
                    <button type="button" className="preview-replay-action" onClick={replayPreview}>REPLAY DEMO ↻</button>
                    <button type="button" onClick={onStart}>OPEN FULL SCRAPER →</button>
                  </div>
                </>
              ) : (
                <div className="preview-placeholder-panel preview-teaser-panel">
                  <span className="preview-panel-number">{previewTab.toUpperCase()}</span>
                  <h3>{previewTab === "projects" ? "Your extraction workflows" : previewTab === "history" ? "Your extraction trail" : "Your workspace controls"}</h3>
                  <p>{previewData[previewTab].text} The full tools become available after you launch SCRAPENOVE.</p>
                  <div className="preview-teaser-lines"><span></span><span></span><span></span></div>
                  <button className="preview-launch-action" onClick={onStart}>LAUNCH SCRAPENOVE →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-label"><span>02</span>FEATURES</div>
        <div className="features-grid">
          <button className="feature-card" onClick={onStart}><span className="feature-number">01</span><h3>Smart Scraping</h3><p>Browser-based scraping designed to handle modern dynamic websites.</p><span className="feature-cta">ENTER WORKSPACE →</span></button>
          <button className="feature-card" onClick={onStart}><span className="feature-number">02</span><h3>Smart Extraction</h3><p>Turn messy webpage content into the exact information you actually need.</p><span className="feature-cta">TRY EXTRACTION →</span></button>
          <button className="feature-card" onClick={onStart}><span className="feature-number">03</span><h3>Clean Output</h3><p>Extract useful structured information without manually processing the entire webpage.</p><span className="feature-cta">VIEW OUTPUT →</span></button>
        </div>
      </section>

      <footer className="landing-footer"><div>SCRAPENOVE</div><div className="footer-mono">WEB DATA EXTRACTION</div></footer>
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

function getSavedWorkspaceSession() {
  try {
    const saved = JSON.parse(localStorage.getItem("scrapenove_session") || "null");
    if (!saved || typeof saved !== "object") return null;

    return {
      url: typeof saved.url === "string" ? saved.url : "",
      content: typeof saved.content === "string" ? saved.content : "",
      description: typeof saved.description === "string" ? saved.description : "",
      projectName: typeof saved.projectName === "string" ? saved.projectName : "",
      result: typeof saved.result === "string" ? saved.result : "",
      workspace: ["scraper", "projects", "history", "settings"].includes(saved.workspace) ? saved.workspace : "scraper",
    };
  } catch {
    return null;
  }
}

function DashboardPage({ onBack }) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedSession] = useState(() => getSavedWorkspaceSession());
  const hasSavedSession = Boolean(
    savedSession &&
    (savedSession.url ||
      savedSession.content ||
      savedSession.description ||
      savedSession.projectName ||
      savedSession.result)
  );
  const [showRestorePrompt, setShowRestorePrompt] = useState(hasSavedSession);

  // Start clean. The user explicitly chooses whether to restore the previous
  // session, which avoids surprising them after a refresh.
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [result, setResult] = useState("");
  const [scraping, setScraping] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState(() => savedSession?.workspace || "scraper");
  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("scrapenove_projects") || "[]");
    } catch {
      return [];
    }
  });
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("scrapenove_history") || "[]");
    } catch {
      return [];
    }
  });
  const [historySearch, setHistorySearch] = useState("");
  const [resultCopied, setResultCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("scrapenove_settings") || '{"animations":true,"autoSave":true,"outputFormat":"json"}');
    } catch {
      return { animations: true, autoSave: true, outputFormat: "json" };
    }
  });

  useEffect(() => {
    localStorage.setItem("scrapenove_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("scrapenove_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("scrapenove_settings", JSON.stringify(settings));
    document.body.classList.toggle("scrapenove-reduced-motion", settings.animations === false);
    return () => document.body.classList.remove("scrapenove-reduced-motion");
  }, [settings]);

  function saveWorkspaceSession() {
    try {
      localStorage.setItem("scrapenove_session", JSON.stringify({
        version: 1,
        url,
        content: content.slice(0, 250000),
        description,
        projectName,
        result: result.slice(0, 100000),
        workspace,
        savedAt: new Date().toISOString(),
      }));
    } catch {
      // Ignore storage errors so a large scrape cannot break the workspace.
    }
  }

  // Persist immediately whenever the workspace changes. This makes refresh
  // recovery reliable even when the user reloads or closes the tab quickly.
  useEffect(() => {
    saveWorkspaceSession();
  }, [url, content, description, projectName, result, workspace]);

  useEffect(() => {
    const handleBeforeUnload = () => saveWorkspaceSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [url, content, description, projectName, result, workspace]);

  function restoreSavedSession() {
    if (!savedSession) {
      setShowRestorePrompt(false);
      return;
    }

    setUrl(savedSession.url || "");
    setContent(savedSession.content || "");
    setDescription(savedSession.description || "");
    setProjectName(savedSession.projectName || "");
    setResult(savedSession.result || "");
    setWorkspace(savedSession.workspace || "scraper");
    setError("");
    setShowRestorePrompt(false);
  }

  function startFreshSession() {
    try {
      localStorage.removeItem("scrapenove_session");
    } catch {
      // Ignore storage errors.
    }

    setUrl("");
    setContent("");
    setDescription("");
    setProjectName("");
    setResult("");
    setWorkspace("scraper");
    setError("");
    setShowRestorePrompt(false);
  }

  async function handleScrape() {
    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    setError("");
    setContent("");
    setResult("");
    setScraping(true);

    try {
      const response = await fetch(
        "https://fieldglass-backend.onrender.com/scrape",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to scrape website.");
      }

      const scraped = data.content || "";
      setContent(scraped);

      if (settings.autoSave) {
        const entry = {
          id: Date.now(),
          url: url.trim(),
          description: description.trim(),
          content: scraped,
          result: "",
          createdAt: new Date().toISOString(),
        };
        setHistory((items) => [entry, ...items].slice(0, 50));
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the scraper backend.");
    } finally {
      setScraping(false);
    }
  }

  async function handleAnalyze() {
    if (!content) {
      setError("Scrape a website first.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter an extraction instruction.");
      return;
    }

    setError("");
    setResult("");
    setAnalyzing(true);

    try {
      const response = await fetch(
        "https://fieldglass-backend.onrender.com/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to analyze content.");
      }

      const analyzed = data.result || "";
      setResult(analyzed);

      if (settings.autoSave) {
        setHistory((items) => {
          if (!items.length) return items;
          const [latest, ...rest] = items;
          return [
            { ...latest, description: description.trim(), result: analyzed },
            ...rest,
          ];
        });
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the AI backend.");
    } finally {
      setAnalyzing(false);
    }
  }

  function loadHistory(entry) {
    setUrl(entry.url || "");
    setDescription(entry.description || "");
    setProjectName("");
    setContent(entry.content || "");
    setResult(entry.result || "");
    setError("");
    setWorkspace("scraper");
  }

  function saveProject() {
    if (!url.trim()) {
      setError("Enter a website URL before saving a project.");
      setWorkspace("scraper");
      return;
    }

    const project = {
      id: Date.now(),
      name: projectName.trim() || (() => {
        try {
          return new URL(url.trim()).hostname.replace(/^www\./, "");
        } catch {
          return "Untitled Project";
        }
      })(),
      url: url.trim(),
      description: description.trim(),
      content,
      result,
      createdAt: new Date().toISOString(),
    };

    setProjects((items) => [project, ...items]);
    setError("");
  }

  function loadProject(project) {
    setProjectName(project.name || "");
    setUrl(project.url || "");
    setDescription(project.description || "");
    setContent(project.content || "");
    setResult(project.result || "");
    setError("");
    setWorkspace("scraper");
  }

  async function runProject(project) {
    setWorkspace("scraper");
    setProjectName(project.name || "");
    setUrl(project.url || "");
    setDescription(project.description || "");
    setError("");
    setContent("");
    setResult("");
    setScraping(true);

    try {
      const response = await fetch(
        "https://fieldglass-backend.onrender.com/scrape",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: (project.url || "").trim() }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to scrape website.");

      const scraped = data.content || "";
      setContent(scraped);

      let analyzed = "";
      if ((project.description || "").trim()) {
        setAnalyzing(true);
        const analyzeResponse = await fetch(
          "https://fieldglass-backend.onrender.com/analyze",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: scraped,
              description: project.description.trim(),
            }),
          }
        );
        const analyzeData = await analyzeResponse.json();
        if (!analyzeResponse.ok) throw new Error(analyzeData.error || "Unable to analyze content.");
        analyzed = analyzeData.result || "";
        setResult(analyzed);
      }

      const entry = {
        id: Date.now(),
        url: project.url,
        description: project.description || "",
        content: scraped,
        result: analyzed,
        createdAt: new Date().toISOString(),
      };
      if (settings.autoSave) setHistory((items) => [entry, ...items].slice(0, 50));
    } catch (err) {
      setError(err.message || "Project run failed.");
    } finally {
      setScraping(false);
      setAnalyzing(false);
    }
  }

  function deleteProject(id) {
    setProjects((items) => items.filter((item) => item.id !== id));
  }

  function clearHistory() {
    setHistory([]);
  }

  function resetSettings() {
    const defaults = { animations: true, autoSave: true, outputFormat: "json" };
    setSettings(defaults);
    setError("");
  }

  function exportPreferredResult() {
    exportCurrent(settings.outputFormat || "json");
  }

  async function copyContent() {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setContentCopied(true);
      setTimeout(() => setContentCopied(false), 1600);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      let output = result;
      try { output = JSON.stringify(JSON.parse(result), null, 2); } catch {}
      await navigator.clipboard.writeText(output);
      setResultCopied(true);
      setTimeout(() => setResultCopied(false), 1600);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  }

  function downloadFile(filename, text, type) {
    const blob = new Blob([text], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function exportCurrent(format) {
    if (!result) return;

    if (format === "json") {
      let output = result;
      try {
        output = JSON.stringify(JSON.parse(result), null, 2);
      } catch {
        output = JSON.stringify({ result }, null, 2);
      }
      downloadFile("scrapenove-result.json", output, "application/json");
      return;
    }

    if (format === "csv") {
      let parsed = null;
      try { parsed = JSON.parse(result); } catch {}
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      if (items.length) {
        const rows = items.map((item) => {
          const details = item && typeof item === "object" && item.details && typeof item.details === "object" ? item.details : {};
          return { ITEM: item?.name || item?.title || item?.book || item?.product || "", ...details };
        });
        const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
        const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const csv = [columns.map(esc).join(","), ...rows.map(row => columns.map(c => esc(row[c])).join(","))].join("\n");
        downloadFile("scrapenove-result.csv", csv, "text/csv");
      } else {
        const csv = `result\n"${String(result).replace(/"/g, '""')}"\n`;
        downloadFile("scrapenove-result.csv", csv, "text/csv");
      }
      return;
    }

    downloadFile("scrapenove-result.txt", result, "text/plain");
  }

  const navItems = [
    ["scraper", "◇", "Scraper"],
    ["projects", "◇", "Projects"],
    ["history", "□", "History"],
    ["settings", "⚙", "Settings"],
  ];

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <button className="dashboard-brand" onClick={onBack}>
          <span>SCRAPE</span>
          <strong data-text="NOVE">NOVE</strong>
        </button>

        <div className="dashboard-section-label">WORKSPACE</div>

        <div className="dashboard-desktop-nav">
          {navItems.map(([id, icon, label]) => (
            <button
              key={id}
              className={`dashboard-nav ${workspace === id ? "active" : ""}`}
              onClick={() => setWorkspace(id)}
            >
              <span>{icon}</span>
              {label}
              {id === "projects" && projects.length > 0 && (
                <b className="nav-count">{projects.length}</b>
              )}
              {id === "history" && history.length > 0 && (
                <b className="nav-count">{history.length}</b>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open workspace menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {mobileMenuOpen && (
          <div className="mobile-workspace-menu">
            {navItems.map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                className={`mobile-workspace-item ${workspace === id ? "active" : ""}`}
                onClick={() => {
                  setWorkspace(id);
                  setMobileMenuOpen(false);
                }}
              >
                <span>{icon}</span>
                <strong>{label}</strong>
                {id === "projects" && projects.length > 0 && (
                  <b>{projects.length}</b>
                )}
                {id === "history" && history.length > 0 && (
                  <b>{history.length}</b>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="dashboard-spacer"></div>

        <div className="dashboard-status">
          <span></span>
          SCRAPER ONLINE
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">SCRAPENOVE / EXTRACTOR</div>
            <h1>
              {workspace === "scraper" && "Web Scraper"}
              {workspace === "projects" && "Projects"}
              {workspace === "history" && "Extraction History"}
              {workspace === "settings" && "Settings"}
            </h1>
            <p>
              {workspace === "scraper" && "Extract and analyze information from the web."}
              {workspace === "projects" && "Save reusable website extraction configurations."}
              {workspace === "history" && "Review and restore your previous extraction runs."}
              {workspace === "settings" && "Control how SCRAPENOVE behaves on this device."}
            </p>
            {(url || content || description || result) && (
              <span className="session-status">SESSION SAVED LOCALLY</span>
            )}
          </div>

          <button className="dashboard-back" onClick={onBack}>← Home</button>
        </header>

        {error && <div className="error-message">{error}</div>}

        {showRestorePrompt && (
          <div className="session-restore-overlay" role="presentation">
            <div
              className="session-restore-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="session-restore-title"
            >
              <div className="session-restore-kicker">SESSION DETECTED</div>
              <div className="session-restore-icon">↻</div>
              <h2 id="session-restore-title">Restore previous session?</h2>
              <p>
                SCRAPENOVE found saved workspace data from your last visit.
                Restore it, or start with a clean workspace.
              </p>

              <div className="session-restore-meta">
                {savedSession?.url && <span>URL SAVED</span>}
                {savedSession?.content && <span>SCRAPED DATA SAVED</span>}
                {savedSession?.result && <span>RESULT SAVED</span>}
              </div>

              <div className="session-restore-actions">
                <button
                  type="button"
                  className="session-restore-primary"
                  onClick={restoreSavedSession}
                >
                  RESTORE SESSION →
                </button>
                <button
                  type="button"
                  className="session-restore-secondary"
                  onClick={startFreshSession}
                >
                  START FRESH
                </button>
              </div>
            </div>
          </div>
        )}

        {workspace === "scraper" && (
          <div className="dashboard-grid">
            <section className="dashboard-card url-card">
              <div className="card-heading">
                <div><span className="card-number">01</span><h2>Website Source</h2></div>
                <span className="card-status">INPUT</span>
              </div>

              <div className="project-name-control">
                <label>PROJECT NAME</label>
                <input
                  type="text"
                  placeholder="Optional — e.g. Amazon Products"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="url-control">
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                />
                <button onClick={handleScrape} disabled={scraping}>
                  {scraping ? "SCRAPING..." : "SCRAPE"}
                </button>
              </div>

              <div className="workspace-actions">
                <button onClick={saveProject}>＋ SAVE PROJECT</button>
                <button onClick={() => setWorkspace("projects")}>VIEW PROJECTS</button>
              </div>
            </section>

            <section className="dashboard-card content-card">
              <div className="card-heading">
                <div><span className="card-number">02</span><h2>Scraped Content</h2></div>
                <span className="card-status">{content ? "READY" : "WAITING"}</span>
              </div>
              <div className="content-toolbar">
                <span>{content ? `${content.length.toLocaleString()} CHARACTERS` : "NO DATA"}</span>
                <button onClick={copyContent} disabled={!content}>{contentCopied ? "COPIED" : "COPY"}</button>
              </div>
              <div className="content-viewer">
                {content ? content : (
                  <div className="empty-content"><span>◇</span><p>Scraped webpage content will appear here.</p></div>
                )}
              </div>
            </section>

            <section className="dashboard-card ai-card">
              <div className="card-heading">
                <div><span className="card-number">03</span><h2>Smart Extraction</h2></div>
                <span className="ai-status">QWEN</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Extract all product names, prices and descriptions."
              />
              <button className="analyze-button" onClick={handleAnalyze} disabled={analyzing || !content}>
                {analyzing ? "ANALYZING..." : "RUN SMART EXTRACTION →"}
              </button>
            </section>

            <section className="dashboard-card result-card">
              <div className="card-heading">
                <div><span className="card-number">04</span><h2>AI Result</h2></div>
                <span className="card-status yellow">OUTPUT</span>
              </div>
              {result && (
                <div className="result-toolbar">
                  <button onClick={copyResult}>{resultCopied ? "COPIED" : "COPY"}</button>
                  <button onClick={exportPreferredResult}>{(settings.outputFormat || "json").toUpperCase()}</button>
                  <button onClick={() => exportCurrent("csv")}>CSV</button>
                  <button onClick={() => exportCurrent("txt")}>TXT</button>
                </div>
              )}
              <div className="result-viewer">
                {result ? <AIResultDisplay result={result} /> : (
                  <div className="empty-content"><span>✦</span><p>AI extraction results will appear here.</p></div>
                )}
              </div>
            </section>
          </div>
        )}

        {workspace === "projects" && (
          <section className="workspace-panel">
            <div className="workspace-panel-heading">
              <div><span className="card-number">P</span><h2>Saved Projects</h2></div>
              <button className="workspace-primary" onClick={() => setWorkspace("scraper")}>＋ NEW PROJECT</button>
            </div>
            {projects.length === 0 ? (
              <div className="workspace-empty"><span>◇</span><h3>No projects yet</h3><p>Configure a scraper and save it here for quick reuse.</p><button onClick={() => setWorkspace("scraper")}>CREATE FIRST PROJECT</button></div>
            ) : (
              <div className="workspace-list">
                {projects.map((project) => (
                  <div className="workspace-row" key={project.id}>
                    <div><strong>{project.name}</strong><span>{project.url}</span><small>{project.description || "No extraction instruction saved."}</small></div>
                    <div className="workspace-row-actions"><button onClick={() => runProject(project)}>RUN</button><button onClick={() => loadProject(project)}>OPEN</button><button onClick={() => deleteProject(project.id)}>DELETE</button></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {workspace === "history" && (
          <section className="workspace-panel">
            <div className="workspace-panel-heading">
              <div><span className="card-number">H</span><h2>Extraction History</h2></div>
              {history.length > 0 && <button className="workspace-danger" onClick={clearHistory}>CLEAR HISTORY</button>}
            </div>
            {history.length > 0 && (
              <div className="history-tools">
                <input
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="SEARCH URL OR EXTRACTION..."
                />
                <span>{history.length} RUN{history.length === 1 ? "" : "S"}</span>
              </div>
            )}
            {history.length === 0 ? (
              <div className="workspace-empty"><span>□</span><h3>No extraction history</h3><p>Your completed scraping runs will appear here.</p><button onClick={() => setWorkspace("scraper")}>START SCRAPING</button></div>
            ) : (
              <div className="workspace-list">
                {history
                  .filter((entry) => `${entry.url} ${entry.description}`.toLowerCase().includes(historySearch.toLowerCase()))
                  .map((entry) => (
                  <div className="workspace-row history-row" key={entry.id}>
                    <button className="history-open" onClick={() => loadHistory(entry)}>
                      <div><strong>{entry.url}</strong><span>{entry.description || "Scrape only"}</span><small>{new Date(entry.createdAt).toLocaleString()}</small></div>
                      <em>{entry.result ? "EXTRACTED" : "SCRAPED"}</em>
                    </button>
                    <button className="history-delete" onClick={() => setHistory(items => items.filter(item => item.id !== entry.id))} aria-label="Delete history entry">×</button>
                  </div>
                ))}
                {history.filter((entry) => `${entry.url} ${entry.description}`.toLowerCase().includes(historySearch.toLowerCase())).length === 0 && (
                  <div className="workspace-empty compact"><span>□</span><p>No history entries match your search.</p></div>
                )}
              </div>
            )}
          </section>
        )}

        {workspace === "settings" && (
          <section className="workspace-panel settings-panel">
            <div className="workspace-panel-heading">
              <div><span className="card-number">S</span><h2>Interface Settings</h2></div>
              <span className="card-status">LOCAL</span>
            </div>

            <label className="setting-row">
              <span><strong>Interface animations</strong><small>Enable SCRAPENOVE scanlines, flicker and motion effects.</small></span>
              <input type="checkbox" checked={settings.animations !== false} onChange={(e) => setSettings({ ...settings, animations: e.target.checked })} />
            </label>

            <label className="setting-row">
              <span><strong>Auto-save history</strong><small>Keep completed scrape and extraction runs in this browser.</small></span>
              <input type="checkbox" checked={settings.autoSave !== false} onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })} />
            </label>

            <label className="setting-row setting-select-row">
              <span><strong>Preferred export format</strong><small>Choose the format used by the quick export action in results.</small></span>
              <select value={settings.outputFormat || "json"} onChange={(e) => setSettings({ ...settings, outputFormat: e.target.value })}>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="txt">TXT</option>
              </select>
            </label>

            <div className="settings-footer">
              <div className="settings-note">SCRAPENOVE stores these preferences locally on this device. They remain available after a refresh.</div>
              <button className="workspace-danger settings-reset" onClick={resetSettings}>RESET SETTINGS</button>
            </div>
          </section>
        )}
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
   TRANSITION LOADER
========================================================= */

function WorkspaceLoading({ returning = false }) {
  return (
    <div className={`workspace-loading ${returning ? "workspace-loading-return" : ""}`} role="status" aria-live="polite">
      <div className="loading-orbit">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="loading-kicker">{returning ? "SCRAPENOVE / CLOSING WORKSPACE" : "SCRAPENOVE / INITIALIZING"}</div>
      <h2>{returning ? "Returning Home" : "Loading Workspace"}</h2>
      <p>{returning ? "Returning to the SCRAPENOVE landing interface" : "Preparing the extraction interface"}<span className="loading-dots">...</span></p>
      <div className="loading-progress"><span></span></div>
    </div>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {

  const [page, setPage] =
    useState(getPageFromHash);

  const [transition, setTransition] =
    useState(null);


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

  async function finishTransition(targetPage, mode) {
    /*
      Keep the cinematic transition visible for a short minimum time,
      but don't make a fast device/connection wait longer than necessary.
      We also wait for the next paint so the destination workspace is ready
      before the loader disappears.
    */
    const minimumVisibleMs = 650;
    const startedAt = performance.now();

    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Fonts are non-blocking for navigation; continue if unavailable.
      }
    }

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });

    const remaining = Math.max(
      0,
      minimumVisibleMs - (performance.now() - startedAt)
    );

    if (remaining > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, remaining));
    }

    if (mode === "opening") {
      if (window.location.hash !== "#dashboard") {
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}${window.location.search}#dashboard`
        );
      }
    } else if (window.location.hash) {
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }

    setPage(targetPage);
    setTransition(null);
  }


  /*
    Landing → Dashboard
  */

  function goToDashboard() {

    if (transition || page === "dashboard") {
      return;
    }

    setTransition("opening");
    void finishTransition("dashboard", "opening");

  }


  /*
    Dashboard → Landing
  */

  function goToLanding() {

    if (transition || page === "landing") {
      return;
    }

    setTransition("closing");
    void finishTransition("landing", "closing");

  }


  /*
    Show Dashboard
  */

  if (transition) {
    return <WorkspaceLoading returning={transition === "closing"} />;
  }

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