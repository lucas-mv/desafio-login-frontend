import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authetication.service';

import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  login = new FormControl(null, [Validators.required]);
  senha = new FormControl(null, [Validators.required]);

  resultMessage: string;

  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = this.fb.group({
      login: this.login,
      senha: this.senha
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.resultMessage = undefined;

    this.authenticationService.login(this.login.value, this.senha.value)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          if (error.status === 401) {
            this.snackBar.open('Deu merda no login', 'Ok', {
              duration: 2000,
            });
          }
        }
      );
  }

}
