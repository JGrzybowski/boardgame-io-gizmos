import { CardInfo } from "./cards/cardInfo";
import { InitialCard } from "./cards/cardsList";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerID } from "boardgame.io";

const initialEnergyStorageCapacity = 5;
const initialArchiveLimit = 1;
const initialResearchLimit = 3;

interface PlayerStateData {
  playerId: PlayerID;
  victoryPoints?: number;

  energyStorage?: EnergyTypeDictionary;

  energyStorageCapacity?: number;
  archiveLimit?: number;
  researchLimit?: number;

  machines?: ReadonlyArray<CardInfo>;
  archive?: ReadonlyArray<CardInfo>;
  researched?: ReadonlyArray<CardInfo>;

  activeCards?: ReadonlyArray<number>;
  usedCards?: ReadonlyArray<number>;

  isArchivingBlocked?: boolean;
  isResearchBlocked?: boolean;
}

export class PlayerState {
  constructor(data: PlayerStateData) {
    const {
      playerId,
      victoryPoints = 0,
      energyStorage = new EnergyTypeDictionary(),
      energyStorageCapacity = initialEnergyStorageCapacity,
      archiveLimit = initialArchiveLimit,
      researchLimit = initialResearchLimit,
      machines = [InitialCard],
      archive = [],
      researched = [],
      activeCards = [],
      usedCards = [],
      isArchivingBlocked = false,
      isResearchBlocked = false,
    } = data;
    this.playerId = playerId;
    this.victoryPoints = victoryPoints;
    this.energyStorage = energyStorage;
    this.energyStorageCapacity = energyStorageCapacity;
    this.archiveLimit = archiveLimit;
    this.researchLimit = researchLimit;
    this.machines = machines;
    this.archive = archive;
    this.researched = researched;
    this.activeCards = activeCards;
    this.usedCards = usedCards;
    this.isArchivingBlocked = isArchivingBlocked;
    this.isResearchBlocked = isResearchBlocked;
  }

  readonly playerId: PlayerID = "NON_INITIALISED";
  readonly victoryPoints: number;

  readonly energyStorage: EnergyTypeDictionary;

  readonly energyStorageCapacity: number;
  readonly archiveLimit: number;
  readonly researchLimit: number;

  readonly machines: ReadonlyArray<CardInfo>;
  readonly archive: ReadonlyArray<CardInfo>;
  readonly researched: ReadonlyArray<CardInfo>;

  readonly activeCards: ReadonlyArray<number>;
  readonly usedCards: ReadonlyArray<number>;

  readonly isArchivingBlocked: boolean = false;
  readonly isResearchBlocked: boolean = false;

  canArchiveAnotherCard(): boolean {
    if (this.isArchivingBlocked) return false;
    return this.archive.length < this.archiveLimit;
  }

  canResearch(): boolean {
    if (this.isResearchBlocked) return false;
    return this.researchLimit > 0;
  }

  canAddEnergy(): boolean {
    return this.energyStorage.sum() < this.energyStorageCapacity;
  }

  withLimitsChangedBy(storage: number, archive: number, research: number): PlayerState {
    const archiveLimit = this.archiveLimit + archive;
    const energyStorageCapacity = this.energyStorageCapacity + storage;
    const researchLimit = this.researchLimit + research;

    return new PlayerState({ ...this, archiveLimit, energyStorageCapacity, researchLimit });
  }

  withUsedCard(cardId: number): PlayerState {
    const activeCards = this.activeCards.filter((cId) => cId !== cardId);
    const usedCards = [...this.usedCards, cardId];
    return new PlayerState({ ...this, activeCards, usedCards });
  }
}
