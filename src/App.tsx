import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import "./App.css";

import { Header } from "./components/Header";
import { StartStopButton } from "./components/StartStopButton";
import { PatternSection } from "./components/PatternSection";
import { ConstantSettingsSection } from "./components/ConstantSettingsSection";
import { JitterSettingsSection } from "./components/JitterSettingsSection";
import { RunModeSection } from "./components/RunModeSection";
import { LocationSection } from "./components/LocationSection";
import { BehaviorSection } from "./components/BehaviorSection";
import { Footer } from "./components/Footer";

import type {
  Mode,
  LocationMode,
  ButtonType,
  ClickType,
  Pattern,
} from "./types/common";

function App() {
  const [isRunning, setIsRunning] = useState(false);

  const [pattern, setPattern] = useState<Pattern>("constant");

  const [clicksPerSecond, setClicksPerSecond] = useState(10);
  const [mode, setMode] = useState<Mode>("until-stopped");
  const [repeatCount, setRepeatCount] = useState(100);

  const [jitterMinMinutes, setJitterMinMinutes] = useState(5);
  const [jitterMaxMinutes, setJitterMaxMinutes] = useState(10);

  const [button, setButton] = useState<ButtonType>("left");
  const [clickType, setClickType] = useState<ClickType>("single");

  const [locationMode, setLocationMode] = useState<LocationMode>("cursor");
  const [fixedX, setFixedX] = useState(850);
  const [fixedY, setFixedY] = useState(420);

  const [startDelaySec, setStartDelaySec] = useState(3);
  const [showInMenubar, setShowInMenubar] = useState(true);

  const [lastRunSeconds, setLastRunSeconds] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const clampedCps = useMemo(
    () => Math.min(20, Math.max(1, clicksPerSecond)),
    [clicksPerSecond],
  );
  const intervalMs = useMemo(
    () => Math.round(1000 / clampedCps),
    [clampedCps],
  );

  const statusLabel = isRunning ? "Running" : "Ready";
  const statusDotColor = isRunning ? "#22c55e" : "#9ca3af";

  const startWithConfig = async () => {
    const minMsRaw = Math.round(jitterMinMinutes * 60_000);
    const maxMsRaw = Math.round(jitterMaxMinutes * 60_000);

    const jitterMinMs = Math.max(1000, Math.min(minMsRaw, maxMsRaw));
    const jitterMaxMs = Math.max(1000, Math.max(minMsRaw, maxMsRaw));

    const config = {
      pattern,
      clicks_per_second: clampedCps,
      jitter_min_ms: jitterMinMs,
      jitter_max_ms: jitterMaxMs,
      mode,
      repeat_count: repeatCount,
      button,
      click_type: clickType,
      location_mode: locationMode,
      fixed_x: fixedX,
      fixed_y: fixedY,
      start_delay_sec: startDelaySec,
    };

    try {
      await invoke("start_clicking", { config });
      setIsRunning(true);
    } catch (e) {
      console.error("Failed to start_clicking:", e);
    }
  };

  const stopClicking = async () => {
    try {
      await invoke("stop_clicking");
    } catch (e) {
      console.error("Failed to stop_clicking:", e);
    }
    setIsRunning(false);
    setLastRunSeconds(12.3);
    setTotalClicks((p) => p + 1240);
  };

  const handleToggle = async () => {
    if (isRunning) await stopClicking();
    else await startWithConfig();
  };

  useEffect(() => {
    async function setupShortcuts() {
      try {
        await register("Command+Option+S", handleToggle);
      } catch (e) {
        console.error("Failed to register global shortcuts:", e);
      }
    }

    setupShortcuts();

    return () => {
      unregisterAll().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container auto-clicker">
      <Header
        hotkeyLabel="⌘ ⌥ S"
        statusLabel={statusLabel}
        statusDotColor={statusDotColor}
      />

      <StartStopButton isRunning={isRunning} onToggle={handleToggle} />

      <PatternSection pattern={pattern} onChange={setPattern} />

      {pattern === "constant" && (
        <ConstantSettingsSection
          clampedCps={clampedCps}
          clicksPerSecond={clicksPerSecond}
          onClicksPerSecondChange={setClicksPerSecond}
          intervalMs={intervalMs}
        />
      )}

      {pattern === "jitter" && (
        <JitterSettingsSection
          jitterMinMinutes={jitterMinMinutes}
          jitterMaxMinutes={jitterMaxMinutes}
          onMinChange={setJitterMinMinutes}
          onMaxChange={setJitterMaxMinutes}
        />
      )}

      <RunModeSection
        mode={mode}
        repeatCount={repeatCount}
        onModeChange={setMode}
        onRepeatCountChange={setRepeatCount}
      />

      <LocationSection
        locationMode={locationMode}
        fixedX={fixedX}
        fixedY={fixedY}
        onLocationModeChange={setLocationMode}
        onFixedXChange={setFixedX}
        onFixedYChange={setFixedY}
        button={button}
        clickType={clickType}
        onButtonChange={setButton}
        onClickTypeChange={setClickType}
      />

      <BehaviorSection
        startDelaySec={startDelaySec}
        showInMenubar={showInMenubar}
        onStartDelayChange={setStartDelaySec}
        onShowInMenubarChange={setShowInMenubar}
      />

      <Footer
        lastRunSeconds={lastRunSeconds}
        totalClicks={totalClicks}
      />
    </main>
  );
}

export default App;
