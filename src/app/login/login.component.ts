import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {Doctor} from '../entity/doctor';

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.logout();
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    let authObs: Observable<Doctor>;
    authObs = this.authService.login(username, password);

    this.isLoading = true;

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
