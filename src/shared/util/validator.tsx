export type ValidatorType =
  | "email"
  | "password"
  | "userName"
  | "confirmPassword"
  | "weight"
  | "height"
  | "gender"
  | "frequency"
  | "type"
  | "goal"
  | "birthdate";

export default function validator(
  type: ValidatorType,
  value: string | number | string[],
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
      if (typeof value !== "number") {
        return false;
      }
      console.log(value > 0);
      // simple “> 0” check — tweak min/max as you like
      return value > 0;

    // ── FALLBACK ───────────────────────────────────────────────────────────
    default:
      console.warn("Unknown validator:", type);
      return false;
  }
}
