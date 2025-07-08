export default function validator(
  validator: string,
  value: string,
  compareValue?: string
): boolean {
  switch (validator) {
    case "email":
      return /\S+@\S+\.\S+/.test(value);

    case "password":
      // at least 6 characters, contains a number
      return value.length >= 6;

    case "userName":
      // not empty and at least 3 characters
      return value.trim().length >= 3;

    case "confirmPassword":
      // must match compareValue
      return value === compareValue;

    default:
      console.warn("Unknown validator:", validator);
      return false;
  }
}
