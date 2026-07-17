const STORAGE_KEY = "social-league:anon-id";

/**
 * A random id generated once per browser and kept in localStorage -- not
 * tied to any account or champion choice. It exists purely so the backend
 * can enforce "one reaction per emoji per browser" on a post; it carries no
 * identifying information and there's no login behind it.
 */
export function getAnonId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}
