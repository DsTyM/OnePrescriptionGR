import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {throwError, BehaviorSubject, Observable} from 'rxjs';

import {properties} from '../../environments/properties';
import {SecurityHelper} from '../helper/security-helper';
import {Doctor} from '../entity/doctor';

@Injectable({providedIn: 'root'})
export class AuthService {
  doctor = new BehaviorSubject<Doctor>(null);
  expiresIn = 24 * 60 * (60 - 1) * 1000;
  private expirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string): Observable<Doctor> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + SecurityHelper.base64Encode(username + ':' + password),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': properties.apiKey
      }),
      params: urlParams
    };
    return this.http.get<Doctor>('http://localhost:8080/https://eps.e-prescription.gr/doctorapi/api/v1/me', httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          resData.authentication = 'Basic ' + SecurityHelper.base64Encode(username + ':' + password);
          resData.lastConnected = Date.now();
          this.handleAuthentication(resData);
        })
      );
  }

  autoLogin(): void {
    const loadedDoctor: Doctor = JSON.parse(localStorage.getItem('doctorData'));
    if (!loadedDoctor) {
      return;
    }

    if (new Date(+loadedDoctor.lastConnected.toString()).getTime() + this.expiresIn <= new Date(Date.now()).getTime()) {
      this.logout();
    } else {
      const millisecondsToExpire = ((new Date(+loadedDoctor.lastConnected.toString()).getTime() + this.expiresIn)
        - new Date(Date.now()).getTime());
      this.autoLogout(millisecondsToExpire);
    }

    if (loadedDoctor.id != null && loadedDoctor.id !== '') {
      this.doctor.next(loadedDoctor);
    }
  }

  logout(): void {
    this.doctor.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('doctorData');
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(doctor: Doctor): void {
    this.doctor.next(doctor);
    this.autoLogout(this.expiresIn);
    localStorage.setItem('doctorData', JSON.stringify(doctor));
  }

  handleError(): Observable<never> {
    const errorMessage = 'Εμφανίστηκε κάποιο σφάλμα!';

    return throwError(errorMessage);
  }
}
