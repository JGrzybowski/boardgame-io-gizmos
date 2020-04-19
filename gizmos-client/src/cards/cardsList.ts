import { Card, TriggerType } from "./card";
import { CardWithFileEffect, fileEffect } from "./cardWithFileEffect";
import { CardWithTakeEnergyEffect } from "./cardWithTakeEnergyEffect";
import {EnergyType} from "../basicGameElements";

export const InitialCard = new CardWithTakeEnergyEffect(
  /*CardId */ 1,
  /*Trigger Type*/ TriggerType.File,
  /*How many energy*/ 1,
  /*victoryPoints*/ 2,
  /*Cost color*/ EnergyType.Red,
  /*Cost amount*/ 2,
  /*Card level*/ 0
);

const Level_I_cards: ReadonlyArray<Card> = [
  new CardWithFileEffect(1, TriggerType.File, fileEffect, 2, EnergyType.Red, 2, 1)
];
// const Level_II_cards = Array(36).fill(Card());
// const Level_III_cards = Array(36).fill(Card());

export const CardsList = Level_I_cards;
