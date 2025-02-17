import { emailRegex, dateRegex } from "./fieldRegex";

export const ruleFieldRequired = (value) => {
  return !!value || 'El campo es obligatorio *'
}

export const ruleValidDate = (value) => {

  if (!dateRegex.test(value)) {
    return 'Formato inválido (AAAA/MM/DD)';
  }

  // Verificar si es una fecha válida
  const [year, month, day] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return 'Fecha inválida';
  }

  return true;

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

/**
 * Validates that a start date is before to an end date.
 * @param {string} startDateVal - The start date in a valid date format.
 * @param {string} endDateVal - The end date in a valid date format.
 * @returns {boolean|string} - Returns true if the start date is before or equal to the end date, otherwise returns an error message.
 */
export const dateRelationshipRule = (startDateVal, endDateVal) => {
  const startDate = new Date(startDateVal);
  const endDate = new Date(endDateVal);
  if (startDate && endDate) {
    return (
      startDate < endDate ||
      "La fecha de fin debe ser despues a la fecha de inicio"
    );
  }
};