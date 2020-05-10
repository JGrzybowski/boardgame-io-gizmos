import React from "react";

interface SingleCounterProps {
  text: number | string;
  textX?: number | string;
  textY?: number | string;
  textOffsetX?: number | string;
  textOffsetY?: number | string;
  imageX: number | string;
  imageY: number | string;
  icon: "archive" | "research" | "storage";
}

export const SingleCounter: React.FC<SingleCounterProps> = (props) => {
  const { text, textOffsetX, textOffsetY, imageX, imageY, icon } = props;

  const iconSrc =
    icon === "archive"
      ? "images/file-limit.svg"
      : icon === "research"
      ? "images/research-limit.svg"
      : icon === "storage"
      ? "images/storage-limit.svg"
      : "";

  const textX = props.textX ?? Number(imageX) + Number(textOffsetX);
  const textY = props.textY ?? Number(imageY) + Number(textOffsetY);

  return (
    <>
      <image x={imageX} y={imageY} height="80" href={iconSrc} />
      <text x={textX} y={textY} className="numeric-value" style={{ fontSize: "xxx-large" }}>
        {text}
      </text>
    </>
  );
};
