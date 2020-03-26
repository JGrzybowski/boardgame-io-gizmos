import { EnergyType } from "./basicGameElements";
import { Card } from "./cards/card";
import { InitialCard } from "./cards/cardsList";

const initialEnergyStorageCapacity = 5;
const initialArchiveLimit = 1;
const initialResearchLimit = 3;

export class PlayerState {
  constructor(public readonly playerId: unknown) {}
  victoryPoints: number = 0;

  energyStorage: Array<EnergyType> = [];
  archivesLimit: Array<Card> = [];

  energyStorageCapacity: number = initialEnergyStorageCapacity;
  archiveLimit: number = initialArchiveLimit;
  researchLimit: number = initialResearchLimit;

  machines: Array<Card> = [InitialCard];
  archive: Array<Card> = [];

  activeCards: Array<number> = [];
}
