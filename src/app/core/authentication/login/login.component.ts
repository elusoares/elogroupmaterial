import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormValidatorService } from '../../services/custom-form-validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private customFormValidatorService: CustomFormValidatorService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        this.customFormValidatorService.patternValidator(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { invalidEmail: true })
      ]),
      password: new FormControl('', Validators.required)
    });
    this.hide = true;
   }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.valid) {
      console.log('form valido');
      this.router.navigateByUrl('/leads');
    } else {
      console.log('form invalido');
    }
  }

}
