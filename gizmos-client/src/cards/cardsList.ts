import { Card, TriggerType, CostColor } from "./card";
import { CardWithFileEffect, fileEffect } from "./cardWithFileEffect";
import { CardWithTakeEnergyEffect } from "./cardWithTakeEnergyEffect";

export const InitialCard = new CardWithTakeEnergyEffect(
  /*CardId */ 1,
  /*Trigger Type*/ TriggerType.File,
  /*How many energy*/ 1,
  /*victoryPoints*/ 2,
  /*Cost color*/ CostColor.Red,
  /*Cost amount*/ 2,
  /*Card level*/ 0
);

const Level_I_cards: Array<Card> = [
  new CardWithFileEffect(
    1,
    TriggerType.File,
    fileEffect,
    2,
    CostColor.Red,
    2,
    1
  )
];
//const Level_II_cards = Array(36).fill(Card());
//const Level_III_cards = Array(36).fill(Card());

export const CardsList = Level_I_cards;
