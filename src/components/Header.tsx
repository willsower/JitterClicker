import React from "react";

type HeaderProps = {
  hotkeyLabel: string;
  statusLabel: string;
  statusDotColor: string;
};

export const Header: React.FC<HeaderProps> = ({
  hotkeyLabel,
  statusLabel,
  statusDotColor,
}) => (
  <header className="header">
    <div className="title-row">
      <h1>JitterClicker</h1>
      <span className="hotkey-pill">{hotkeyLabel}</span>
    </div>
    <div className="status-row">
      <span className="status-dot" style={{ backgroundColor: statusDotColor }} />
      <span className="status-text">{statusLabel}</span>
    </div>
  </header>
);
