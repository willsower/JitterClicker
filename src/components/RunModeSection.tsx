import React from "react";
import type { Mode } from "../types/common";

type RunModeSectionProps = {
  mode: Mode;
  repeatCount: number;
  onModeChange: (mode: Mode) => void;
  onRepeatCountChange: (value: number) => void;
};

export const RunModeSection: React.FC<RunModeSectionProps> = ({
  mode,
  repeatCount,
  onModeChange,
  onRepeatCountChange,
}) => (
  <section className="section">
    <h2 className="section-title">Run Mode</h2>
    <div className="field-row">
      <label className="field-label">Mode</label>
      <div className="field-column">
        <label className="radio-row">
          <input
            type="radio"
            name="mode"
            value="until-stopped"
            checked={mode === "until-stopped"}
            onChange={() => onModeChange("until-stopped")}
          />
          <span>Until stopped</span>
        </label>
        <label className="radio-row">
          <input
            type="radio"
            name="mode"
            value="repeat"
            checked={mode === "repeat"}
            onChange={() => onModeChange("repeat")}
          />
          <span>
            Repeat{" "}
            <input
              type="number"
              min={1}
              value={repeatCount}
              disabled={mode !== "repeat"}
              onChange={(e) =>
                onRepeatCountChange(Math.max(1, Number(e.target.value) || 1))
              }
              className="input input-inline"
            />{" "}
            times
          </span>
        </label>
      </div>
    </div>
  </section>
);
