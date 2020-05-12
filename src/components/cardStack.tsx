import React from "react";

export const CardStack: React.FC<{ style?: React.CSSProperties }> = ({ style, children }) => {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column-reverse",
    justifySelf: "stretch",
    alignItems: "center",
  };

  return <div style={{ ...flexStyle, ...style }}>{children}</div>;
};
