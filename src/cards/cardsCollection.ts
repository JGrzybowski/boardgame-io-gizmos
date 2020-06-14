import { CardInfo, CardLevel } from "./cardInfo";
import { GameContext } from "../gameContext";
import { TriggerType } from "./triggerType";

export function GetFirstOrNull<T>(array: ReadonlyArray<T>, filter: (t: T, i: number) => boolean): T | null {
  const foundElement = array.find(filter);
  return foundElement ? foundElement : null;
}

export function ExtractFrom<T>(array: ReadonlyArray<T>, filter: (t: T, i: number) => boolean): [ReadonlyArray<T>, T] {
  const extractedElement = GetFirstOrNull(array, filter);
  if (!extractedElement) throw Error("There is no such element in the array.");
  const remainingElements: ReadonlyArray<T> = array.filter((t, i) => !filter(t, i));
  return [remainingElements, extractedElement];
}

export function CardWithId(cardId: number): (card: CardInfo) => boolean {
  return (card: CardInfo): boolean => card.cardId === cardId;
}

export function CardWithLevel(cardLevel: CardLevel): (card: CardInfo) => boolean {
  return (card: CardInfo): boolean => card.level === cardLevel;
}

export function CardWithTriggerType(triggerType: TriggerType): (card: CardInfo) => boolean {
  return (card: CardInfo): boolean => card.type === triggerType;
}

export function WithIndex<T>(index: number): (element: T, i: number) => boolean {
  return (element: T, i: number): boolean => i === index;
}

export function RandomIndex(ctx: GameContext): (n: number) => number {
  return (n: number): number => (ctx.random?.Die(n) ?? 0) - 1;
}
