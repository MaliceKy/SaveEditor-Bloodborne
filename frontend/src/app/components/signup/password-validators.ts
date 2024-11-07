import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"
import { Config } from "../../config";

export const passwordMatchValidator = function (): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
	  const password = control.parent?.get('password');
	  const password2 = control.parent?.get('password2');
  
	  if (password && password2 && password2.value) {
		if (password.value !== password2.value) {
		  return { passwordMismatch: true };
		}
	  }
	  return null;
	};
  }

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  if (value.length < Config.minPasswordLength) {
    return { passwordStrength: `Password must be at least ${Config.minPasswordLength} characters long` };
  }

  let upperCaseCharacters = /[A-Z]+/g
  if (upperCaseCharacters.test(value) === false) {
    return { passwordStrength: `Password requires one uppercase letter` };
  }

  let lowerCaseCharacters = /[a-z]+/g
  if (lowerCaseCharacters.test(value) === false) {
    return { passwordStrength: `Password requires one lowercase letter` };
  }

  let numberCharacters = /[0-9]+/g
  if (numberCharacters.test(value) === false) {
    return { passwordStrength: `Password must contain at least one number` };
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === false) {
    return { passwordStrength: `Password requires one special character` };
  }
  return null;
}