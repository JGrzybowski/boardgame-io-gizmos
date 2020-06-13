import { CardStatus, OneEffectStateMachine } from "./cardStatus";

type StateMachineFunctionName = "afterActivation" | "afterUsingEffect1";

test.each`
  status                 | action                 | expectedNewStatus
  ${CardStatus.Inactive} | ${"afterActivation"}   | ${CardStatus.Active}
  ${CardStatus.Active}   | ${"afterUsingEffect1"} | ${CardStatus.Used}
`("$status --$action--> $expectedNewStatus", (testInput) => {
  const status: CardStatus = testInput.status;
  const action: StateMachineFunctionName = testInput.action;
  const expectedNewStatus: CardStatus = testInput.expectedNewStatus;
  expect(OneEffectStateMachine[action](status)).toBe(expectedNewStatus);
});

test.each`
  status                 | action
  ${CardStatus.Inactive} | ${"afterUsingEffect1"}
  ${CardStatus.Active}   | ${"afterActivation"}
  ${CardStatus.Used}     | ${"afterActivation"}
  ${CardStatus.Used}     | ${"afterUsingEffect1"}
`("$status --$action--> $status (does not change the status)", (testInput) => {
  const status: CardStatus = testInput.status;
  const action: StateMachineFunctionName = testInput.action;
  expect(OneEffectStateMachine[action](status)).toBe(status);
});
