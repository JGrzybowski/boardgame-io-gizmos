import { CardStatus, OneEffectStateMachine } from "./cardStatus";

type StateMachineFunctionName = "afterActivation" | "afterUsingEffect";

test.each`
  status                 | action                | expectedNewStatus
  ${CardStatus.Inactive} | ${"afterActivation"}  | ${CardStatus.Active}
  ${CardStatus.Active}   | ${"afterUsingEffect"} | ${CardStatus.Used}
`("$status --$action--> $expectedNewStatus", (testInput) => {
  const status: CardStatus = testInput.status;
  const action: StateMachineFunctionName = testInput.action;
  const expectedNewStatus: CardStatus = testInput.expectedNewStatus;
  const stateMachine: OneEffectStateMachine = new OneEffectStateMachine(status);
  const newStateMachine: OneEffectStateMachine = stateMachine[action]();
  expect(newStateMachine.status).toBe(expectedNewStatus);
});

test.each`
  status                 | action
  ${CardStatus.Inactive} | ${"afterUsingEffect"}
  ${CardStatus.Active}   | ${"afterActivation"}
  ${CardStatus.Used}     | ${"afterActivation"}
  ${CardStatus.Used}     | ${"afterUsingEffect"}
`("$status --$action--> $status (does not change the status)", (testInput) => {
  const status: CardStatus = testInput.status;
  const action: StateMachineFunctionName = testInput.action;
  const stateMachine: OneEffectStateMachine = new OneEffectStateMachine(status);
  const newStateMachine: OneEffectStateMachine = stateMachine[action]();
  expect(newStateMachine.status).toBe(status);
});
