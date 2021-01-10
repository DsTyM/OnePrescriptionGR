import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {Doctor} from '../entity/doctor';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private doctorSub: Subscription;
  doctor: Doctor;

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.doctorSub = this.authService.doctor.subscribe(doctor => {
      this.isAuthenticated = !!doctor;
      this.doctor = doctor;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.doctorSub.unsubscribe();
  }
}
