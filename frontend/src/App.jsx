import { useState, useCallback } from "react";
import axios from "axios";
import './App.css'

// ── Minimal markdown → JSX renderer ──────────────────────────────────────────
function MdContent({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];

  const flushList = (key) => {
    if (listBuffer.length) {
      elements.push(
        <ul key={`ul-${key}`} style={{ margin: "0.5rem 0 0.5rem 1.2rem", padding: 0 }}>
          {listBuffer.map((item, i) => (
            <li key={i} style={{ color: "#cdc8bf", fontSize: "0.88rem", lineHeight: 1.75, marginBottom: 2 }}>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const inlineFormat = (str) =>
    str.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f0ebe0">$1</strong>');

  lines.forEach((line, i) => {
    if (/^### (.+)/.test(line)) {
      flushList(i);
      elements.push(<h3 key={i} style={{ fontFamily: "'Syne', sans-serif", color: "#f0ebe0", fontSize: "0.95rem", fontWeight: 700, margin: "1rem 0 0.3rem" }}>{line.replace(/^### /, "")}</h3>);
    } else if (/^## (.+)/.test(line)) {
      flushList(i);
      elements.push(<h2 key={i} style={{ fontFamily: "'Syne', sans-serif", color: "#f0ebe0", fontSize: "1.05rem", fontWeight: 700, margin: "1.2rem 0 0.4rem" }}>{line.replace(/^## /, "")}</h2>);
    } else if (/^# (.+)/.test(line)) {
      flushList(i);
      elements.push(<h1 key={i} style={{ fontFamily: "'Syne', sans-serif", color: "#f0ebe0", fontSize: "1.2rem", fontWeight: 800, margin: "1.2rem 0 0.5rem" }}>{line.replace(/^# /, "")}</h1>);
    } else if (/^[*-] (.+)/.test(line)) {
      listBuffer.push(line.replace(/^[*-] /, ""));
    } else if (line.trim() === "") {
      flushList(i);
      elements.push(<br key={i} />);
    } else {
      flushList(i);
      elements.push(
        <p key={i} style={{ color: "#cdc8bf", fontSize: "0.88rem", lineHeight: 1.8, margin: "0.3rem 0" }}>
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
        </p>
      );
    }
  });
  flushList("end");
  return <div>{elements}</div>;
}

// ── Step card ─────────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, state }) {
  const borderColor =
    state === "active" ? "rgba(255,140,50,0.4)" :
    state === "done"   ? "rgba(80,200,120,0.3)" :
    "rgba(255,255,255,0.07)";
  const bg =
    state === "active" ? "rgba(255,140,50,0.04)" :
    state === "done"   ? "rgba(80,200,120,0.03)" :
    "rgba(255,255,255,0.03)";
  const barColor =
    state === "active" ? "#ff8c32" :
    state === "done"   ? "#50c878" :
    "rgba(255,255,255,0.05)";

  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "0.85rem", position: "relative", overflow: "hidden", transition: "border-color 0.3s, background 0.3s" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: barColor, borderRadius: "12px 0 0 12px", transition: "background 0.3s" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#ff8c32", opacity: 0.7 }}>{num}</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#f0ebe0" }}>{title}</span>
        <span style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: state === "active" ? "#ff8c32" : state === "done" ? "#50c878" : "#555", display: "flex", alignItems: "center", gap: 5 }}>
          {state === "active" && <Spinner />}
          {state === "active" ? "RUNNING" : state === "done" ? "✓ DONE" : "WAITING"}
        </span>
      </div>
      <div style={{ fontSize: "0.76rem", color: "#706860", marginTop: "0.25rem" }}>{desc}</div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 9, height: 9,
      border: "2px solid rgba(255,140,50,0.3)", borderTopColor: "#ff8c32",
      borderRadius: "50%", animation: "rm-spin 0.7s linear infinite"
    }} />
  );
}

// ── Collapsible raw output ────────────────────────────────────────────────────
function RawExpander({ label, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: "0.8rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", textAlign: "left", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: open ? "9px 9px 0 0" : 9, color: "#a09890", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", padding: "0.6rem 0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
      >
        <span style={{ fontSize: "0.7rem", transform: open ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>▶</span>
        {label}
      </button>
      {open && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none", borderRadius: "0 0 9px 9px", padding: "1rem", fontSize: "0.82rem", lineHeight: 1.75, color: "#cdc8bf", whiteSpace: "pre-wrap", maxHeight: 220, overflowY: "auto" }}>
          {content}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const STEPS = ["search", "reader", "writer", "critic"];
const STEP_META = [
  { num: "01", title: "Search Agent",  desc: "Gathers recent web information" },
  { num: "02", title: "Reader Agent",  desc: "Scrapes & extracts deep content" },
  { num: "03", title: "Writer Chain",  desc: "Drafts the full research report" },
  { num: "04", title: "Critic Chain",  desc: "Reviews & scores the report" },
];

function App()  {
  const [topic, setTopic] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  
  // FIX 1: Initialize step states state hook
  const [stepStates, setStepStates] = useState({
    search: "wait",
    reader: "wait",
    writer: "wait",
    critic: "wait",
  });

  const setStep = (step, state) =>
    setStepStates((prev) => ({ ...prev, [step]: state }));

  const runPipeline = async () => {
    if (!topic.trim() || running) return;

    try {
      setRunning(true);
      setResults({});
      
      // Reset all steps to active/waiting state cycle
      STEPS.forEach(s => setStep(s, "wait"));

      const API_URL = import.meta.env.VITE_API_URL;
      
      // FIX 2: Wrap topic in an object matching your FastAPI dict schema
      const response = await axios.post(
        `${API_URL}/research`,
        { topic: topic.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResults(response.data);
    } catch (error) {
      console.error("Pipeline Error:", error);
      alert(
        error.response?.data?.detail ||
        "Failed to connect to FastAPI backend"
      );
    } finally {
      setRunning(false);
    }
  };

  const downloadReport = () => {
    if (!results.writer) return;
    const blob = new Blob([results.writer], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `research_report_${Date.now()}.md`;
    a.click();
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes rm-spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0a0a0f;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(255,140,50,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(255,80,30,0.08) 0%, transparent 55%);
          min-height: 100vh;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
        }
        ::placeholder { color: #555 !important; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 2rem 4rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "3rem 0 2rem" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#ff8c32", marginBottom: "0.8rem" }}>
            Multi-Agent AI System
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 800, color: "#f0ebe0", lineHeight: 1, marginBottom: "0.7rem" }}>
            MultiMind<span style={{ color: "#ff8c32" }}>AI</span>
          </h1>
          <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "#a09890", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            Four specialized AI agents collaborate — searching, reading, writing, and critiquing — to deliver a polished research report on any topic.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,140,50,0.35),transparent)", margin: "1.2rem 0" }} />

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>

          {/* Left — Input */}
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,140,50,0.15)", borderRadius: 14, padding: "1.5rem 1.8rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff8c32", marginBottom: "0.6rem" }}>
                Research Topic
              </div>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runPipeline()}
                placeholder="e.g. Quantum computing breakthroughs in 2025"
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,140,50,0.25)", borderRadius: 9, color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", padding: "0.65rem 0.9rem", outline: "none", marginBottom: "1rem", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "#ff8c32")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,140,50,0.25)")}
              />
              <button
                onClick={runPipeline}
                disabled={running || !topic.trim()}
                style={{ width: "100%", background: running ? "rgba(255,140,50,0.4)" : "linear-gradient(135deg,#ff8c32,#ff5a1a)", color: "#0a0a0f", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.04em", border: "none", borderRadius: 9, padding: "0.7rem 1rem", cursor: running ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(255,140,50,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {running && <Spinner />}
                {running ? "Running Pipeline…" : "⚡ Run Research Pipeline"}
              </button>

            </div>
          </div>

          {/* Right — Pipeline */}
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0ebe0", marginBottom: "1rem" }}>Pipeline</div>
            {STEP_META.map((meta, idx) => (
              <StepCard
                key={meta.num}
                num={meta.num}
                title={meta.title}
                desc={meta.desc}
                state={
                  running
                    ? stepStates[STEPS[idx]]
                    : results.writer
                    ? "done"
                    : "wait"
                }
              />
            ))}
          </div>
        </div>

        {/* Results */}
        {hasResults && (
          <>
            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,140,50,0.35),transparent)", margin: "2rem 0 1rem" }} />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0ebe0", marginBottom: "1rem" }}>Results</div>

            {results.reader && <RawExpander label="📄 Scraped Content (raw)" content={results.reader} />}

            {results.writer && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,140,50,0.2)", borderRadius: 14, padding: "1.5rem 1.8rem", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff8c32", paddingBottom: "0.7rem", borderBottom: "1px solid rgba(255,140,50,0.15)", marginBottom: "1rem" }}>
                  📝 Final Research Report
                </div>
                <MdContent text={results.writer} />
                <button
                  onClick={downloadReport}
                  style={{ marginTop: "1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,140,50,0.3)", borderRadius: 9, color: "#ff8c32", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.82rem", padding: "0.55rem 1.2rem", cursor: "pointer" }}
                >
                  ⬇ Download Report (.md)
                </button>
              </div>
            )}

            {results.critic && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(80,200,120,0.2)", borderRadius: 14, padding: "1.5rem 1.8rem", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#50c878", paddingBottom: "0.7rem", borderBottom: "1px solid rgba(80,200,120,0.15)", marginBottom: "1rem" }}>
                  🧐 Critic Feedback
                </div>
                <MdContent text={results.critic} />
              </div>
            )}
          </>
        )}

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#605850", textAlign: "center", marginTop: "2.5rem", letterSpacing: "0.08em" }}>
          ResearchMind · Powered by Claude API · Built with React
        </div>
      </div>
    </>
  );
}

export default App
