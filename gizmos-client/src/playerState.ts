import { EnergyType } from "./basicGameElements";
import { CardInfo } from "./cards/cardInfo";
import { InitialCard } from "./cards/cardsList";

const initialEnergyStorageCapacity = 5;
const initialArchiveLimit = 1;
const initialResearchLimit = 3;

export class PlayerState {
  constructor(public readonly playerId: number | string) {}
  victoryPoints = 0;

  energyStorage: ReadonlyArray<EnergyType> = [];
  archivesLimit: ReadonlyArray<CardInfo> = [];

  energyStorageCapacity: number = initialEnergyStorageCapacity;
  archiveLimit: number = initialArchiveLimit;
  researchLimit: number = initialResearchLimit;

  machines: ReadonlyArray<CardInfo> = [InitialCard];
  archive: ReadonlyArray<CardInfo> = [];
  researched: ReadonlyArray<CardInfo> = [];

  activeCards: ReadonlyArray<number> = [];

  isArchivingBlocked = false;
  isResearchBlocked = false;

  canArchiveAnotherCard(): boolean {
    if (this.isArchivingBlocked) return false;
    return this.archive.length < this.archiveLimit;
  }

  canResearch(): boolean {
    if (this.isResearchBlocked) return false;
    return this.researchLimit > 0;
  }

  canAddEnergy(): boolean {
    return this.energyStorage.length >= this.energyStorageCapacity;
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
    return this.energyStorage.find((e) => e === energy) !== undefined;
  }

  energyStorageWith(energy: EnergyType): ReadonlyArray<EnergyType> {
    return [...this.energyStorage, energy];
  }

  energyStorageWithout(energySet: ReadonlyArray<EnergyType>): ReadonlyArray<EnergyType> {
    const removeOneEnergy = (storage: ReadonlyArray<EnergyType>, energy: EnergyType): ReadonlyArray<EnergyType> => {
      const i = storage.indexOf(energy);
      return storage.filter((e, idx) => idx !== i);
    };

    const energyStorage = this.energyStorage.reduce(removeOneEnergy, this.energyStorage);
    return energyStorage;
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
    const energyStorage = [...this.energyStorage, energy];
    return { ...this, energyStorage };
  }

  withAddedCardToArchive(card: CardInfo): PlayerState {
    const archive = this.archiveWith(card);
    return { ...this, archive };
  }

  withAddedCardToMachines(card: CardInfo): PlayerState {
    const machines = this.machinesWith(card);
    return { ...this, machines };
  }

  withRemovedCardFromArchive(cardId: number): PlayerState {
    const card = this.findCardInTheArchive(cardId);
    if (!card) throw new Error("Card was not found");
    const archive = this.archiveWithout(cardId);
    return { ...this, archive };
  }

  withResearchedCleared(): PlayerState {
    const researched: ReadonlyArray<CardInfo> = [];
    return { ...this, researched };
  }

  withCardsAddedToResearched(cards: ReadonlyArray<CardInfo>): PlayerState {
    const researched = [...this.researched, ...cards];
    return { ...this, researched };
  }

  withRemovedEnergy(payment: EnergyType): PlayerState {
    const skippedIndex = this.energyStorage.indexOf(payment);
    const energyStorage = this.energyStorage.filter((e, i) => i === skippedIndex);
    return { ...this, energyStorage };
  }
}
