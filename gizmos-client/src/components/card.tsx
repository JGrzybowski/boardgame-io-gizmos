import React from "react";
import { Card as CardInfo } from "../cards/card";

export const Card: React.FC<{ CardInfo: CardInfo }> = (cardInfo) => {
  const colors = {
    "frame-general": "#a4a4a3", //gray, can also be beige for III lvl cards
    "frame-accent": "#be1f23", //red can be also one of RUBY or Any (mixed)
    illustration: "#fff",
    "cost-circle": "#e4d7a1",
    "cost-accent": "#d92730", //red can be also one of RUBY or Any (mixed)
    "trigger-filter-box": "#747471", //gray, can also be beige for III lvl cards
    "upper-corner": "#cfcdcc", //gray, can also be beige for III lvl cards
  };

  const numbersStyle = {
    "font-size": "large",
    "font-family": "source-code-pro,monospace",
    "font-weight": "bold",
    fill: "black",
  };

  return (
    <div style={{ height: "200px", width: "200px", margin: "auto" }}>
      <svg viewBox="15 12.5 136.63 136.63">
        <defs>
          <clipPath id="clip-path">
            <rect fill="none" x="15" y="12.25" width="136.62" height="136.63" rx="9.19" ry="9.19" />
          </clipPath>
        </defs>
        <title>Gizmos-card</title>
        <rect
          style={{ fill: colors["frame-general"] }}
          x="15"
          y="12.25"
          width="136.62"
          height="136.63"
          rx="9.19"
          ry="9.19"
        />
        <path
          style={{ fill: colors["frame-accent"] }}
          d="M128.25,120.9h-6.37v5.84H28.67c.28-.55,4.43-9,0-15.75a13.1,13.1,0,0,0-4.75-4.25c3.32-5.67,2.4-12.65-1.88-16.66-5.11-4.8-12.32-2.86-12.67-2.76l0-19.69H0v59.8a9.22,9.22,0,0,0,9.19,9.19H127.44a9.22,9.22,0,0,0,9.19-9.19V67.64h-8.38Z"
          transform="translate(15 12.25)"
        />
        <path
          style={{ fill: colors.illustration }}
          d="M12.75,36.25h112V118.5h-6V124l-86.66.66c.38-1.32,2.82-10.41-2.39-16.15a11.88,11.88,0,0,0-2.78-2.24c3-6.65,1.72-14.09-3-18.27-4.39-3.91-10-3.46-11.21-3.34Z"
          transform="translate(15 12.25)"
        />
        <circle style={{ fill: colors["cost-circle"] }} cx="32.25" cy="130.75" r="9.5" />
        <circle style={{ fill: colors["cost-accent"] }} cx="30" cy="111.08" r="7.25" />
        <polygon
          style={{ fill: colors["trigger-filter-box"] }}
          points="27.75 44.75 83.75 44.75 89.25 32.75 74.5 18 27.75 18 27.75 44.75"
        />
        <g clip-path="url(#clip-path)">
          <ellipse style={{ fill: colors["upper-corner"] }} cx="23.25" cy="20.25" rx="23.25" ry="20.25" />
          <ellipse style={{ fill: colors["upper-corner"] }} cx="147.5" cy="21.25" rx="23.25" ry="20.25" />
        </g>

        <text x="20" y="30" style={numbersStyle}>
          Ar
        </text>
        <text x="130" y="30" style={numbersStyle}>
          4V
        </text>
        <text x="27.5" y="136.25" style={numbersStyle}>
          8
        </text>
        <text x="25.3" y="115.3" fill="pink">
          O
        </text>
      </svg>
    </div>
  );
};
