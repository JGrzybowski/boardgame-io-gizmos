import { CardInfo } from "./cardInfo";
import { CardWithFileEffect } from "./cardWithFileEffect";
import { CardWithTakeEnergyEffect } from "./cardWithTakeEnergyEffect";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { UpgradeEffectCard, UpgradeEffectFunction } from "./upgradeEffectCard";
import { ConvertEffect, ConvertEffectCard } from "./convertEffectCard";

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
  new CardWithFileEffect(0, TriggerType.Archive, null, 2, EnergyType.Red, 2, 1),
];
// const Level_II_cards = Array(36).fill(Card());
// const Level_III_cards = Array(36).fill(Card());

const TestCards: ReadonlyArray<CardInfo> = [
  // LEVEL 1
  new UpgradeEffectCard(1001, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Red, 1, 1),
  new UpgradeEffectCard(1002, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Blue, 1, 1),
  new UpgradeEffectCard(1003, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Black, 1, 1),
  new UpgradeEffectCard(1004, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 1, 0), 1, EnergyType.Yellow, 1, 1),

  new UpgradeEffectCard(1005, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Red, 1, 1),
  new UpgradeEffectCard(1006, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Blue, 1, 1),
  new UpgradeEffectCard(1007, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Black, 1, 1),
  new UpgradeEffectCard(1008, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 1, 0, 1), 1, EnergyType.Yellow, 1, 1),

  new ConvertEffectCard(1101, new ConvertEffect(EnergyType.Any, EnergyType.Blue), 1, EnergyType.Red, 1, 1),
  new ConvertEffectCard(1102, new ConvertEffect(EnergyType.Any, EnergyType.Black), 1, EnergyType.Red, 1, 1),
  new ConvertEffectCard(1103, new ConvertEffect(EnergyType.Any, EnergyType.Red), 1, EnergyType.Blue, 1, 1),
  new ConvertEffectCard(1104, new ConvertEffect(EnergyType.Any, EnergyType.Yellow), 1, EnergyType.Blue, 1, 1),

  new ConvertEffectCard(1105, new ConvertEffect(EnergyType.Any, EnergyType.Red), 1, EnergyType.Black, 1, 1),
  new ConvertEffectCard(1106, new ConvertEffect(EnergyType.Any, EnergyType.Yellow), 1, EnergyType.Black, 1, 1),
  new ConvertEffectCard(1107, new ConvertEffect(EnergyType.Any, EnergyType.Blue), 1, EnergyType.Yellow, 1, 1),
  new ConvertEffectCard(1108, new ConvertEffect(EnergyType.Any, EnergyType.Black), 1, EnergyType.Yellow, 1, 1),

  // LEVEL 2
  new UpgradeEffectCard(2001, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 2, 1, 2), 3, EnergyType.Red, 3, 2),
  new UpgradeEffectCard(2002, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 2, 1, 2), 3, EnergyType.Blue, 3, 2),
  new UpgradeEffectCard(2003, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 2, 1, 2), 3, EnergyType.Black, 3, 2),
  new UpgradeEffectCard(2004, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 2, 1, 2), 3, EnergyType.Yellow, 3, 2),

  //Change to Double Usage
  new ConvertEffectCard(2101, new ConvertEffect(EnergyType.Any, EnergyType.Yellow), 2, EnergyType.Red, 2, 2),
  new ConvertEffectCard(2102, new ConvertEffect(EnergyType.Any, EnergyType.Black), 2, EnergyType.Blue, 2, 2),
  new ConvertEffectCard(2103, new ConvertEffect(EnergyType.Any, EnergyType.Blue), 2, EnergyType.Black, 2, 2),
  new ConvertEffectCard(2104, new ConvertEffect(EnergyType.Any, EnergyType.Red), 2, EnergyType.Yellow, 2, 2),

  // Change to cost reducer
  new ConvertEffectCard(2111, new ConvertEffect(EnergyType.Blue, EnergyType.Blue), 3, EnergyType.Red, 3, 2),
  new ConvertEffectCard(2112, new ConvertEffect(EnergyType.Black, EnergyType.Black), 3, EnergyType.Red, 3, 2),
  new ConvertEffectCard(2113, new ConvertEffect(EnergyType.Red, EnergyType.Red), 3, EnergyType.Blue, 3, 2),
  new ConvertEffectCard(2114, new ConvertEffect(EnergyType.Yellow, EnergyType.Yellow), 3, EnergyType.Blue, 3, 2),
  new ConvertEffectCard(2115, new ConvertEffect(EnergyType.Red, EnergyType.Red), 3, EnergyType.Black, 3, 2),
  new ConvertEffectCard(2116, new ConvertEffect(EnergyType.Yellow, EnergyType.Yellow), 3, EnergyType.Black, 3, 2),
  new ConvertEffectCard(2117, new ConvertEffect(EnergyType.Blue, EnergyType.Blue), 3, EnergyType.Yellow, 3, 2),
  new ConvertEffectCard(2118, new ConvertEffect(EnergyType.Black, EnergyType.Black), 3, EnergyType.Yellow, 3, 2),

  // LEVEL 3
  new UpgradeEffectCard(3001, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 4, 0, 0), 4, EnergyType.Blue, 4, 3),
  new UpgradeEffectCard(3002, (G, Ctx) => UpgradeEffectFunction(G, Ctx, 4, 0, 0), 4, EnergyType.Black, 4, 3),

  // AfterGame Effect
  //new UpgradeEffectCard(3003, (G, Ctx) => AfterGameEnergyBonusEffect(G, Ctx), 0, EnergyType.Any, 7, 3),
  //new UpgradeEffectCard(3004, (G, Ctx) => AfterGameEnergyBonusEffect(G, Ctx), 0, EnergyType.Any, 7, 3),
  //new UpgradeEffectCard(3003, (G, Ctx) => AfterGameTicketsBonusEffect(G, Ctx), 0, EnergyType.Any, 7, 3),
  //new UpgradeEffectCard(3004, (G, Ctx) => AfterGameTicketsBonusEffect(G, Ctx), 0, EnergyType.Any, 7, 3),

  // Lock Effect
  //new UpgradeEffectCard(3005, (G, Ctx) => LockResearchEffect(G, Ctx), 8, EnergyType.Red, 4, 3),
  //new UpgradeEffectCard(3006, (G, Ctx) => LockResearchEffect(G, Ctx), 8, EnergyType.Blue, 4, 3),
  //new UpgradeEffectCard(3007, (G, Ctx) => LockArchiveEffect(G, Ctx), 7, EnergyType.Black, 4, 3),
  //new UpgradeEffectCard(3008, (G, Ctx) => LockArchiveEffect(G, Ctx), 7, EnergyType.Yellow, 4, 3),

  // Discounts
  //new DiscountEffectCard(3009,  (G, Ctx) => DiscountArchivedEffect(G, Ctx), 5, EnergyType.Red, 5, 3),
  //new DiscountEffectCard(3010, (G, Ctx) => DiscountArchivedEffect(G, Ctx), 5, EnergyType.Blue, 5, 3),
  //new DiscountEffectCard(3011, (G, Ctx) => DiscountResearchedEffect(G, Ctx), 6, EnergyType.Black, 6, 3),
  //new DiscountEffectCard(3012, (G, Ctx) => DiscountResearchedEffect(G, Ctx), 6, EnergyType.Yellow, 6, 3),
  //new DiscountEffectCard(3011, (G, Ctx) => DiscountWithLevelEffect(G, Ctx, 2), 5, EnergyType.Blue, 5, 3),
  //new DiscountEffectCard(3012, (G, Ctx) => DiscountWithLevelEffect(G, Ctx, 2), 5, EnergyType.Yellow, 5, 3),

  //new ConvertEffectCard(3101, new ConvertEffect(EnergyType.Any, EnergyType.Any), 4, EnergyType.Red, 4, 3),
  //new ConvertEffectCard(3101, new ConvertEffect(EnergyType.Any, EnergyType.Any), 4, EnergyType.Yellow, 4, 3),

  //Change to two effect cost reducers
  //new ConvertEffectCard(3103, new ConvertEffect(EnergyType.Black, EnergyType.Red), 5, EnergyType.Blue, 5, 3),
  //new ConvertEffectCard(3104, new ConvertEffect(EnergyType.Blue, EnergyType.Yellow), 5, EnergyType.Black, 5, 3),

  //Randoms
  new CardWithFileEffect(811, TriggerType.Converter, null, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(812, TriggerType.Build, null, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(813, TriggerType.Archive, null, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(814, TriggerType.Converter, null, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(815, TriggerType.Archive, null, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(816, TriggerType.Archive, null, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(817, TriggerType.Converter, null, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(818, TriggerType.Build, null, 4, EnergyType.Yellow, 6, 3),
  //---
  new CardWithFileEffect(821, TriggerType.Converter, null, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(822, TriggerType.Build, null, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(823, TriggerType.Archive, null, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(824, TriggerType.Converter, null, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(825, TriggerType.Archive, null, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(826, TriggerType.Archive, null, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(827, TriggerType.Converter, null, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(828, TriggerType.Build, null, 4, EnergyType.Yellow, 6, 3),
];

export const CardsList: ReadonlyArray<CardInfo> = TestCards;
