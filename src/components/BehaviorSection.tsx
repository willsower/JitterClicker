import React from "react";

type BehaviorSectionProps = {
  startDelaySec: number;
  showInMenubar: boolean;
  onStartDelayChange: (value: number) => void;
  onShowInMenubarChange: (value: boolean) => void;
};

export const BehaviorSection: React.FC<BehaviorSectionProps> = ({
  startDelaySec,
  showInMenubar,
  onStartDelayChange,
  onShowInMenubarChange,
}) => (
  <section className="section">
    <h2 className="section-title">Behavior</h2>

    <div className="field-row">
      <label className="field-label">Start delay</label>
      <div className="field-inline">
        <input
          type="number"
          min={0}
          value={startDelaySec}
          onChange={(e) =>
            onStartDelayChange(Math.max(0, Number(e.target.value) || 0))
          }
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
          onChange={(e) => onShowInMenubarChange(e.target.checked)}
        />
        <span>Show in menu bar</span>
      </label>
    </div>
  </section>
);
