import { IValidationResult } from 'common/types';

export const validate = (field: string, value: string): IValidationResult => {
  if (field === 'identifier') {
    const regex: RegExp = /^[A-Za-z]{1}[0-9A-Za-z_]*$/i;
    if (!regex.test(value)) {
      return {
        valid: false,
        errors: [
          `Identifiers must begin with a letter.`,
          `Identifiers can only contain letters, numbers and underscores.`
        ]
      };
    }
  }

  return { valid: true };
};
