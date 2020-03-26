import { Card, TriggerType, CostColor } from "./card";
import { CardWithFileEffect, FileActionEffect } from "./cardWithFileEffect";
import {
  CardWithTakeEnergyEffect,
  TakeEnergyEffect
} from "./cardWithTakeEnergyEffect";

const FileEffect: FileActionEffect = new FileActionEffect();

export const InitialCard = new CardWithTakeEnergyEffect(
  1,
  TriggerType.File,
  1,
  2,
  CostColor.Red,
  2,
  1
);

const Level_I_cards: Array<Card> = [
  new CardWithFileEffect(
    1,
    TriggerType.File,
    FileEffect,
    2,
    CostColor.Red,
    2,
    1
  )
];
//const Level_II_cards = Array(36).fill(Card());
//const Level_III_cards = Array(36).fill(Card());

export const CardsList = Level_I_cards;
