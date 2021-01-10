import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InitHelper} from '../../helper/init-helper';
import {ActivatedRoute} from '@angular/router';
import {parseString} from 'xml2js';
import {RestService} from '../../rest.service';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {Prescription} from '../../entity/prescription';
import {Medicines} from '../../entity/medicines';
import {Medicine} from '../../entity/medicine';
import {Icd10s} from '../../entity/icd10s';
import {Icd10} from '../../entity/icd10';
import {DateHelper} from '../../helper/date-helper';
import {PrescriptionDeleteConfirmModalComponent} from '../prescription-delete-confirm-modal/prescription-delete-confirm-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prescription-edit',
  templateUrl: './prescription-edit.component.html',
  styleUrls: ['./prescription-edit.component.css']
})
export class PrescriptionEditComponent implements OnInit {
  @Input() prescriptionData = {icd10description: ''};
  @ViewChild('f', {static: false}) form: NgForm;

  public checkboxGroupForm: FormGroup;

  constructor(public rest: RestService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private ngbModal: NgbModal) {
  }

  isFetching = false;

  prescription: Prescription;

  medicines: Medicines;
  selectedMedicineName: string;
  selectedMedicine: Medicine;
  selectedMedicineDailyDoseArray: string[];
  selectedMedicineDailyDose: string;
  selectedTreatmentDuration: string;

  icd10s: Icd10s;
  selectedIcd10Name: string;
  selectedIcd10: Icd10;

  participationPercentages: string[] = ['0', '10', '25', '100'];
  selectedParticipationPercentage = this.participationPercentages[1];

  reasonsForBrandNamedMedicines: [{
    'id': unknown;
    'name': unknown;
  }];
  selectedReasonForBrandNamedMedicines: {
    'id': unknown;
    'name': unknown;
  };

  diseases: any;
  searchedDiseases: any;
  selectedDisease: {
    'id': unknown;
    'name': unknown;
  };

  ngOnInit(): void {
    this.prescription = InitHelper.initPrescription();
    this.prescription.id = this.route.snapshot.params.prescriptionId;

    this.getPrescription(this.prescription.id);

    this.getDoctorMe();
    this.getDiseases();
    this.getReasonsForBrandNamedMedicinesBeautified();

    this.checkboxGroupForm = this.formBuilder.group({
      isChronicIllness: false,
      isMonthlyPrescription: false,
      isTwoMonthsPrescription: false,
      isPrescribedByBrandNameMedicine: false
    });
  }

  editPrescription(): void {
    if (this.prescription.comments === '') {
      this.prescription.comments = ' ';
    }

    this.prescription.medicine.barcode = this.selectedMedicine.barcode;

    this.prescription.medicine.code = this.selectedMedicine.eofCode;
    this.prescription.medicine.doseUnit = this.selectedMedicine.doseUnit;
    this.prescription.medicine.dailyDose = this.selectedMedicineDailyDose;
    this.prescription.medicine.treatmentDuration = this.selectedTreatmentDuration;
    this.prescription.medicine.name = this.selectedMedicineName;

    this.prescription.icd10.code = this.selectedIcd10.code;
    this.prescription.icd10.diagnosis = this.selectedIcd10.title;

    this.prescription.patientParticipationPercentage = this.selectedParticipationPercentage;

    this.prescription.isChronicIllness = +this.checkboxGroupForm.value.isChronicIllness;
    this.prescription.isMonthlyPrescription = +this.checkboxGroupForm.value.isMonthlyPrescription;
    this.prescription.isTwoMonthsPrescription = +this.checkboxGroupForm.value.isTwoMonthsPrescription;

    this.prescription.isPrescribedByBrandNameMedicine = +this.checkboxGroupForm.value.isPrescribedByBrandNameMedicine;
    this.prescription.info.reasonForBrandNamedMedicines = this.selectedReasonForBrandNamedMedicines;

    this.prescription.createdDate = DateHelper.getTodayDatePlusDays(0);
    this.prescription.cancelledDate = DateHelper.getTodayDatePlusDays(7);

    this.prescription.disease = this.selectedDisease;

    this.addOrEditPrescription();
  }

  getDoctorMe(): void {
    this.rest.getDoctorInfoMe().subscribe((data: any) => {
      this.prescription.doctor = data;
    });
  }

  searchMedicines(): void {
    if (this.prescription.medicine.name.toString().trim() !== '') {
      this.rest.getMedicinesList(this.prescription.medicine.name.toString()).subscribe((data: any) => {
        this.medicines = data;
        this.selectMedicine(this.medicines.item[0].barcode);
      });
    } else {
      this.medicines = null;
    }
  }

