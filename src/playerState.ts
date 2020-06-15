import { CardInfo, isCardInfo } from "./cards/cardInfo";
import { InitialCard } from "./cards/cardsList";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerID } from "boardgame.io";
import { CardStatus, TwoEffectsStateMachine, OneEffectStateMachine } from "./cardEffects/cardStatus";
import { EnergyType, isEnergyType } from "./energyType";
import { CardWithTriggerType } from "./cards/cardsCollection";
import { TriggerType } from "./cards/triggerType";

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

  machineStatuses?: { readonly [cardId: number]: CardStatus };
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
      machineStatuses = {},
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
    this.machineStatuses = machineStatuses;
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

  readonly machineStatuses: { readonly [cardId: number]: CardStatus };
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

  withCardsActivatedBy(triggerType: TriggerType, triggerDetails?: CardInfo | EnergyType): PlayerState {
    const cardsToActivate = this.machines.filter(CardWithTriggerType(triggerType));
    const machineStatuses = { ...this.machineStatuses };
    cardsToActivate
      .filter((card) => card.type === triggerType)
      .forEach((card) => {
        const stateBeforeActivation = machineStatuses[card.cardId];

        const triggerConditionMet =
          (triggerType === TriggerType.Pick && isEnergyType(triggerDetails)
            ? card.pickTriggerCondition?.(triggerDetails)
            : triggerType === TriggerType.Build && isCardInfo(triggerDetails)
            ? card.buildTriggerCondition?.(triggerDetails)
            : triggerType === TriggerType.Archive && isCardInfo(triggerDetails)
            ? card.archiveTriggerCondition?.(triggerDetails)
            : triggerType === TriggerType.Converter) ?? false;

        if (triggerConditionMet)
          machineStatuses[card.cardId] = card.secondaryEffect
            ? TwoEffectsStateMachine.afterActivation(stateBeforeActivation)
            : OneEffectStateMachine.afterActivation(stateBeforeActivation);
      });
    return new PlayerState({ ...this, machineStatuses });
  }

  withUsedCard(cardId: number): PlayerState {
    const activeCards = this.activeCards.filter((cId) => cId !== cardId);
    const usedCards = [...this.usedCards, cardId];
    return new PlayerState({ ...this, activeCards, usedCards });
  }
}
