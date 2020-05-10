import React, { MouseEventHandler } from "react";
import { CardInfo } from "../cards/cardInfo";
import { CardImage } from "./cardImage";

export const Card: React.FC<
  CardInfo & {
    OnArchiveButtonClick?: MouseEventHandler<HTMLImageElement>;
    OnBuildButtonClick?: MouseEventHandler<HTMLImageElement>;
    OnPickButtonClick?: MouseEventHandler<HTMLImageElement>;
    OnConvertButtonClick?: MouseEventHandler<HTMLImageElement>;
  }
> = ({
  type,
  victoryPoints,
  level,
  color,
  cost,
  cardId,
  effect,
  oneTimeEffect,
  OnArchiveButtonClick,
  OnBuildButtonClick,
  OnPickButtonClick,
  OnConvertButtonClick,
}) => (
  <div className="card has-action-buttons">
    <CardImage viewBoxHeight="136.83" {...{ type, victoryPoints, level, color, cost, cardId, effect, oneTimeEffect }} />
    {(OnArchiveButtonClick || OnBuildButtonClick || OnPickButtonClick || OnConvertButtonClick) && (
      <div className="action-buttons">
        {OnArchiveButtonClick && (
          <img src="images/button-archive.svg" alt="File Action Button" onClick={OnArchiveButtonClick} />
        )}
        {OnPickButtonClick && <img src="images/button-pick.svg" alt="File Action Button" onClick={OnPickButtonClick} />}
        {OnBuildButtonClick && (
          <img src="images/button-build.svg" alt="Build Action Button" onClick={OnBuildButtonClick} />
        )}
        {OnConvertButtonClick && (
          <img src="images/button-convert.svg" alt="File Action Button" onClick={OnConvertButtonClick} />
        )}
      </div>
    )}
  </div>
);

export const MiniCard: React.FC<CardInfo & { OnActivateButtonClick?: MouseEventHandler<HTMLImageElement> }> = ({
  type,
  victoryPoints,
  level,
  color,
  cost,
  cardId,
  effect,
  oneTimeEffect,
  OnActivateButtonClick,
}) => (
  <div className="card mini-card has-action-buttons">
    <CardImage viewBoxHeight="36.25" {...{ type, victoryPoints, level, color, cost, cardId, effect, oneTimeEffect }} />
    {OnActivateButtonClick && (
      <div className="action-buttons">
        <img src="images/button-activate.svg" alt="File Action Button" onClick={OnActivateButtonClick} />
      </div>
    )}
  </div>
);
