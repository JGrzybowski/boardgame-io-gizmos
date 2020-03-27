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

  findCardInTheArchive(cardId: number): Card | null {
    const selectedCard = this.archive.find((c: Card) => c.cardId == cardId);
    return typeof selectedCard === "undefined" ? null : selectedCard;
  }

  findCardInMachines(cardId: number): Card | null {
    const selectedCard = this.machines.find((c: Card) => c.cardId == cardId);
    return typeof selectedCard === "undefined" ? null : selectedCard;
  }

  hasDeclaredEnergy(declaredEnergy: Array<EnergyType>): boolean {
    function countEnergy(energyArray: Array<EnergyType>): any {
      var count: any = {};
      energyArray.forEach(energy => (count[energy] = (count[energy] || 0) + 1));
      return count;
    }

    let declaredEnergyCount = countEnergy(declaredEnergy);
    let playerEnergyCount = countEnergy(this.energyStorage);

    let playerHasDeclaredEnergy = true;
    for (let energy in declaredEnergyCount) {
      playerHasDeclaredEnergy =
        playerHasDeclaredEnergy &&
        declaredEnergyCount[energy] <= playerEnergyCount[energy];
    }

    return playerHasDeclaredEnergy;
  }

  energyStorageWith(energy: EnergyType): Array<EnergyType> {
    let energyStorage = [...this.energyStorage];
    //TODO Check limits
    energyStorage.push(energy);
    return energyStorage;
  }

  energyStorageWithout(energySet: Array<EnergyType>): Array<EnergyType> {
    let energyStorage = [...this.energyStorage];

    let removeOneEnergy = function(
      storage: Array<EnergyType>,
      energy: EnergyType
    ): Array<EnergyType> {
      let i = storage.indexOf(energy);
      return storage.slice(0, i).concat(storage.slice(i + 1, storage.length));
    };

    energyStorage = energyStorage.reduce(removeOneEnergy, energyStorage);
    return energyStorage;
  }

  archiveWith(card: Card): Array<Card> {
    let archive = [...this.archive];
    //TODO Check limits
    archive.push(card);
    return archive;
  }

  archiveWithout(cardId: number): Array<Card> {
    let archive = [...this.archive];
    archive = archive.filter(c => c.cardId != cardId);
    return archive;
  }

  machinesWith(card: Card): Array<Card> {
    let machines = [...this.machines];
    machines.push(card);
    return machines;
  }
}
