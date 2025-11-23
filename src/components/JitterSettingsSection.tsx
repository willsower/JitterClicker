import React from "react";

type JitterSettingsSectionProps = {
  jitterMinMinutes: number;
  jitterMaxMinutes: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
};

export const JitterSettingsSection: React.FC<JitterSettingsSectionProps> = ({
  jitterMinMinutes,
  jitterMaxMinutes,
  onMinChange,
  onMaxChange,
}) => (
  <section className="section">
    <h2 className="section-title">Jitter Timing</h2>

    <div className="field-row">
      <label className="field-label">Delay range</label>
      <div className="field-inline">
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={jitterMinMinutes}
          onChange={(e) =>
            onMinChange(Math.max(0.1, Number(e.target.value) || 0.1))
          }
          className="input input-inline"
        />
        <span className="suffix">min</span>
        <span style={{ margin: "0 4px" }}>to</span>
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={jitterMaxMinutes}
          onChange={(e) =>
            onMaxChange(Math.max(0.1, Number(e.target.value) || 0.1))
          }
          className="input input-inline"
        />
        <span className="suffix">min</span>
      </div>
    </div>

    <p className="hint">
      It will click once at a random time in this range, then again using a new
      random delay from the last click.
    </p>
  </section>
);
