export function uptoTwoDecimalPlaces(anyNumber: number) {
  const resultInTwoDecimalPlaces: number = parseFloat(anyNumber.toFixed(2));

  return resultInTwoDecimalPlaces;
}
