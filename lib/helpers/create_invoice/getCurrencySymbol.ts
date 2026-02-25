export function getCurrencySymbol(country: string) {
  if (country === "India" || country === "india") {
    return "₹";
  } else {
    return "$";
  }
}
