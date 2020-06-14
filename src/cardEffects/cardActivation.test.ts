import { TriggerType } from "../cards/triggerType";
import { EnergyType } from "../energyType";
import { CardInfo } from "../cards/cardInfo";
import { TestCard } from "../test/TestCard";
import { PlayerState } from "../playerState";
import { CardStatus } from "./cardStatus";

test.each`
  triggerType            | triggerData            | shouldChangeStatus | description
  ${TriggerType.Pick}    | ${EnergyType.Red}      | ${true}            | ${"Changes the status on pick trigger if the energy fits the condition"}
  ${TriggerType.Pick}    | ${EnergyType.Black}    | ${false}           | ${"Does not change the status on pick trigger if the energy does not fit the condition"}
  ${TriggerType.Pick}    | ${new TestCard(11, 1)} | ${false}           | ${"Does not change the status on pick trigger if the trigger data is not EnergyType"}
  ${TriggerType.Build}   | ${new TestCard(11, 1)} | ${true}            | ${"Changes the status on build trigger if the card fits the condition"}
  ${TriggerType.Build}   | ${new TestCard(11, 2)} | ${false}           | ${"Does not change the status on build picker if the card does not fit the condition"}
  ${TriggerType.Build}   | ${EnergyType.Red}      | ${false}           | ${"Does not change the status on build trigger if the trigger data is not CardInfo"}
  ${TriggerType.Archive} | ${new TestCard(11, 1)} | ${true}            | ${"Changes the status on archive trigger if the card fits the condition"}
  ${TriggerType.Archive} | ${new TestCard(11, 2)} | ${false}           | ${"Does not change the status on archive trigger if the card does not fit the condition"}
  ${TriggerType.Archive} | ${EnergyType.Red}      | ${false}           | ${"Does not change the status on archive trigger if the trigger data is not CardInfo"}
`("$description", ({ triggerType, triggerData, shouldChangeStatus }) => {
  //Arrange
  const playerState = new PlayerState({
    playerId: "0",
    machines: [],
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
