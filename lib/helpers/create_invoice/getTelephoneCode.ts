export function getTelephoneCode(country: string) {
  if (country === "India" || country === "india") {
    return "+91";
  } else {
    return "+1";
  }
}
