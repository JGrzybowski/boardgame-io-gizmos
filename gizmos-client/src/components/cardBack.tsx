import React, { MouseEventHandler } from "react";
import { CardLevel } from "../cards/cardInfo";

export const CardBack: React.FC<{ level: CardLevel; onClick?: MouseEventHandler<HTMLImageElement> }> = ({
  level,
  onClick,
}) => {
  return (
    <div className="card">
      <img src={`images/card-back-${level}.svg`} alt={`card level ${level} back`} style={{ gridArea: "1/1/2/2" }} />
      {onClick && (
        <div className="cardAction">
          <img src="images/button-research.svg" alt="Research button icon" onClick={onClick} />
        </div>
      )}
    </div>
  );
};
