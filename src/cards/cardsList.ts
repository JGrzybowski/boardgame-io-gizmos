import { CardInfo } from "./cardInfo";
import { CardWithFileEffect } from "./cardWithFileEffect";
import { CardWithTakeEnergyEffect } from "./cardWithTakeEnergyEffect";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { UpgradeEffectCard } from "./upgradeEffectCard";
import { ConvertEffect } from "../cardEffects/convertEffect";
import { ConvertEffectCard } from "./convertEffectCard";
import { UpgradeLimitsEffectFunction } from "../cardEffects/upgradeLimitsEffect";

export const InitialCard = CardWithTakeEnergyEffect(
  /*CardId */ 1,
  /*Trigger Type*/ TriggerType.Archive,
  /*How many energy*/ 1,
  /*victoryPoints*/ 2,
  /*Cost color*/ EnergyType.Blue,
  /*Cost amount*/ 2,
  /*Card level*/ 0
);

const Level1Cards: ReadonlyArray<CardInfo> = [CardWithFileEffect(0, TriggerType.Archive, 2, EnergyType.Red, 2, 1)];
// const Level_II_cards = Array(36).fill(Card());
// const Level_III_cards = Array(36).fill(Card());

const TestCards: ReadonlyArray<CardInfo> = [
  // LEVEL 1
  UpgradeEffectCard(1001, UpgradeLimitsEffectFunction(1, 1, 0), 1, EnergyType.Red, 1, 1),
  UpgradeEffectCard(1002, UpgradeLimitsEffectFunction(1, 1, 0), 1, EnergyType.Blue, 1, 1),
  UpgradeEffectCard(1003, UpgradeLimitsEffectFunction(1, 1, 0), 1, EnergyType.Black, 1, 1),
  UpgradeEffectCard(1004, UpgradeLimitsEffectFunction(1, 1, 0), 1, EnergyType.Yellow, 1, 1),

  UpgradeEffectCard(1005, UpgradeLimitsEffectFunction(1, 0, 1), 1, EnergyType.Red, 1, 1),
  UpgradeEffectCard(1006, UpgradeLimitsEffectFunction(1, 0, 1), 1, EnergyType.Blue, 1, 1),
  UpgradeEffectCard(1007, UpgradeLimitsEffectFunction(1, 0, 1), 1, EnergyType.Black, 1, 1),
  UpgradeEffectCard(1008, UpgradeLimitsEffectFunction(1, 0, 1), 1, EnergyType.Yellow, 1, 1),

  ConvertEffectCard(1101, 1, EnergyType.Red, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Blue)),
  ConvertEffectCard(1102, 1, EnergyType.Red, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Black)),
  ConvertEffectCard(1103, 1, EnergyType.Blue, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Red)),
  ConvertEffectCard(1104, 1, EnergyType.Blue, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Yellow)),

  ConvertEffectCard(1105, 1, EnergyType.Black, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Red)),
  ConvertEffectCard(1106, 1, EnergyType.Black, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Yellow)),
  ConvertEffectCard(1107, 1, EnergyType.Yellow, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Blue)),
  ConvertEffectCard(1108, 1, EnergyType.Yellow, 1, 1, new ConvertEffect(EnergyType.Any, EnergyType.Black)),

  // LEVEL 2
  UpgradeEffectCard(2001, UpgradeLimitsEffectFunction(2, 1, 2), 3, EnergyType.Red, 3, 2),
  UpgradeEffectCard(2002, UpgradeLimitsEffectFunction(2, 1, 2), 3, EnergyType.Blue, 3, 2),
  UpgradeEffectCard(2003, UpgradeLimitsEffectFunction(2, 1, 2), 3, EnergyType.Black, 3, 2),
  UpgradeEffectCard(2004, UpgradeLimitsEffectFunction(2, 1, 2), 3, EnergyType.Yellow, 3, 2),

  //Change to Double Usage
  ConvertEffectCard(2101, 2, EnergyType.Red, 2, 2, new ConvertEffect(EnergyType.Any, EnergyType.Yellow)),
  ConvertEffectCard(2102, 2, EnergyType.Blue, 2, 2, new ConvertEffect(EnergyType.Any, EnergyType.Black)),
  ConvertEffectCard(2103, 2, EnergyType.Black, 2, 2, new ConvertEffect(EnergyType.Any, EnergyType.Blue)),
  ConvertEffectCard(2104, 2, EnergyType.Yellow, 2, 2, new ConvertEffect(EnergyType.Any, EnergyType.Red)),

  // Change to cost reducer
  ConvertEffectCard(2111, 3, EnergyType.Red, 3, 2, new ConvertEffect(EnergyType.Blue, EnergyType.Blue)),
  ConvertEffectCard(2112, 3, EnergyType.Red, 3, 2, new ConvertEffect(EnergyType.Black, EnergyType.Black)),
  ConvertEffectCard(2113, 3, EnergyType.Blue, 3, 2, new ConvertEffect(EnergyType.Red, EnergyType.Red)),
  ConvertEffectCard(2114, 3, EnergyType.Blue, 3, 2, new ConvertEffect(EnergyType.Yellow, EnergyType.Yellow)),
  ConvertEffectCard(2115, 3, EnergyType.Black, 3, 2, new ConvertEffect(EnergyType.Red, EnergyType.Red)),
  ConvertEffectCard(2116, 3, EnergyType.Black, 3, 2, new ConvertEffect(EnergyType.Yellow, EnergyType.Yellow)),
  ConvertEffectCard(2117, 3, EnergyType.Yellow, 3, 2, new ConvertEffect(EnergyType.Blue, EnergyType.Blue)),
  ConvertEffectCard(2118, 3, EnergyType.Yellow, 3, 2, new ConvertEffect(EnergyType.Black, EnergyType.Black)),

  // LEVEL 3
  UpgradeEffectCard(3001, UpgradeLimitsEffectFunction(4, 0, 0), 4, EnergyType.Blue, 4, 3),
  UpgradeEffectCard(3002, UpgradeLimitsEffectFunction(4, 0, 0), 4, EnergyType.Black, 4, 3),

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
  //new DiscountEffectCard(3009, (G, Ctx) => DiscountArchivedEffect(G, Ctx), 5, EnergyType.Red, 5, 3),
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
  CardWithFileEffect(811, TriggerType.Converter, 1, EnergyType.Blue, 1, 1),
  CardWithFileEffect(812, TriggerType.Build, 1, EnergyType.Yellow, 1, 1),
  CardWithFileEffect(813, TriggerType.Archive, 2, EnergyType.Red, 1, 1),
  CardWithFileEffect(814, TriggerType.Converter, 7, EnergyType.Blue, 2, 2),
  CardWithFileEffect(815, TriggerType.Archive, 4, EnergyType.Yellow, 3, 2),
  CardWithFileEffect(816, TriggerType.Archive, 2, EnergyType.Red, 2, 2),
  CardWithFileEffect(817, TriggerType.Converter, 7, EnergyType.Blue, 4, 3),
  CardWithFileEffect(818, TriggerType.Build, 4, EnergyType.Yellow, 6, 3),
  //---
  CardWithFileEffect(821, TriggerType.Converter, 1, EnergyType.Blue, 1, 1),
  CardWithFileEffect(822, TriggerType.Build, 1, EnergyType.Yellow, 1, 1),
  CardWithFileEffect(823, TriggerType.Archive, 2, EnergyType.Red, 1, 1),
  CardWithFileEffect(824, TriggerType.Converter, 7, EnergyType.Blue, 2, 2),
  CardWithFileEffect(825, TriggerType.Archive, 4, EnergyType.Yellow, 3, 2),
  CardWithFileEffect(826, TriggerType.Archive, 2, EnergyType.Red, 2, 2),
  CardWithFileEffect(827, TriggerType.Converter, 7, EnergyType.Blue, 4, 3),
  CardWithFileEffect(828, TriggerType.Build, 4, EnergyType.Yellow, 6, 3),
];

export const CardsList: ReadonlyArray<CardInfo> = TestCards;
