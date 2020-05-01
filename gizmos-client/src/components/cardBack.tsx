import React from "react";
import { CardLevel } from "../cards/card";

export const CardBack: React.FC<{ level: CardLevel }> = ({ level }) => {
  return (
    <div className="card">
      <img src={`images/card-back-${level}.svg`} alt={`card level ${level} back`} />
    </div>
  );
};
