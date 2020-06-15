import { TriggerType } from "../cards/triggerType";
import { EnergyType } from "../energyType";
import { TestCard } from "../test/TestCard";
import { PlayerState } from "../playerState";
import { CardStatus } from "./cardStatus";
import { CardInfo } from "../cards/cardInfo";
import { GameState } from "../gameState";
import { CardEffect } from "../cards/cardEffect";
import { CardWithId } from "../cards/cardsCollection";

const effectStub: CardEffect = {
  canBeResolved: (): boolean => true,
  gameStateAfterEffect: (G: GameState): GameState => G,
};

function EnergyOfType(energyType: EnergyType): (e: EnergyType) => boolean {
  return (e: EnergyType): boolean => e === energyType;
}

describe("For single effect cards:", () => {
  test.each`
    triggerType            | triggerConditionName         | triggerCondition                | triggerData         | shouldChangeStatus | description
    ${TriggerType.Pick}    | ${"pickTriggerCondition"}    | ${EnergyOfType(EnergyType.Red)} | ${EnergyType.Red}   | ${true}            | ${"Changes the status on pick trigger if the energy fits the condition"}
    ${TriggerType.Pick}    | ${"pickTriggerCondition"}    | ${EnergyOfType(EnergyType.Red)} | ${EnergyType.Black} | ${false}           | ${"Does not change the status on pick trigger if the energy does not fit the condition"}
    ${TriggerType.Pick}    | ${"pickTriggerCondition"}    | ${EnergyOfType(EnergyType.Red)} | ${TestCard(11, 1)}  | ${false}           | ${"Does not change the status on pick trigger if the trigger data is not EnergyType"}
    ${TriggerType.Build}   | ${"buildTriggerCondition"}   | ${CardWithId(11)}               | ${TestCard(11, 1)}  | ${true}            | ${"Changes the status on build trigger if the card fits the condition"}
    ${TriggerType.Build}   | ${"buildTriggerCondition"}   | ${CardWithId(11)}               | ${TestCard(12, 1)}  | ${false}           | ${"Does not change the status on build picker if the card does not fit the condition"}
    ${TriggerType.Build}   | ${"buildTriggerCondition"}   | ${CardWithId(11)}               | ${EnergyType.Red}   | ${false}           | ${"Does not change the status on build trigger if the trigger data is not CardInfo"}
    ${TriggerType.Archive} | ${"archiveTriggerCondition"} | ${CardWithId(11)}               | ${TestCard(11, 1)}  | ${true}            | ${"Changes the status on archive trigger if the card fits the condition"}
    ${TriggerType.Archive} | ${"archiveTriggerCondition"} | ${CardWithId(11)}               | ${TestCard(12, 1)}  | ${false}           | ${"Does not change the status on archive trigger if the card does not fit the condition"}
    ${TriggerType.Archive} | ${"archiveTriggerCondition"} | ${CardWithId(11)}               | ${EnergyType.Red}   | ${false}           | ${"Does not change the status on archive trigger if the trigger data is not CardInfo"}
  `("$description", ({ triggerType, triggerConditionName, triggerCondition, triggerData, shouldChangeStatus }) => {
    //Arrange
    const playerState = new PlayerState({
      playerId: "0",
      machines: [
        {
          cardId: 10,
          type: triggerType,
          [triggerConditionName]: triggerCondition,
          victoryPoints: 0,
          level: 1,
          cost: 2,
          color: EnergyType.Red,
          primaryEffect: effectStub,
        },
      ],
      machineStatuses: {
        "10": CardStatus.Inactive,
      },
    });

    //Act
    const playerStateAfterActivation = playerState.withCardsActivatedBy(triggerType, triggerData);

    //Assert
    if (shouldChangeStatus) expect(playerStateAfterActivation.machineStatuses[10]).toBe(CardStatus.Active);
    else expect(playerStateAfterActivation.machineStatuses[10]).toBe(CardStatus.Inactive);
  });
});

describe("For two effect cards:", () => {
  test.each`
    triggerType            | triggerConditionName         | triggerCondition                | triggerData         | shouldChangeStatus | description
    ${TriggerType.Pick}    | ${"pickTriggerCondition"}    | ${EnergyOfType(EnergyType.Red)} | ${EnergyType.Red}   | ${true}            | ${"Changes the status on pick trigger if the energy fits the condition"}
    ${TriggerType.Pick}    | ${"pickTriggerCondition"}    | ${EnergyOfType(EnergyType.Red)} | ${EnergyType.Black} | ${false}           | ${"Does not change the status on pick trigger if the energy does not fit the condition"}
    ${TriggerType.Pick}    | ${"pickTriggerCondition"}    | ${EnergyOfType(EnergyType.Red)} | ${TestCard(11, 1)}  | ${false}           | ${"Does not change the status on pick trigger if the trigger data is not EnergyType"}
    ${TriggerType.Build}   | ${"buildTriggerCondition"}   | ${CardWithId(11)}               | ${TestCard(11, 1)}  | ${true}            | ${"Changes the status on build trigger if the card fits the condition"}
    ${TriggerType.Build}   | ${"buildTriggerCondition"}   | ${CardWithId(11)}               | ${TestCard(12, 1)}  | ${false}           | ${"Does not change the status on build picker if the card does not fit the condition"}
    ${TriggerType.Build}   | ${"buildTriggerCondition"}   | ${CardWithId(11)}               | ${EnergyType.Red}   | ${false}           | ${"Does not change the status on build trigger if the trigger data is not CardInfo"}
    ${TriggerType.Archive} | ${"archiveTriggerCondition"} | ${CardWithId(11)}               | ${TestCard(11, 1)}  | ${true}            | ${"Changes the status on archive trigger if the card fits the condition"}
    ${TriggerType.Archive} | ${"archiveTriggerCondition"} | ${CardWithId(11)}               | ${TestCard(12, 1)}  | ${false}           | ${"Does not change the status on archive trigger if the card does not fit the condition"}
    ${TriggerType.Archive} | ${"archiveTriggerCondition"} | ${CardWithId(11)}               | ${EnergyType.Red}   | ${false}           | ${"Does not change the status on archive trigger if the trigger data is not CardInfo"}
  `("$description", ({ triggerType, triggerConditionName, triggerCondition, triggerData, shouldChangeStatus }) => {
    //Arrange
    const playerState = new PlayerState({
      playerId: "0",
      machines: [
        {
          cardId: 10,
          type: triggerType,
          [triggerConditionName]: triggerCondition,
          victoryPoints: 0,
          level: 1,
          cost: 2,
          color: EnergyType.Red,
          primaryEffect: effectStub,
          secondaryEffect: effectStub,
        },
      ],
      machineStatuses: {
        "10": CardStatus.Inactive,
      },
    });

    //Act
    const playerStateAfterActivation = playerState.withCardsActivatedBy(triggerType, triggerData);

    //Assert
    if (shouldChangeStatus) expect(playerStateAfterActivation.machineStatuses[10]).toBe(CardStatus.Active);
    else expect(playerStateAfterActivation.machineStatuses[10]).toBe(CardStatus.Inactive);
  });
});
