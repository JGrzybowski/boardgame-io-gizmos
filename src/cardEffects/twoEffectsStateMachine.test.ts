import { CardStatus, TwoEffectsStateMachine } from "./cardStatus";

type StateMachineFunctionName = "afterActivation" | "afterUsingEffect1" | "afterUsingEffect2";

test.each`
  status                    | action                 | expectedNewStatus
  ${CardStatus.Inactive}    | ${"afterActivation"}   | ${CardStatus.Active}
  ${CardStatus.Active}      | ${"afterUsingEffect1"} | ${CardStatus.Used1Effect}
  ${CardStatus.Active}      | ${"afterUsingEffect2"} | ${CardStatus.Used2Effect}
  ${CardStatus.Used1Effect} | ${"afterUsingEffect2"} | ${CardStatus.Used}
  ${CardStatus.Used2Effect} | ${"afterUsingEffect1"} | ${CardStatus.Used}
`("$status --$action--> $expectedNewStatus", (testInput) => {
  const status: CardStatus = testInput.status;
  const action: StateMachineFunctionName = testInput.action;
  const expectedNewStatus: CardStatus = testInput.expectedNewStatus;
  const stateMachine: TwoEffectsStateMachine = new TwoEffectsStateMachine(status);
  const newStateMachine: TwoEffectsStateMachine = stateMachine[action]();
  expect(newStateMachine.status).toBe(expectedNewStatus);
});

test.each`
  status                    | action
  ${CardStatus.Inactive}    | ${"afterUsingEffect1"}
  ${CardStatus.Inactive}    | ${"afterUsingEffect2"}
  ${CardStatus.Active}      | ${"afterActivation"}
  ${CardStatus.Used1Effect} | ${"afterActivation"}
  ${CardStatus.Used2Effect} | ${"afterActivation"}
  ${CardStatus.Used}        | ${"afterActivation"}
  ${CardStatus.Used}        | ${"afterUsingEffect1"}
  ${CardStatus.Used}        | ${"afterUsingEffect2"}
`("$status --$action--> $status (does not change the status)", (testInput) => {
  const status: CardStatus = testInput.status;
  const action: StateMachineFunctionName = testInput.action;
  const stateMachine: TwoEffectsStateMachine = new TwoEffectsStateMachine(status);
  const newStateMachine: TwoEffectsStateMachine = stateMachine[action]();
  expect(newStateMachine.status).toBe(status);
});
