import React from "react";

type FooterProps = {
  lastRunSeconds: number;
  totalClicks: number;
};

export const Footer: React.FC<FooterProps> = ({
  lastRunSeconds,
  totalClicks,
}) => (
  <footer className="footer">
    <span className="footer-text">Last run: {lastRunSeconds.toFixed(1)} s</span>
    <span className="footer-text">Total clicks: {totalClicks}</span>
  </footer>
);
