import React from "react";
import { ReactComponent as Logo } from "../logo.svg";

interface ActionButtonProps {
  actionName: string;
  desctiption: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ actionName, desctiption }) => {
  const buttonStyle = {
    display: "grid",
    "grid-template-columns": "2fr 5fr",
    "grid-template-rows": "1fr",
    gap: "5px",
    gridTemplateAreas: ` "icon-area button-header" "icon-area text"`,
    width: "80%",
    border: "1px solid lightgray",
    borderRadius: "15px 15px 0 0",
    backgroundColor: "beige",
  };

  const headerStyle = {
    justifySelf: "right",
    alignSelf: "center",
    marginRight: "15px",
    gridArea: "button-header",
    fontSize: "xx-large",
  };

  const descriptionStyle = {
    margin: "0 4px",
    "text-align": "justify",
    gridArea: "text",
    fontSize: "smaller",
  };

  return (
    <div style={buttonStyle}>
      <Logo style={{ marginLeft: "10px", width: "100%", placeSelf: "center", gridArea: "icon-area" }} />
      <h1 style={headerStyle}>{actionName}</h1>
      {/* <p style={descriptionStyle}>{desctiption}</p> */}
    </div>
  );
};
