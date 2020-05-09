import { CardInfo } from "./cardInfo";
import { CardWithFileEffect, fileEffect } from "./cardWithFileEffect";
import { CardWithTakeEnergyEffect } from "./cardWithTakeEnergyEffect";
import { EnergyType } from "../basicGameElements";
import { TriggerType } from "./triggerType";

export const InitialCard = new CardWithTakeEnergyEffect(
  /*CardId */ 1,
  /*Trigger Type*/ TriggerType.Archive,
  /*How many energy*/ 1,
  /*victoryPoints*/ 2,
  /*Cost color*/ EnergyType.Blue,
  /*Cost amount*/ 2,
  /*Card level*/ 0
);

const Level_I_cards: ReadonlyArray<CardInfo> = [
  new CardWithFileEffect(1, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 2, 1),
];
// const Level_II_cards = Array(36).fill(Card());
// const Level_III_cards = Array(36).fill(Card());

const TestCards: ReadonlyArray<CardInfo> = [
  new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(2, TriggerType.Build, fileEffect, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(5, TriggerType.Upgrade, fileEffect, 1, EnergyType.Black, 1, 1),
  new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(42, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(21, TriggerType.Archive, fileEffect, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(23, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(71, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(82, TriggerType.Build, fileEffect, 4, EnergyType.Yellow, 6, 3),
  //---
  new CardWithFileEffect(11, TriggerType.Converter, fileEffect, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(12, TriggerType.Build, fileEffect, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(15, TriggerType.Upgrade, fileEffect, 1, EnergyType.Black, 1, 1),
  new CardWithFileEffect(13, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(142, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(121, TriggerType.Archive, fileEffect, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(123, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(171, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(182, TriggerType.Build, fileEffect, 4, EnergyType.Yellow, 6, 3),
];

export const CardsList: ReadonlyArray<CardInfo> = TestCards;
