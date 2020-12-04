import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/modules/user/user-model';
import { CustomFormValidatorService } from '../../services/custom-form-validator.service';
import { FakeBackendService } from '../../services/fake-backend.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  // essas variaveis 'hide' sao para controlar o botao de mostrar/esconder a senha.
  // eu peguei isso de https://fireflysemantics.medium.com/angular-material-password-field-with-visibilitytoggle-d5342f97afbe
  hideConfirmPassword: boolean;
  hidePassword: boolean;
  takenUserError: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private customFormValidatorService: CustomFormValidatorService,
    private fakeBackendService: FakeBackendService,
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
      confirmPassword: new FormControl('', Validators.required)
    },
    /* {
      // check whether password and confirm password match.
      // I don't understand why this validator is added here instead of
      // confirmPassword control.
      validator: this.customFormValidatorService.matchPasswordValidator('password', 'confirmPassword')
    }, */
    );
    // this.signupForm.
    this.hideConfirmPassword = true;
    this.hidePassword = true;
    this.takenUserError = false;
    this.signupForm.setValidators(Validators.compose([
      this.customFormValidatorService.matchPasswordValidator('password', 'confirmPassword'),
      this.customFormValidatorService.takenUserValidator(this.takenUserError, 'email')
    ])
    );
  }

  ngOnInit(): void {
  }

  register() {
    if (this.signupForm.valid) {
      console.log('form valido');
      let newUser: UserModel = new UserModel(
        this.signupForm.get('name').value,
        this.signupForm.get('email').value,
        this.signupForm.get('password').value,
        []
      );
      this.fakeBackendService.register(newUser).subscribe((res) => {
        this.router.navigateByUrl('/login');
      },
      (error) => {
        console.log(error);
        this.takenUserError = true;
      });
    } else {
      console.log('form invalido');
    }

  }

  // criei essa função para mostrar um único aviso embaixo do input de password.
  // os avisos de erros específicos (tamanho minimo de 8, caractere especial etc) ficam na parte superior do form
  passwordHasError() {
    const passwordControl = this.signupForm.get('password');
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
