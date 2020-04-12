import { EnergyType } from "./basicGameElements";
import { Card } from "./cards/card";
import { InitialCard } from "./cards/cardsList";

const initialEnergyStorageCapacity = 5;
const initialArchiveLimit = 1;
const initialResearchLimit = 3;

export class PlayerState {
  constructor(public readonly playerId: string) {}
  victoryPoints = 0;

  energyStorage: ReadonlyArray<EnergyType> = [];
  archivesLimit: ReadonlyArray<Card> = [];

  energyStorageCapacity: number = initialEnergyStorageCapacity;
  archiveLimit: number = initialArchiveLimit;
  researchLimit: number = initialResearchLimit;

  machines: ReadonlyArray<Card> = [InitialCard];
  archive: ReadonlyArray<Card> = [];
  researched: ReadonlyArray<Card> = [];

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

  findCardInTheArchive(cardId: number): Card | null {
    const selectedCard = this.archive.find(c => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  findCardInMachines(cardId: number): Card | null {
    const selectedCard = this.machines.find(c => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  findCardInTheResearched(cardId: number): Card | null {
    const selectedCard = this.researched.find(c => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  hasDeclaredEnergy(declaredEnergy: ReadonlyArray<EnergyType>): boolean {
    function countEnergy(energyArray: ReadonlyArray<EnergyType>): any {
      const count: any = {};
      energyArray.forEach(energy => (count[energy] = (count[energy] || 0) + 1));
      return count;
    }

    const declaredEnergyCount = countEnergy(declaredEnergy);
    const playerEnergyCount = countEnergy(this.energyStorage);

    let playerHasDeclaredEnergy = true;
    for (const energy in declaredEnergyCount) {
      playerHasDeclaredEnergy = playerHasDeclaredEnergy && declaredEnergyCount[energy] <= playerEnergyCount[energy];
    }

    return playerHasDeclaredEnergy;
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

  private archiveWith(card: Card): ReadonlyArray<Card> {
    return [...this.archive, card];
  }

  archiveWithout(cardId: number): ReadonlyArray<Card> {
    return this.archive.filter(c => c.cardId !== cardId);
  }

  machinesWith(card: Card): ReadonlyArray<Card> {
    return [...this.machines, card];
  }

  researchedWithout(cardId: number): ReadonlyArray<Card> {
    return this.researched.filter(c => c.cardId !== cardId);
  }

  withAddedEnergy(energy: EnergyType): PlayerState {
    const energyStorage = [...this.energyStorage, energy];
    return {...this, energyStorage};
  }

  withAddedCardToArchive(card: Card): PlayerState{
    const archive = this.archiveWith(card);
    return {...this, archive};
  }

  withAddedCardToMachines(card: Card): PlayerState {
    const machines = this.machinesWith(card);
    return {...this, machines};
  }

  withRemovedCardFromArchive(cardId: number): PlayerState{
    const card = this.findCardInTheArchive(cardId);
    if (!card)
      throw new Error("Card was not found");
    const archive = this.archiveWithout(cardId);
    return {...this, archive};
  }

  withResearchedCleared(): PlayerState{
    const researched: ReadonlyArray<Card> = [];
    return {...this, researched};
  }

  withCardsAddedToResearched(cards: ReadonlyArray<Card>): PlayerState {
    const researched = [...this.researched, ...cards];
    return {...this, researched};
  }
}
