import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormValidatorService } from '../../services/custom-form-validator.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private customFormValidatorService: CustomFormValidatorService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        this.customFormValidatorService.patternValidator(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { invalidEmail: true })
      ]),
      password: new FormControl('', [
        // 1. Password Field is Required
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
      // confirmPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [
        Validators.required,
        // this.customValidatorService.passwordMatchValidator(this.loginForm.controls)
      ]),
    },
    {
      // check whether our password and confirm password match
      // I don't understand why this validator is added here instead of
      // to the confirmPassword control
      // validator: this.customFormValidatorService.passwordMatchValidator
      validator: this.customFormValidatorService.MatchPassword('password', 'confirmPassword')
    }
    );
   }

  ngOnInit(): void {
    console.log(this.signupForm.controls);
  }

  register() {
    if (this.signupForm.valid) {
      console.log('form valido');
      this.router.navigateByUrl('/login');
    } else {
      console.log('form invalido');
    }

  }

  passwordHasError() {
    let passwordControl = this.signupForm.get('password');
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
    // return this.signupForm.get('password');
  }

}
