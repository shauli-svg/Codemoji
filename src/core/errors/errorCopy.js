import { ErrorCode } from "./errors.js";

export function userCopyForError(code) {
  if (code === ErrorCode.WRONG_SIGN) return "זה לא הסימן";
  if (code === ErrorCode.MALFORMED_CAPSULE) return "הסוד הזה לא נפתח";
  if (code === ErrorCode.UNSUPPORTED_VERSION) return "הסוד הזה נוצר בגרסה אחרת";
  return "משהו לא נפתח. נסה שוב.";
}
