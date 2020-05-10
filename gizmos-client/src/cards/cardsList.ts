import { CardInfo } from "./cardInfo";
import { CardWithFileEffect } from "./cardWithFileEffect";
import { CardWithTakeEnergyEffect } from "./cardWithTakeEnergyEffect";
import { EnergyType } from "../basicGameElements";
import { TriggerType } from "./triggerType";
import { UpgradeEffectCard, UpgradeEffectFunction } from "./upgradeEffectCard";

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
  new CardWithFileEffect(1, TriggerType.Archive, null, 2, EnergyType.Red, 2, 1),
];
// const Level_II_cards = Array(36).fill(Card());
// const Level_III_cards = Array(36).fill(Card());

const TestCards: ReadonlyArray<CardInfo> = [
  new UpgradeEffectCard(1, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Red, 1, 1),
  new UpgradeEffectCard(2, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Blue, 1, 1),
  new UpgradeEffectCard(3, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Black, 1, 1),
  new UpgradeEffectCard(4, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Yellow, 1, 1),

  new UpgradeEffectCard(5, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Red, 1, 1),
  new UpgradeEffectCard(6, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Blue, 1, 1),
  new UpgradeEffectCard(7, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Black, 1, 1),
  new UpgradeEffectCard(8, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Yellow, 1, 1),

  new CardWithFileEffect(101, TriggerType.Converter, null, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(102, TriggerType.Build, null, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(103, TriggerType.Archive, null, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(42, TriggerType.Converter, null, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(21, TriggerType.Archive, null, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(23, TriggerType.Archive, null, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(71, TriggerType.Converter, null, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(82, TriggerType.Build, null, 4, EnergyType.Yellow, 6, 3),
  //---
  new CardWithFileEffect(11, TriggerType.Converter, null, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(12, TriggerType.Build, null, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(13, TriggerType.Archive, null, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(142, TriggerType.Converter, null, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(121, TriggerType.Archive, null, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(123, TriggerType.Archive, null, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(171, TriggerType.Converter, null, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(182, TriggerType.Build, null, 4, EnergyType.Yellow, 6, 3),
];

export const CardsList: ReadonlyArray<CardInfo> = TestCards;
