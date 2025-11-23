import React from "react";

type StartStopButtonProps = {
  isRunning: boolean;
  onToggle: () => void | Promise<void>;
};

export const StartStopButton: React.FC<StartStopButtonProps> = ({
  isRunning,
  onToggle,
}) => (
  <section className="section">
    <button
      className={`primary-button ${isRunning ? "stop" : "start"}`}
      onClick={() => void onToggle()}
    >
      {isRunning ? "Stop Clicking" : "Start Clicking"}
    </button>
  </section>
);
