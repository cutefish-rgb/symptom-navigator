export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}
