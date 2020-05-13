import { CardInfo, CardLevel } from "../cards/cardInfo";
import { TriggerType } from "../cards/triggerType";
import { EnergyType } from "../basicGameElements";

export class TestCard extends CardInfo {
  constructor(cardId: number, lvl: CardLevel) {
    super(cardId, TriggerType.Archive, null, null, 0, EnergyType.Any, 1, lvl);
  }
}
