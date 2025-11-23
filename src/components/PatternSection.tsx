import React from "react";
import type { Pattern } from "../types/common";

type PatternSectionProps = {
  pattern: Pattern;
  onChange: (pattern: Pattern) => void;
};

export const PatternSection: React.FC<PatternSectionProps> = ({
  pattern,
  onChange,
}) => (
  <section className="section">
    <h2 className="section-title">Click Pattern</h2>
    <div className="field-column">
      <label className="radio-row">
        <input
          type="radio"
          name="pattern"
          value="constant"
          checked={pattern === "constant"}
          onChange={() => onChange("constant")}
        />
        <span>Constant speed</span>
      </label>

      <label className="radio-row">
        <input
          type="radio"
          name="pattern"
          value="jitter"
          checked={pattern === "jitter"}
          onChange={() => onChange("jitter")}
        />
        <span>Jitter (random timed clicks)</span>
      </label>
    </div>
  </section>
);
