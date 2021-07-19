import React from "react";

export const Avatar: React.FC<{ src: string; size: number }> = ({
  src,
  size,
}) => (
  <img
    src={src}
    alt="avatar"
    style={{
      borderRadius: "50%",
      maxWidth: `${size}px`,
      maxHeight: `${size}px`,
    }}
  />
);
