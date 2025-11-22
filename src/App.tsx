import { useMemo, useState } from "react";
import "./App.css";

type Mode = "until-stopped" | "repeat";
type LocationMode = "cursor" | "fixed";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(100);
  const [mode, setMode] = useState<Mode>("until-stopped");
  const [repeatCount, setRepeatCount] = useState(100);
  const [button, setButton] = useState<"left" | "right" | "middle">("left");
  const [clickType, setClickType] = useState<"single" | "double">("single");
  const [locationMode, setLocationMode] = useState<LocationMode>("cursor");
  const [fixedX, setFixedX] = useState(850);
  const [fixedY, setFixedY] = useState(420);
  const [startDelaySec, setStartDelaySec] = useState(3);
  const [showInMenubar, setShowInMenubar] = useState(true);
  const [stopOnEsc, setStopOnEsc] = useState(true);
  const [lastRunSeconds, setLastRunSeconds] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const cps = useMemo(() => (intervalMs > 0 ? 1000 / intervalMs : 0), [intervalMs]);

  const statusLabel = isRunning ? "Running" : "Ready";
  const statusDotColor = isRunning ? "#22c55e" : "#9ca3af";

  const handleToggle = () => {
    if (isRunning) {
      console.log("Stop clicking");
      setIsRunning(false);
      setLastRunSeconds(12.3);
      setTotalClicks((prev) => prev + 1240);
    } else {
      console.log("Start clicking with settings:", {
        intervalMs,
        mode,
        repeatCount,
        button,
        clickType,
        locationMode,
        fixedX,
        fixedY,
        startDelaySec,
        showInMenubar,
        stopOnEsc,
      });
      setIsRunning(true);
    }
  };

  return (
    <main className="container auto-clicker">
      <header className="header">
        <div className="title-row">
          <h1>JitterClicker</h1>
          <span className="hotkey-pill">⌘ ⌥ S</span>
        </div>

        <div className="status-row">
          <span
            className="status-dot"
            style={{ backgroundColor: statusDotColor }}
          />
          <span className="status-text">{statusLabel}</span>
        </div>
      </header>

      <section className="section">
        <button
          className={`primary-button ${isRunning ? "stop" : "start"}`}
          onClick={handleToggle}
        >
          {isRunning ? "Stop Clicking" : "Start Clicking"}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title">Click Settings</h2>

        <div className="field-row">
          <label className="field-label">Interval</label>
          <div className="field-inline">
            <input
              type="number"
              min={1}
              value={intervalMs}
              onChange={(e) => setIntervalMs(Number(e.target.value) || 1)}
              className="input"
            />
            <span className="suffix">ms</span>
            <span className="hint">≈ {cps.toFixed(1)} CPS</span>
          </div>
        </div>

        <div className="field-row">
          <label className="field-label">Mode</label>
          <div className="field-column">
            <label className="radio-row">
              <input
                type="radio"
                name="mode"
                value="until-stopped"
                checked={mode === "until-stopped"}
                onChange={() => setMode("until-stopped")}
              />
              <span>Until stopped</span>
            </label>
            <label className="radio-row">
              <input
                type="radio"
                name="mode"
                value="repeat"
                checked={mode === "repeat"}
                onChange={() => setMode("repeat")}
              />
              <span>
                Repeat{" "}
                <input
                  type="number"
                  min={1}
                  value={repeatCount}
                  disabled={mode !== "repeat"}
                  onChange={(e) => setRepeatCount(Number(e.target.value) || 1)}
                  className="input input-inline"
                />{" "}
                times
              </span>
            </label>
          </div>
        </div>

        <div className="field-row">
          <label className="field-label">Button</label>
          <div className="field-inline">
            <select
              value={button}
              onChange={(e) => setButton(e.target.value as typeof button)}
              className="select"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="middle">Middle</option>
            </select>
            <select
              value={clickType}
              onChange={(e) =>
                setClickType(e.target.value as typeof clickType)
              }
              className="select"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Location</h2>

        <div className="field-column">
          <label className="radio-row">
            <input
              type="radio"
              name="location"
              value="cursor"
              checked={locationMode === "cursor"}
              onChange={() => setLocationMode("cursor")}
            />
            <span>Current mouse position</span>
          </label>

          <label className="radio-row">
            <input
              type="radio"
              name="location"
              value="fixed"
              checked={locationMode === "fixed"}
              onChange={() => setLocationMode("fixed")}
            />
            <span>
              Fixed point:{" "}
              <input
                type="number"
                value={fixedX}
                disabled={locationMode !== "fixed"}
                onChange={(e) => setFixedX(Number(e.target.value) || 0)}
                className="input input-inline"
              />{" "}
              ,{" "}
              <input
                type="number"
                value={fixedY}
                disabled={locationMode !== "fixed"}
                onChange={(e) => setFixedY(Number(e.target.value) || 0)}
                className="input input-inline"
              />{" "}
              <button
                type="button"
                className="secondary-button"
                disabled={locationMode !== "fixed"}
                onClick={() => {
                  console.log("Pick fixed point not implemented yet");
                }}
              >
                Pick
              </button>
            </span>
          </label>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Behavior</h2>

        <div className="field-row">
          <label className="field-label">Start delay</label>
          <div className="field-inline">
            <input
              type="number"
              min={0}
              value={startDelaySec}
              onChange={(e) => setStartDelaySec(Number(e.target.value) || 0)}
              className="input"
            />
            <span className="suffix">s</span>
          </div>
        </div>

        <div className="field-column">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={showInMenubar}
              onChange={(e) => setShowInMenubar(e.target.checked)}
            />
            <span>Show in menu bar</span>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={stopOnEsc}
              onChange={(e) => setStopOnEsc(e.target.checked)}
            />
            <span>Stop on ESC</span>
          </label>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-text">
          Last run: {lastRunSeconds.toFixed(1)} s
        </span>
        <span className="footer-text">Total clicks: {totalClicks}</span>
      </footer>
    </main>
  );
}

export default App;
