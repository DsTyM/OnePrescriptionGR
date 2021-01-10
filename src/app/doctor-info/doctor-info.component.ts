import {Component, OnInit} from '@angular/core';
import {RestService} from '../rest.service';
import {Doctor} from '../entity/doctor';

@Component({
  selector: 'app-doctor-info',
  templateUrl: './doctor-info.component.html',
  styleUrls: ['./doctor-info.component.css']
})
export class DoctorInfoComponent implements OnInit {
  constructor(public rest: RestService) {
  }

  doctor: Doctor;
  isFetching = false;

  ngOnInit(): void {
    this.getDoctorMe();
  }

  getDoctorMe(): void {
    this.isFetching = true;
    this.rest.getDoctorInfoMe().subscribe((data: any) => {
      this.doctor = data;
      this.isFetching = false;
    });
  }
}
