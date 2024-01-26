import React from "react";

type TooltipProps = {
  value: number;
};

const Tooltip: React.FC<TooltipProps> = ({ value }) => (
  <div
    style={{
      position: "absolute",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      padding: "8px",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
    }}
  >
    {value}
  </div>
);

export default Tooltip;
