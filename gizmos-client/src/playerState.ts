import { EnergyType } from "./basicGameElements";
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

  readonly isArchivingBlocked: boolean = false;
  readonly isResearchBlocked: boolean = false;

  static WithId(playerId: PlayerID): PlayerState {
    return new PlayerState({ playerId });
  }

  canArchiveAnotherCard(): boolean {
    if (this.isArchivingBlocked) return false;
    return this.archive.length < this.archiveLimit;
  }

  canResearch(): boolean {
    if (this.isResearchBlocked) return false;
    return this.researchLimit > 0;
  }

  canAddEnergy(): boolean {
    const sum =
      this.energyStorage.R +
      this.energyStorage.U +
      this.energyStorage.B +
      this.energyStorage.Y +
      this.energyStorage.Any;
    return sum < this.energyStorageCapacity;
  }

  findCardInTheArchive(cardId: number): CardInfo | null {
    const selectedCard = this.archive.find((c) => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  findCardInMachines(cardId: number): CardInfo | null {
    const selectedCard = this.machines.find((c) => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  findCardInTheResearched(cardId: number): CardInfo | null {
    const selectedCard = this.researched.find((c) => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  hasDeclaredEnergy(energy: EnergyType): boolean {
    return this.energyStorage.get(energy) > 0;
  }

  energyStorageWith(energy: EnergyType): EnergyTypeDictionary {
    return this.energyStorage.withAmountToPayWithEnergyTypeSetTo(energy, this.energyStorage.get(energy) + 1);
  }

  private archiveWith(card: CardInfo): ReadonlyArray<CardInfo> {
    return [...this.archive, card];
  }

  archiveWithout(cardId: number): ReadonlyArray<CardInfo> {
    return this.archive.filter((c) => c.cardId !== cardId);
  }

  machinesWith(card: CardInfo): ReadonlyArray<CardInfo> {
    return [...this.machines, card];
  }

  researchedWithout(cardId: number): ReadonlyArray<CardInfo> {
    return this.researched.filter((c) => c.cardId !== cardId);
  }

  withAddedEnergy(energy: EnergyType): PlayerState {
    const energyStorage = this.energyStorageWith(energy);
    return new PlayerState({ ...this, energyStorage });
  }

  withAddedCardToArchive(card: CardInfo): PlayerState {
    const archive = this.archiveWith(card);
    return new PlayerState({ ...this, archive });
  }

  withAddedCardToMachines(card: CardInfo): PlayerState {
    const machines = this.machinesWith(card);
    return new PlayerState({ ...this, machines });
  }

  withRemovedCardFromArchive(cardId: number): PlayerState {
    const card = this.findCardInTheArchive(cardId);
    if (!card) throw new Error("Card was not found");
    const archive = this.archiveWithout(cardId);
    return new PlayerState({ ...this, archive });
  }

  withRemovedCardFromResearched(cardId: number): PlayerState {
    const card = this.findCardInTheResearched(cardId);
    if (!card) throw new Error("Card was not found");
    const researched = this.researchedWithout(cardId);
    return new PlayerState({ ...this, researched });
  }

  withResearchedCleared(): PlayerState {
    const researched: ReadonlyArray<CardInfo> = [];
    return new PlayerState({ ...this, researched });
  }

  withCardsAddedToResearched(cards: ReadonlyArray<CardInfo>): PlayerState {
    const researched = [...this.researched, ...cards];
    return new PlayerState({ ...this, researched });
  }

  withRemovedEnergy(payment: EnergyType): PlayerState {
    const newValue = this.energyStorage.get(payment) - 1;
    const energyStorage = this.energyStorage.withAmountToPayWithEnergyTypeSetTo(payment, newValue);
    return new PlayerState({ ...this, energyStorage });
  }
}
