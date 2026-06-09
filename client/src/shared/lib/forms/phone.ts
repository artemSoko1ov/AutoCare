export const RUSSIAN_PHONE_PLACEHOLDER = "+7 (___) ___-__-__";

const RUSSIAN_PHONE_DIGITS_COUNT = 11;
const RUSSIAN_PHONE_COUNTRY_CODE = "7";

export const normalizeRussianPhoneDigits = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) {
    return "";
  }

  const normalizedDigits =
    digits[0] === "8"
      ? `${RUSSIAN_PHONE_COUNTRY_CODE}${digits.slice(1)}`
      : digits[0] === RUSSIAN_PHONE_COUNTRY_CODE
        ? digits
        : `${RUSSIAN_PHONE_COUNTRY_CODE}${digits}`;

  return normalizedDigits.slice(0, RUSSIAN_PHONE_DIGITS_COUNT);
};

export const formatRussianPhoneInput = (value: string) => {
  const digits = normalizeRussianPhoneDigits(value);

  if (digits.length === 0) {
    return "";
  }

  const localDigits = digits.slice(1);
  let formattedValue = "+7";

  if (localDigits.length > 0) {
    formattedValue += ` (${localDigits.slice(0, 3)}`;
  }

  if (localDigits.length >= 3) {
    formattedValue += ")";
  }

  if (localDigits.length > 3) {
    formattedValue += ` ${localDigits.slice(3, 6)}`;
  }

  if (localDigits.length > 6) {
    formattedValue += `-${localDigits.slice(6, 8)}`;
  }

  if (localDigits.length > 8) {
    formattedValue += `-${localDigits.slice(8, 10)}`;
  }

  return formattedValue;
};

export const isRussianPhoneComplete = (value: string) =>
  normalizeRussianPhoneDigits(value).length === RUSSIAN_PHONE_DIGITS_COUNT;
