import { isAxiosError } from "axios";

// Data-source-agnostic "not found" signal: our own backend returns a real
// 404, but e.g. Data Dragon's S3-backed CDN returns 403 AccessDenied for a
// champion id that doesn't exist, so we normalize that at the source
// instead of teaching this shared helper about every backend's quirks.
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function isNotFoundError(error: unknown): boolean {
  if (error instanceof NotFoundError) return true;
  return isAxiosError(error) && error.response?.status === 404;
}
