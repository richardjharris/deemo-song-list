// Round number and add commas at thousands (subject to locale)
export function formatInteger(num) {
  return Number(num).toLocaleString(
    navigator.language, { minimumFractionDigits: 0 },
  );
}