import { TriggerType } from "../cards/triggerType";
import { EnergyType } from "../energyType";
import { TestCard } from "../test/TestCard";
import { PlayerState } from "../playerState";
import { CardStatus } from "./cardStatus";
import { CardInfo } from "../cards/cardInfo";

test.each`
  triggerType            | triggerData         | shouldChangeStatus | description
  ${TriggerType.Pick}    | ${EnergyType.Red}   | ${true}            | ${"Changes the status on pick trigger if the energy fits the condition"}
  ${TriggerType.Pick}    | ${EnergyType.Black} | ${false}           | ${"Does not change the status on pick trigger if the energy does not fit the condition"}
  ${TriggerType.Pick}    | ${TestCard(11, 1)}  | ${false}           | ${"Does not change the status on pick trigger if the trigger data is not EnergyType"}
  ${TriggerType.Build}   | ${TestCard(11, 1)}  | ${true}            | ${"Changes the status on build trigger if the card fits the condition"}
  ${TriggerType.Build}   | ${TestCard(12, 1)}  | ${false}           | ${"Does not change the status on build picker if the card does not fit the condition"}
  ${TriggerType.Build}   | ${EnergyType.Red}   | ${false}           | ${"Does not change the status on build trigger if the trigger data is not CardInfo"}
  ${TriggerType.Archive} | ${TestCard(11, 1)}  | ${true}            | ${"Changes the status on archive trigger if the card fits the condition"}
  ${TriggerType.Archive} | ${TestCard(12, 1)}  | ${false}           | ${"Does not change the status on archive trigger if the card does not fit the condition"}
  ${TriggerType.Archive} | ${EnergyType.Red}   | ${false}           | ${"Does not change the status on archive trigger if the trigger data is not CardInfo"}
`("$description", ({ triggerType, triggerData, shouldChangeStatus }) => {
  //Arrange
  const playerState = new PlayerState({
    playerId: "0",
    machines: [
      {
        cardId: 10,
        type: triggerType,
        buildTriggerCondition: (card: CardInfo): boolean => card.cardId == 11,
        pickTriggerCondition: (energy: EnergyType): boolean => energy == EnergyType.Red,
        archiveTriggerCondition: (card: CardInfo): boolean => card.cardId == 11,
        victoryPoints: 0,
        level: 1,
        cost: 2,
        color: EnergyType.Red,
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
