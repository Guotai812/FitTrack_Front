export type ValidatorType = string;

export default function validator(
  type: ValidatorType,
  value: string | number | string[] | File | null,
  compareValue?: string | number
): boolean {
  switch (type) {
    // ── STRING TESTS ────────────────────────────────────────────────────────
    case "email":
      if (typeof value !== "string") return false;
      return /\S+@\S+\.\S+/.test(value);

    case "password":
      if (typeof value !== "string") return false;
      // at least 6 chars and at least one digit
      return value.length >= 6;

    case "userName":
    case "name":
      if (typeof value !== "string") return false;
      // at least 2 non-whitespace chars
      return value.trim().length >= 2;

    case "confirmPassword":
      if (typeof value !== "string" || typeof compareValue !== "string")
        return false;
      return value === compareValue;

    case "gender":
    case "frequency":
    case "type":
    case "goal":
    case "birthdate":
      if (typeof value !== "string") return false;
      return value !== "";

    // ── NUMBER TESTS ────────────────────────────────────────────────────────
    case "weight":
    case "height":
    case "duration":
    case "reps":
    case "sets":
    case "year":
    case "month":
    case "kcal":
    case "met":
    case "kcalPerHour":
    case "rom":
    case "efficency":
    case "buffer":
      // 1) it must be a string (we need the raw text to detect leading zeros)
      if (typeof value !== "string") {
        return false;
      }

      const raw = value.trim();

      // 2) reject bad formats and ANY leading-zero integer
      //    - (?!0\d) disallows "02", "0123", "001.5"
      //    - \d+         matches "1", "42", "1234"
      //    - \d*\.\d+    matches ".5", "0.75", "1.23"
      const re = /^(?!0\d)(?:\d+|\d*\.\d+)$/;
      if (!re.test(raw)) {
        return false;
      }

      // 3) finally coerce and check that it’s > 0
      const num = parseFloat(raw);
      return num > 0;
    case "carbon":
    case "protein":
    case "fat":
      if (typeof value !== "string") {
        return false;
      }

      const raws = value.trim();

      // 2) reject bad formats and ANY leading-zero integer
      //    - (?!0\d) disallows "02", "0123", "001.5"
      //    - \d+         matches "1", "42", "1234"
      //    - \d*\.\d+    matches ".5", "0.75", "1.23"
      const res = /^(?!0\d)(?:\d+|\d*\.\d+)$/;
      if (!res.test(raws)) {
        return false;
      }

      // 3) finally coerce and check that it’s > 0
      const nums = parseFloat(raws);
      return nums >= 0;

    // ── FALLBACK ───────────────────────────────────────────────────────────
    default:
      console.warn("Unknown validator:", type);
      return false;
  }
}
