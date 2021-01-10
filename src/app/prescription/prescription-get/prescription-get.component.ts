import {Component, OnInit} from '@angular/core';
import {RestService} from '../../rest.service';
import {parseString} from 'xml2js';
import {InitHelper} from '../../helper/init-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {DoctorUnits} from '../../entity/doctor-units';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Prescription} from '../../entity/prescription';
import {DateHelper} from '../../helper/date-helper';
import {PrescriptionDeleteConfirmModalComponent} from '../prescription-delete-confirm-modal/prescription-delete-confirm-modal.component';
import {DoctorUnit} from '../../entity/doctor-unit';

@Component({
  selector: 'app-prescription-get',
  templateUrl: './prescription-get.component.html',
  styleUrls: ['./prescription-get.component.css']
})
export class PrescriptionGetComponent implements OnInit {
  constructor(public rest: RestService,
              private route: ActivatedRoute,
              private router: Router,
              private ngbModal: NgbModal) {
  }

  prescription: Prescription;
  isFetching = false;
  doctorUnits: DoctorUnits;

  repeatibilities = [
    {id: 1, description: 'Απλή'},
    {id: 3, description: '3μηνη'},
    {id: 4, description: '4μηνη'},
    {id: 5, description: '5μηνη'},
    {id: 6, description: '6μηνη'},
  ];

  reasonsForBrandNamedMedicines: [{
    'id': unknown;
    'name': unknown;
  }];

  ngOnInit(): void {
    this.prescription = InitHelper.initPrescription();
    this.getDoctorMe();
    this.doctorUnits = new DoctorUnits();
    this.prescription.id = this.route.snapshot.params.id;
    this.getPrescription(this.prescription.id);
    this.getReasonsForBrandNamedMedicinesBeautified();
  }

  editPrescription(id): void {
    this.router.navigate(['/edit-prescription/' + id]);
  }

  openConfirmDeleteModal(id): void {
    this.ngbModal.open(PrescriptionDeleteConfirmModalComponent).result.then(() => {
      this.deletePrescription(id);
    });
  }

  deletePrescription(id): void {
    this.rest.deletePrescription(id).subscribe((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }

  getDoctorMe(): void {
    this.rest.getDoctorInfoMe().subscribe((data: any) => {
      this.prescription.doctor = data;
    });
  }

  findDoctorUnitInfo(id: string, doctorUnits: DoctorUnits): DoctorUnit {
    for (const unit of doctorUnits.item) {
      if (id === unit.id.toString()) {
        return unit;
      }
    }
  }

  getAllPrescriptionInfo(tempPrescription): void {
    // ClinicalDocument/recordTarget/0/patientRole/0/id/0/$/extension
    const patientAmka = tempPrescription.ClinicalDocument.recordTarget[0].patientRole[0].id[0].$.extension;
    this.rest.getPatientInfo(patientAmka).subscribe((data: any) => {
      this.prescription.patient = data;
    });

    const doctorUnitId = tempPrescription.ClinicalDocument.author[0].assignedAuthor[0].representedOrganization[0].id[0].$.extension;
    this.rest.getDoctorUnitsMe().subscribe((data: any) => {
      this.doctorUnits = data;
      this.prescription.unit = this.findDoctorUnitInfo(doctorUnitId, this.doctorUnits);
    });

    this.prescription.startDate = tempPrescription.ClinicalDocument.effectiveTime[0].low[0].$.value;
    this.prescription.startDate = DateHelper.transformDate(this.prescription.startDate);

    this.prescription.title = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].title[0];

    this.prescription.status = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[1]
      .substanceAdministration[0].statusCode[0].$.code;

    this.prescription.visit.id = tempPrescription.ClinicalDocument.componentOf[0].encompassingEncounter[0].id[0].$.extension;

    this.prescription.visit.reason = tempPrescription.ClinicalDocument.componentOf[0].encompassingEncounter[0].id[5].$.extension;

    this.prescription.visit.comments = tempPrescription.ClinicalDocument.componentOf[0].encompassingEncounter[0].id[4].$.extension;

    this.prescription.visit.startDate = tempPrescription.ClinicalDocument.componentOf[0].encompassingEncounter[0].effectiveTime[0]
      .low[0].$.value;
    this.prescription.visit.startDate = DateHelper.transformDate(this.prescription.visit.startDate);

    this.prescription.medicine.name = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0]
      .entry[1].substanceAdministration[0].consumable[0].manufacturedProduct[0].manufacturedMaterial[0].code[0].$.displayName;

    this.prescription.medicine.barcode = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].text[0].list[0].item[0]._;

