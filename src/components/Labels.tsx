import React from "react";
import { Label } from "../store/helpers/listEnhancedPullRequests";

export const Labels: React.FC<{ labels: Label[] }> = ({ labels }) => {
  const labelElements = labels.map(({ name, color }, idx) => (
    <span key={idx} style={{ fontSize: "10px" }}>
      <aha-pill color={"#" + color}>{name}</aha-pill>
    </span>
  ));

  return (
    <aha-flex wrap="wrap" gap="5px">
      {labelElements}
    </aha-flex>
  );
};
