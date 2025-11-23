import React from "react";
import type { LocationMode, ButtonType, ClickType } from "../types/common";

type LocationSectionProps = {
  locationMode: LocationMode;
  fixedX: number;
  fixedY: number;
  onLocationModeChange: (mode: LocationMode) => void;
  onFixedXChange: (value: number) => void;
  onFixedYChange: (value: number) => void;
  button: ButtonType;
  clickType: ClickType;
  onButtonChange: (b: ButtonType) => void;
  onClickTypeChange: (c: ClickType) => void;
};

export const LocationSection: React.FC<LocationSectionProps> = ({
  locationMode,
  fixedX,
  fixedY,
  onLocationModeChange,
  onFixedXChange,
  onFixedYChange,
  button,
  clickType,
  onButtonChange,
  onClickTypeChange,
}) => (
  <>
    <section className="section">
      <h2 className="section-title">Click Button</h2>
      <div className="field-row">
        <label className="field-label">Button</label>
        <div className="field-inline">
          <select
            value={button}
            onChange={(e) => onButtonChange(e.target.value as ButtonType)}
            className="select"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="middle">Middle</option>
          </select>
          <select
            value={clickType}
            onChange={(e) => onClickTypeChange(e.target.value as ClickType)}
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
            onChange={() => onLocationModeChange("cursor")}
          />
          <span>Current mouse position</span>
        </label>

        <label className="radio-row">
          <input
            type="radio"
            name="location"
            value="fixed"
            checked={locationMode === "fixed"}
            onChange={() => onLocationModeChange("fixed")}
          />
          <span>
            Fixed:{" "}
            <input
              type="number"
              value={fixedX}
              disabled={locationMode !== "fixed"}
              onChange={(e) => onFixedXChange(Number(e.target.value) || 0)}
              className="input input-inline"
            />{" "}
            ,{" "}
            <input
              type="number"
              value={fixedY}
              disabled={locationMode !== "fixed"}
              onChange={(e) => onFixedYChange(Number(e.target.value) || 0)}
              className="input input-inline"
            />
          </span>
        </label>
      </div>
    </section>
  </>
);
