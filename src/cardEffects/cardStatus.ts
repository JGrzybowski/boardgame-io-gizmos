export enum CardStatus {
  Inactive = "Inactive",
  Active = "Active",
  Used1Effect = "Used1Effect",
  Used2Effect = "Used2Effect",
  Used = "Used",
}

export class TwoEffectsStateMachine {
  constructor(readonly status: CardStatus) {}

  afterUsingEffect1(): TwoEffectsStateMachine {
    switch (this.status) {
      case CardStatus.Active:
        return new TwoEffectsStateMachine(CardStatus.Used1Effect);
      case CardStatus.Used2Effect:
        return new TwoEffectsStateMachine(CardStatus.Used);
      default:
        return new TwoEffectsStateMachine(this.status);
    }
  }

  afterUsingEffect2(): TwoEffectsStateMachine {
    switch (this.status) {
      case CardStatus.Active:
        return new TwoEffectsStateMachine(CardStatus.Used2Effect);
      case CardStatus.Used1Effect:
        return new TwoEffectsStateMachine(CardStatus.Used);
      default:
        return new TwoEffectsStateMachine(this.status);
    }
  }

  afterActivation(): TwoEffectsStateMachine {
    switch (this.status) {
      case CardStatus.Inactive:
        return new TwoEffectsStateMachine(CardStatus.Active);
      default:
        return new TwoEffectsStateMachine(this.status);
    }
  }
}

export class OneEffectStateMachine {
  constructor(readonly status: CardStatus) {}

  afterUsingEffect(): OneEffectStateMachine {
    switch (this.status) {
      case CardStatus.Active:
        return new OneEffectStateMachine(CardStatus.Used);
      default:
        return new OneEffectStateMachine(this.status);
    }
  }

  afterActivation(): OneEffectStateMachine {
    switch (this.status) {
      case CardStatus.Inactive:
        return new OneEffectStateMachine(CardStatus.Active);
      default:
        return new OneEffectStateMachine(this.status);
    }
  }
}
