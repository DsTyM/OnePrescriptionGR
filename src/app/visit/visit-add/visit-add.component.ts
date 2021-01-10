import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../rest.service';
import {InitHelper} from '../../helper/init-helper';
import {Visit} from '../../entity/visit';
import {DoctorUnits} from '../../entity/doctor-units';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-visit-add',
  templateUrl: './visit-add.component.html',
  styleUrls: ['./visit-add.component.css']
})
export class VisitAddComponent implements OnInit {
  @Input() visitData = {reason: '', comments: '', patientAmka: '', selectedUnit: ''};
  @ViewChild('f', {static: false}) form: NgForm;

  constructor(public rest: RestService) {
  }

  visit: Visit;
  doctorUnits: DoctorUnits;
  selectedDoctorUnitName: string;

  ngOnInit(): void {
    this.visit = InitHelper.initVisit();
    this.doctorUnits = new DoctorUnits();
    this.getDoctorMe();
    this.getDoctorUnitsMe();
  }

  createVisit(): void {
    this.visit.reason = this.visitData.reason.trim();
    this.visit.comments = this.visitData.comments.trim();

    const patientAmka = this.visitData.patientAmka.trim();

    this.getPatient(patientAmka);

    this.addVisit();
  }

  getDoctorMe(): void {
    this.rest.getDoctorInfoMe().subscribe((data: any) => {
      this.visit.doctor = data;
    });
  }

  getDoctorUnitsMe(): void {
    this.rest.getDoctorUnitsMe().subscribe((data: any) => {
      this.doctorUnits = data;
      this.selectDoctorUnit(this.doctorUnits.item[0].id);
    });
  }

  selectDoctorUnit(id): void {
    this.visit.unit.id = id.toString().trim();
    for (const unit of this.doctorUnits.item) {
      if (unit.id === id) {
        this.selectedDoctorUnitName = unit.healthCareUnit.unitType.name + ' - ' + unit.healthCareUnit.description;
        break;
      }
    }
  }

  getPatient(amka): void {
    amka = amka.toString().trim();
    this.rest.getPatientInfo(amka).subscribe((data: any) => {
      this.visit.patient = data;
    });
  }

  addVisit(): void {
    this.rest.addVisit(this.visit).subscribe((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }
}
