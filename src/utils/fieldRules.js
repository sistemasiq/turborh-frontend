import { emailRegex } from "./fieldRegex";

export const ruleFieldRequired = (value) => {
    return !!value || 'El campo es obligatorio *'
}

export const ruleFieldMinLength = (minLength) => {
  return (val) =>
    (val && val.length >= minLength) ||
    `Debe tener al menos ${minLength} caracteres.`;
};

export const ruleFieldIsEmail = (value) => {

  return emailRegex.test(value) || 'El correo electrónico debe ser válido'

}

/**
 * Function to check if all required fields are non-empty, defined, and not null.
 *
 * @param {Array} fields - An array of field values to check.
 * @returns {boolean} - Returns true if all fields are valid, false otherwise.
 */
export const checkNonEmptyFields = (val) => {
  for (let i = 0; i < val.length; i++) {
    // Check if the value is empty, undefined, or null
    if (val[i] === "" || val[i] === undefined || val[i] === null) {
      console.log("Field", i, "is empty or invalid:", val[i]);
      return false; // Return false if any field is empty
    }
  }
  return true; // Return true if all fields are valid
};