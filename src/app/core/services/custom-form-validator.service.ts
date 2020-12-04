import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
// utilizei esses exemplos:
// https://www.freecodecamp.org/news/how-to-validate-angular-reactive-forms/
// https://codinglatte.com/posts/angular/cool-password-validation-angular/
export class CustomFormValidatorService {

  constructor() { }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  matchPasswordValidator(password: string, confirmPassword: string) {
    console.log(password);
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      /* if (!passwordControl || !confirmPasswordControl) {
        console.log('nao password')
        return null;
      } */

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  takenUserValidator(error: boolean, email: string) {
    console.log(error);
    return (formGroup: FormGroup) => {
      const emailControl = formGroup.controls[email];
      if (error) {
        emailControl.setErrors({takenUser: true});
      }
    };
  }
}
