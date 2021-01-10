import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Visit} from '../../entity/visit';
import {InitHelper} from '../../helper/init-helper';
import {ActivatedRoute} from '@angular/router';
import {parseString} from 'xml2js';
import {RestService} from '../../rest.service';
import {DoctorUnits} from '../../entity/doctor-units';
import {VisitDeleteConfirmModalComponent} from '../visit-delete-confirm-modal/visit-delete-confirm-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DateHelper} from '../../helper/date-helper';
import {NgForm} from '@angular/forms';
import {DoctorUnit} from '../../entity/doctor-unit';

@Component({
  selector: 'app-visit-edit',
  templateUrl: './visit-edit.component.html',
  styleUrls: ['./visit-edit.component.css']
})
export class VisitEditComponent implements OnInit {
  @ViewChild('f', {static: false}) form: NgForm;

  constructor(public rest: RestService,
              private route: ActivatedRoute,
              private ngbModal: NgbModal) {
  }

  visit: Visit;
  isFetching = false;
  doctorUnits: DoctorUnits;
  selectedDoctorUnitName: string;

  ngOnInit(): void {
    this.visit = InitHelper.initVisit();
    this.getDoctorMe();
    this.doctorUnits = new DoctorUnits();
    this.visit.id = this.route.snapshot.params.id;
    this.getVisit(this.visit.id);
  }

  openConfirmDeleteModal(id): void {
    this.ngbModal.open(VisitDeleteConfirmModalComponent).result.then(() => {
      this.deleteVisit(id);
    });
  }

  deleteVisit(id): void {
    this.rest.deleteVisit(id).subscribe((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }

  getDoctorMe(): void {
    this.rest.getDoctorInfoMe().subscribe((data: any) => {
      this.visit.doctor = data;
    });
  }

  findDoctorUnitInfo(id: string, doctorUnits: DoctorUnits): DoctorUnit {
    for (const unit of doctorUnits.item) {
      if (id === unit.id.toString()) {
        return unit;
      }
    }
  }

  getAllVisitInfo(tempVisit): void {
    const patientAmka = tempVisit.ClinicalDocument.recordTarget[0].patientRole[0].id[0].$.extension;
    this.rest.getPatientInfo(patientAmka).subscribe((data: any) => {
      this.visit.patient = data;
    });

    const doctorUnitId = tempVisit.ClinicalDocument.author[0].assignedAuthor[0].representedOrganization[0].id[0].$.extension;
    this.rest.getDoctorUnitsMe().subscribe((data: any) => {
      this.doctorUnits = data;
      this.visit.unit = this.findDoctorUnitInfo(doctorUnitId, this.doctorUnits);
      this.selectedDoctorUnitName = this.visit.unit.healthCareUnit.unitType.name + ' - ' + this.visit.unit.healthCareUnit.description;
    });

    this.visit.reason = tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
      .entryRelationship[0].observation[0].text[0];

    if (tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
      .entryRelationship[1].observation[0].text !== undefined) {
      this.visit.comments = tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
        .entryRelationship[1].observation[0].text[0];
    }

    this.visit.startDate = tempVisit.ClinicalDocument.effectiveTime[0].low[0].$.value;
    this.visit.startDate = DateHelper.transformDate(this.visit.startDate);

    this.visit.status = tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
      .statusCode[0].$.code;
  }

  getVisit(id): void {
    this.isFetching = true;
    this.rest.getVisit(id).subscribe((data: unknown) => {
      parseString(data, (err, result) => {
        this.getAllVisitInfo(result);
        console.log(result);
      });
      this.isFetching = false;
    });
  }

  editVisit(): void {
    this.rest.editVisit(this.visit, this.visit.id).subscribe((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }
}