  selectMedicine(barcode): void {
    for (const medicine of this.medicines.item) {
      if (medicine.barcode === barcode) {
        this.selectedMedicineName = medicine.commercialName + ' ' + medicine.formCode + ' ' + medicine.content + ' ' +
          medicine.packageForm;
        this.selectedMedicine = medicine;
        this.selectedMedicineDailyDoseArray = medicine.dailyDose.toString().split(',');

        if (this.selectedMedicineDailyDose === null
          || this.selectedMedicineDailyDose.trim() === ''
          || !this.selectedMedicineDailyDoseArray.includes(this.selectedMedicineDailyDose)) {
          this.selectMedicineDailyDose(this.selectedMedicineDailyDoseArray[0]);
        }

        break;
      }
    }
  }

  searchICD10s(): void {
    if (this.prescription.icd10.diagnosis.toString().trim() === '' && this.prescriptionData.icd10description.trim() === '') {
      this.icd10s = null;
    } else {
      this.rest.getICD10sList(this.prescription.icd10.diagnosis.toString(), this.prescriptionData.icd10description).subscribe(
        (data: any) => {
          this.icd10s = data;
          this.selectICD10(this.icd10s.item[0].code);
        });
    }
  }

  selectICD10(code): void {
    for (const icd10 of this.icd10s.item) {
      if (icd10.code === code) {
        this.selectedIcd10Name = icd10.title.toString();
        this.selectedIcd10 = icd10;
        break;
      }
    }
  }

