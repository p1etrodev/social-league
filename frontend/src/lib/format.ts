const ACCENT_MAP: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  Á: "A",
  É: "E",
  Í: "I",
  Ó: "O",
  Ú: "U",
  ü: "u",
  Ü: "U",
  ñ: "n",
  Ñ: "N",
  ç: "c",
  Ç: "C",
};

/** "La Nueve Colas" -> "@la_nueve_colas" */
export function toIdentifier(value: string): string {
  return (
    "@" +
    value
      .toLowerCase()
      .replace(/\s/g, "_")
      .replace(/[áéíóúÁÉÍÓÚüÜñÑçÇ]/g, (match) => ACCENT_MAP[match])
  );
}

export function relativeDate(isoDate: string): string {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) return "Fecha no válida";

  const diff = Date.now() - target.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return hours > 1 ? `${hours}hs` : `${hours}h`;
  if (days < 7) return `${days}d`;
  if (months < 12) return `${months}mes`;
  return `${years}a`;
}
