import { CardInfo } from "./cardInfo";

export function GetFirstOrNull<T>(
  array: ReadonlyArray<T>,
  filter: (t: T) => boolean
): T | null {
  const foundElement = array.find(filter);
  return foundElement ? foundElement : null;
}

export function ExtractFrom<T>(
  array: ReadonlyArray<T>,
  filter: (t: T) => boolean
): [ReadonlyArray<T>, T] {
  const extractedElement = GetFirstOrNull(array, filter);
  if (!extractedElement) throw Error("There is no such element in the array.");
  const remainingElements: ReadonlyArray<T> = array.filter((t) => !filter(t));
  return [remainingElements, extractedElement];
}

export function CardWithId(cardId: number): (card: CardInfo) => boolean {
  return (card: CardInfo): boolean => card.cardId === cardId;
}
