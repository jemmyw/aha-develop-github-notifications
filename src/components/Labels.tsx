import React from "react";
import Color from "color";
import { Label } from "../store/helpers/listEnhancedPullRequests";

export const Labels: React.FC<{ labels: Label[] }> = ({ labels }) => {
  const labelElements = labels.map(({ name, color }, idx) => {
    const colorObj = new Color("#" + color);
    return (
      <span
        key={idx}
        style={{
          fontSize: "10px",
          position: "relative",
          backgroundColor: colorObj.hex(),
          color: colorObj.isDark() ? "white" : "black",
          display: "inline-flex",
          alignItems: "baseline",
          padding: "0.1em 0.75em 0.2em",
          borderRadius: "4px",
          lineHeight: 1.5,
        }}
      >
        {name}
      </span>
    );
  });

  return (
    <aha-flex wrap="wrap" gap="5px">
      {labelElements}
    </aha-flex>
  );
};