  selectParticipationPercentage(per1): void {
    this.selectedParticipationPercentage = per1;
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
        this.selectReasonForBrandNamedMedicines(this.reasonsForBrandNamedMedicines[0]);
      });
    });
  }

  selectReasonForBrandNamedMedicines(reason): void {
    this.selectedReasonForBrandNamedMedicines = reason;
  }

  getDiseases(): void {
    this.rest.getDiseases().subscribe((data: any) => {
      this.diseases = data.item;
    });
  }

  searchDiseases(): void {
    if (this.prescription.disease.name.toString().trim() === '') {
      this.searchedDiseases = null;
    } else {
      this.searchedDiseases = [];
      const badDiseaseIds = [1];
      for (const disease of this.diseases) {
        if (!badDiseaseIds.includes(disease.id) && disease.name.toString().includes(this.prescription.disease.name)) {
          this.searchedDiseases.push(disease);
        }
      }
      this.selectDisease(this.searchedDiseases[0].id);
    }
  }

  selectDisease(id): void {
    for (const disease of this.searchedDiseases) {
      if (disease.id === id) {
        this.selectedDisease = disease;
        break;
      }
    }
  }

  selectMedicineDailyDose(dailyDose): void {
    this.selectedMedicineDailyDose = dailyDose;
    this.selectTreatmentDuration();
  }

  selectTreatmentDuration(): void {
    if (this.selectedMedicineDailyDose.trim() === 'ΕΛΕΥΘΕΡΟ') {
      this.selectedTreatmentDuration = '1';
    } else if (this.selectedMedicineDailyDose.trim().includes('/')) {
      const fraction = this.selectedMedicineDailyDose.trim().split('/');
      this.selectedTreatmentDuration = Math.ceil(+fraction[1] * +this.selectedMedicine.dosePerPackage / +fraction[0]).toString();
    } else {
      this.selectedTreatmentDuration = Math.ceil(+this.selectedMedicine.dosePerPackage / +this.selectedMedicineDailyDose.trim())
        .toString();
    }
  }

  addOrEditPrescription(): void {
    this.rest.editPrescription(this.prescription).subscribe((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }

  getRequiredVisitInfo(tempVisit): void {
    const patientAmka = tempVisit.ClinicalDocument.recordTarget[0].patientRole[0].id[0].$.extension;
    this.rest.getPatientInfo(patientAmka).subscribe((data: any) => {
      this.prescription.patient = data;
    });
  }

  getVisit(id): void {
    this.rest.getVisit(id).subscribe((data: unknown) => {
      parseString(data, (err, result) => {
        this.getRequiredVisitInfo(result);
        console.log(result);
      });
    });
  }

  getAllPrescriptionInfo(tempPrescription): void {
    // ClinicalDocument/recordTarget/0/patientRole/0/id/0/$/extension
    const patientAmka = tempPrescription.ClinicalDocument.recordTarget[0].patientRole[0].id[0].$.extension;
    this.rest.getPatientInfo(patientAmka).subscribe((data: any) => {
      this.prescription.patient = data;
    });

    this.prescription.startDate = tempPrescription.ClinicalDocument.effectiveTime[0].low[0].$.value;
    this.prescription.startDate = DateHelper.transformDate(this.prescription.startDate);

    this.prescription.title = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].title[0];

    this.prescription.status = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[1]
      .substanceAdministration[0].statusCode[0].$.code;

    this.prescription.visit.id = tempPrescription.ClinicalDocument.componentOf[0].encompassingEncounter[0].id[0].$.extension;

    this.getVisit(this.prescription.visit.id);

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

    this.prescription.medicine.code = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].consumable[0].manufacturedProduct[0].manufacturedMaterial[0].code[0].$.code;

    this.prescription.medicine.dailyDose = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].doseQuantity[0].low[0].$.value;

    this.selectedMedicine = new Medicine();
    this.rest.getMedicine(this.prescription.medicine.barcode).subscribe((data1: any) => {
      this.prescription.medicine.name = data1.item[0].commercialName;
      this.rest.getMedicinesList(this.prescription.medicine.name).subscribe((data2: any) => {
        this.medicines = data2;
        this.selectedMedicineDailyDose = this.prescription.medicine.dailyDose.toString();
        this.selectMedicine(this.prescription.medicine.barcode);
        this.selectMedicineDailyDose(this.prescription.medicine.dailyDose);
      });
    });

    this.prescription.icd10.code = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].entryRelationship[0].observation[0].value[0].$.code;

    this.prescription.icd10.diagnosis = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].entryRelationship[0].observation[0].value[0].$.displayName;

    this.rest.getICD10sList(this.prescription.icd10.diagnosis.toString(), '').subscribe(
      (data: any) => {
        this.icd10s = data;
        this.selectICD10(this.prescription.icd10.code);
      });

    this.prescription.comments = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].entryRelationship[0].observation[0].text[0];

    if (tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id !== undefined) {
      this.prescription.disease.id = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
        .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id[2].$.extension;

      this.prescription.disease.name = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
        .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id[3].$.extension;
      this.rest.getDiseases().subscribe((data: any) => {
        this.diseases = data.item;
        this.searchDiseases();
        for (const disease of this.searchedDiseases) {
          if (disease.name === this.prescription.disease.name) {
            this.selectedDisease = disease;
            break;
          }
        }
      });

      this.prescription.patientParticipationPercentage = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
        .section[0].entry[1].substanceAdministration[0].entryRelationship[1].act[0].id[0].$.extension;
      this.selectParticipationPercentage(Math.floor(+this.prescription.patientParticipationPercentage));
    }

    this.prescription.info.repeatability.id = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0]
      .section[0].entry[0].act[0].id[2].$.extension;

    const attributes = tempPrescription.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].act[0].id;

    this.prescription.isChronicIllness = this.getPrescriptionAttributeById('1.10.9', attributes);

    this.prescription.isMonthlyPrescription = this.getPrescriptionAttributeById('1.4.9', attributes);

    this.prescription.isTwoMonthsPrescription = this.getPrescriptionAttributeById('1.4.10', attributes);

    this.prescription.isPrescribedByBrandNameMedicine = this.getPrescriptionAttributeById('1.1.3.1', attributes);

    this.checkboxGroupForm.setValue({
      isChronicIllness: this.prescription.isChronicIllness === '1',
      isMonthlyPrescription: this.prescription.isMonthlyPrescription === '1',
      isTwoMonthsPrescription: this.prescription.isTwoMonthsPrescription === '1',
      isPrescribedByBrandNameMedicine: this.prescription.isPrescribedByBrandNameMedicine === '1'
    });

    if (this.prescription.isPrescribedByBrandNameMedicine === '1') {
      this.prescription.info.reasonForBrandNamedMedicines.id = this.getPrescriptionAttributeById('1.1.3.2', attributes);
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

          for (const reason in this.reasonsForBrandNamedMedicines) {
            if (this.reasonsForBrandNamedMedicines.hasOwnProperty(reason)
              && this.reasonsForBrandNamedMedicines[reason].id === this.prescription.info.reasonForBrandNamedMedicines.id) {
              this.selectReasonForBrandNamedMedicines(this.reasonsForBrandNamedMedicines[reason]);
            }
          }
        });
      });
    }
  }

  getPrescriptionAttributeById(id, attributes): any {
    for (const attribute of attributes) {
      if (attribute.$.root.trim() === id.trim()) {
        return attribute.$.extension;
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
