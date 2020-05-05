import { EnergyType } from "./basicGameElements";
import { CardInfo } from "./cards/cardInfo";
import { InitialCard } from "./cards/cardsList";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";

const initialEnergyStorageCapacity = 5;
const initialArchiveLimit = 1;
const initialResearchLimit = 3;

export class PlayerState {
  constructor(public readonly playerId: number | string) {}
  readonly victoryPoints = 0;

  readonly energyStorage: EnergyTypeDictionary = new EnergyTypeDictionary();
  readonly archivesLimit: ReadonlyArray<CardInfo> = [];

  readonly energyStorageCapacity: number = initialEnergyStorageCapacity;
  readonly archiveLimit: number = initialArchiveLimit;
  readonly researchLimit: number = initialResearchLimit;

  readonly machines: ReadonlyArray<CardInfo> = [InitialCard];
  readonly archive: ReadonlyArray<CardInfo> = [];
  readonly researched: ReadonlyArray<CardInfo> = [];

  readonly activeCards: ReadonlyArray<number> = [];

  readonly isArchivingBlocked = false;
  readonly isResearchBlocked = false;

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
    return sum >= this.energyStorageCapacity;
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
    const newValue = this.energyStorage.get(payment) - 1;
    const energyStorage = this.energyStorage.withAmountToPayWithEnergyTypeSetTo(payment, newValue);
    return { ...this, energyStorage };
  }
}
