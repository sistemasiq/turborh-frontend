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
