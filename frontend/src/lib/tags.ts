const TAG_LABELS: Record<string, string> = {
  Fighter: "Peleador",
  Mage: "Mago",
  Assassin: "Asesino",
  Marksman: "Tirador",
  Tank: "Tanque",
  Support: "Soporte",
};

export function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag;
}
