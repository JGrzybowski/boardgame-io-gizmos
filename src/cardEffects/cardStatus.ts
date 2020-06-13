export enum CardStatus {
  Inactive = "Inactive",
  Active = "Active",
  Used1Effect = "Used1Effect",
  Used2Effect = "Used2Effect",
  Used = "Used",
}

export class TwoEffectsStateMachine {
  static afterUsingEffect1(status: CardStatus): CardStatus {
    switch (status) {
      case CardStatus.Active:
        return CardStatus.Used1Effect;
      case CardStatus.Used2Effect:
        return CardStatus.Used;
      default:
        return status;
    }
  }

  static afterUsingEffect2(status: CardStatus): CardStatus {
    switch (status) {
      case CardStatus.Active:
        return CardStatus.Used2Effect;
      case CardStatus.Used1Effect:
        return CardStatus.Used;
      default:
        return status;
    }
  }

  static afterActivation(status: CardStatus): CardStatus {
    switch (status) {
      case CardStatus.Inactive:
        return CardStatus.Active;
      default:
        return status;
    }
  }
}

export class OneEffectStateMachine {
  static afterUsingEffect1(status: CardStatus): OneEffectStateMachine {
    switch (status) {
      case CardStatus.Active:
        return CardStatus.Used;
      default:
        return status;
    }
  }

  static afterActivation(status: CardStatus): OneEffectStateMachine {
    switch (status) {
      case CardStatus.Inactive:
        return CardStatus.Active;
      default:
        return status;
    }
  }
}
