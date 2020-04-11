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

  findCardInTheArchive(cardId: number): Card | null {
    const selectedCard = this.archive.find(c => c.cardId === cardId);
    return !selectedCard ? null : selectedCard;
  }

  findCardInMachines(cardId: number): Card | null {
    const selectedCard = this.machines.find(c => c.cardId === cardId);
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

  canAddEnergy(): boolean {
    throw new Error("Method not implemented.");
  }

  energyStorageWith(energy: EnergyType): ReadonlyArray<EnergyType> {
    // TODO Check limits
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

  archiveWith(card: Card): ReadonlyArray<Card> {
    // TODO Check limits
    return [...this.archive, card];
  }

  archiveWithout(cardId: number): ReadonlyArray<Card> {
    return this.archive.filter(c => c.cardId !== cardId);
  }

  machinesWith(card: Card): ReadonlyArray<Card> {
    return [...this.machines, card];
  }
}
