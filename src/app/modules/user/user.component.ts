import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomFormValidatorService } from 'src/app/core/services/custom-form-validator.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  hidePassword: boolean;
  hideNewPassword: boolean;
  hideConfirmPassword: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private customFormValidatorService: CustomFormValidatorService,
  ) {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        this.customFormValidatorService.patternValidator(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { invalidEmail: true })
      ]),
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        // 1. New password Field is Required
        Validators.required,
        // 2. Has a minimum length of 8 characters
        Validators.minLength(8),
        // 3. Check whether the entered password has a number
        this.customFormValidatorService.patternValidator(/\d/, { hasNumber: true }),
        // 4. Check whether the entered password has a special character
        this.customFormValidatorService.patternValidator(/\W/, { hasSpecialCharacter: true }),
        // 5. Check whether the entered password has a letter
        this.customFormValidatorService.patternValidator(/[A-Za-z]/, { hasLetter: true })
      ]),
      confirmPassword: new FormControl('', Validators.required)
    },
    {
      // check whether password and confirm password match
      // I don't understand why this validator is added here instead of
      // to the confirmPassword control.
      // validator: this.customFormValidatorService.passwordMatchValidator
      validator: this.customFormValidatorService.matchPassword('password', 'confirmPassword')
    }
    );
    this.hidePassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
   }

  ngOnInit(): void {
  }

  saveUser() {

  }

  newPasswordHasError() {
    let passwordControl = this.userForm.get('newPassword');
    if (
      passwordControl.hasError('minlength') ||
      passwordControl.hasError('hasNumber') ||
      passwordControl.hasError('hasSpecialCharacter') ||
      passwordControl.hasError('hasLetter')
    ) {
      return true;
    } else {
      return false;
    }
  }

}
