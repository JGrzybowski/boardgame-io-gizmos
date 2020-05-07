import React, { MouseEventHandler } from "react";
import { CardLevel } from "../cards/cardInfo";

export const CardBack: React.FC<{ level: CardLevel; onClick?: MouseEventHandler<HTMLImageElement> }> = ({
  level,
  onClick,
}) => {
  return (
    <div className="card has-action-buttons">
      <img src={`images/card-back-${level}.svg`} alt={`card level ${level} back`} />
      {onClick && (
        <div className="action-buttons">
          <img src="images/button-research.svg" alt="Research button icon" onClick={onClick} />
        </div>
      )}
    </div>
  );
};
