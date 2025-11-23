import React from "react";

type ConstantSettingsSectionProps = {
  clampedCps: number;
  clicksPerSecond: number;
  onClicksPerSecondChange: (value: number) => void;
  intervalMs: number;
};

export const ConstantSettingsSection: React.FC<ConstantSettingsSectionProps> = ({
  clampedCps,
  clicksPerSecond,
  onClicksPerSecondChange,
  intervalMs,
}) => (
  <section className="section">
    <h2 className="section-title">Click Speed</h2>

    <div className="field-row">
      <label className="field-label">Speed</label>
      <div className="field-column" style={{ width: "100%" }}>
        <div className="field-inline" style={{ width: "100%" }}>
          <input
            type="range"
            min={1}
            max={20}
            value={clampedCps}
            onChange={(e) =>
              onClicksPerSecondChange(
                Math.min(20, Math.max(1, Number(e.target.value) || 1)),
              )
            }
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min={1}
            max={20}
            value={clicksPerSecond}
            onChange={(e) =>
              onClicksPerSecondChange(
                Math.min(20, Math.max(1, Number(e.target.value) || 1)),
              )
            }
            className="input input-inline"
          />
          <span className="suffix">CPS</span>
        </div>
        <span className="hint">≈ {intervalMs} ms between clicks</span>
      </div>
    </div>
  </section>
);
