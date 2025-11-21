export function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

export function isRequired(value) {
  return value !== undefined && value !== null && value !== '';
}