    // /ClinicalDocument/component/0/structuredBody/0/component/0/section/0/entry/1/substanceAdministration/0/consumable/0/
    // manufacturedProduct/0/manufacturedMaterial/0/epsos:asContent/0/epsos:containerPackagedMedicine/0/epsos:capacityQuantity
    this.prescription.medicine.quantity = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].consumable[0].manufacturedProduct[0]
      .manufacturedMaterial[0]['epsos:asContent'][0]['epsos:containerPackagedMedicine'][0]['epsos:capacityQuantity'][0].$.value;

    this.prescription.medicine.doseUnit = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].doseQuantity[0].low[0].$.unit;

    this.prescription.medicine.activeSubstanceDescription = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].consumable[0].manufacturedProduct[0]
      .manufacturedMaterial[0]['epsos:ingredient'][0]['epsos:ingredient'][0]['epsos:name'][0];

    this.prescription.icd10.code = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].entryRelationship[0].observation[0].value[0].$.code;

    this.prescription.icd10.diagnosis = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].entryRelationship[0].observation[0].value[0].$.displayName;

    this.prescription.comments = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].entryRelationship[0].observation[0].text[0];

    this.prescription.medicine.code = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].consumable[0].manufacturedProduct[0].manufacturedMaterial[0].code[0].$.code;

    this.prescription.medicine.dailyDose = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].doseQuantity[0].low[0].$.value;

    if (tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id !== undefined) {
      this.prescription.disease.id = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
        .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id[2].$.extension;

      this.prescription.disease.name = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
        .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id[3].$.extension;

      this.prescription.patientParticipationPercentage = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
        .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id[0].$.extension;
    }

    this.prescription.info.repeatability.id = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].id[2].$.extension;
    this.setRepeatability(this.prescription.info.repeatability.id);

    const attributes = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].act[0].id;

    this.prescription.isChronicIllness = this.getPrescriptionAttributeById('1.10.9', attributes);

    this.prescription.isMonthlyPrescription = this.getPrescriptionAttributeById('1.4.9', attributes);

    this.prescription.isTwoMonthsPrescription = this.getPrescriptionAttributeById('1.4.10', attributes);

    this.prescription.isPrescribedByBrandNameMedicine = this.getPrescriptionAttributeById('1.1.3.1', attributes);

    if (this.prescription.isPrescribedByBrandNameMedicine === '1') {
      this.prescription.info.reasonForBrandNamedMedicines.id = this.getPrescriptionAttributeById('1.1.3.2', attributes);
      this.setReasonForBrandNamedMedicines(this.prescription.info.reasonForBrandNamedMedicines.id);
    }

    this.prescription.medicine.treatmentDuration = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].rateQuantity[0].low[0].$.value;
  }

  getPrescriptionAttributeById(id, attributes): any {
    for (const attribute of attributes) {
      if (attribute.$.root.trim() === id.trim()) {
        return attribute.$.extension;
      }
    }
  }

  setRepeatability(id): void {
    for (const rep of this.repeatibilities) {
      if (rep.id.toString() === id) {
        this.prescription.info.repeatability = rep;
        break;
      }
    }
  }

  getReasonsForBrandNamedMedicinesBeautified(): void {
    const beautifiedArray: any = [];
    this.rest.getReasonsForBrandNamedMedicines().subscribe((data) => {
      parseString(data, (err, result) => {
        for (const item of result.Page.contents[0].item) {
          beautifiedArray.push({
            id: item.id[0],
            name: item.name[0]
          });
        }
        this.reasonsForBrandNamedMedicines = beautifiedArray;
      });
    });
  }

  setReasonForBrandNamedMedicines(id): void {
    for (const reason of this.reasonsForBrandNamedMedicines) {
      if (reason.id.toString() === id) {
        this.prescription.info.reasonForBrandNamedMedicines = reason;
        break;
      }
    }
  }

  getPrescription(id): void {
    this.isFetching = true;
    this.rest.getPrescription(id).subscribe((data: unknown) => {
      parseString(data, (err, result) => {
        this.getAllPrescriptionInfo(result);
        console.log(result);
      });
      this.isFetching = false;
    });
  }

  downloadPrescriptionAsPDF(id): void {
    this.rest.getDownloadPrescriptionAsPDF(id).subscribe((data: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = 'prescription_' + this.prescription.patient.firstName + '_' + this.prescription.patient.lastName
        // @ts-ignore
        + '_' + this.prescription.startDate.replaceAll('/', '_') + '.pdf';
      link.click();
    });
  }
}
