import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../rest.service';
import {InitHelper} from '../../helper/init-helper';
import {Prescription} from '../../entity/prescription';
import {ActivatedRoute} from '@angular/router';
import {parseString} from 'xml2js';
import {Medicines} from '../../entity/medicines';
import {Medicine} from '../../entity/medicine';
import {Icd10s} from '../../entity/icd10s';
import {Icd10} from '../../entity/icd10';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {DateHelper} from '../../helper/date-helper';
import {Visit} from '../../entity/visit';

@Component({
  selector: 'app-prescription-add',
  templateUrl: './prescription-add.component.html',
  styleUrls: ['./prescription-add.component.css']
})
export class PrescriptionAddComponent implements OnInit {
  @Input() prescriptionData = {comments: '', medicineName: '', icd10title: '', icd10description: '', diseaseName: ''};
  @ViewChild('f', {static: false}) form: NgForm;

  public checkboxGroupForm: FormGroup;

  constructor(public rest: RestService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
  }

  prescription: Prescription;

  visit: Visit;

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

  repeatibilities = [
    {id: 1, description: 'Απλή'},
    {id: 3, description: '3μηνη'},
    {id: 4, description: '4μηνη'},
    {id: 5, description: '5μηνη'},
    {id: 6, description: '6μηνη'},
  ];
  selectedRepeatability = this.repeatibilities[0];

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
    this.prescription.visit.id = this.route.snapshot.params.visitId;
    this.visit = InitHelper.initVisit();

    // When we create a new prescription, we should give this id (barcode),
    // as the user will not give any id.
    this.prescription.id = '0000000000000';

    this.getDoctorMe();
    this.getVisit(this.prescription.visit.id);
    this.getDiseases();
    this.getReasonsForBrandNamedMedicinesBeautified();

    this.checkboxGroupForm = this.formBuilder.group({
      isChronicIllness: false,
      isMonthlyPrescription: false,
      isTwoMonthsPrescription: false,
      isPrescribedByBrandNameMedicine: false
    });
  }

  createPrescription(): void {
    this.prescription.comments = this.prescriptionData.comments.trim();
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

    this.prescription.info.repeatability = this.selectedRepeatability;

    // +false equals 0 and +true equals 1
    this.prescription.isChronicIllness = +this.checkboxGroupForm.value.isChronicIllness;
    this.prescription.isMonthlyPrescription = +this.checkboxGroupForm.value.isMonthlyPrescription;
    this.prescription.isTwoMonthsPrescription = +this.checkboxGroupForm.value.isTwoMonthsPrescription;

    this.prescription.isPrescribedByBrandNameMedicine = +this.checkboxGroupForm.value.isPrescribedByBrandNameMedicine;
    this.prescription.info.reasonForBrandNamedMedicines = this.selectedReasonForBrandNamedMedicines;

    this.prescription.createdDate = DateHelper.getTodayDatePlusDays(0);
    this.prescription.cancelledDate = DateHelper.getTodayDatePlusDays(7);

    this.prescription.disease = this.selectedDisease;

    this.addPrescription();
  }

  getDoctorMe(): void {
    this.rest.getDoctorInfoMe().subscribe((data: any) => {
      this.prescription.doctor = data;
    });
  }

  searchMedicines(): void {
    if (this.prescriptionData.medicineName.trim() !== '') {
      this.rest.getMedicinesList(this.prescriptionData.medicineName).subscribe((data: any) => {
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
        this.selectMedicineDailyDose(this.selectedMedicineDailyDoseArray[0]);
        break;
      }
    }
  }

  searchICD10s(): void {
    if (this.prescriptionData.icd10title.trim() === '' && this.prescriptionData.icd10description.trim() === '') {
      this.icd10s = null;
    } else {
      this.rest.getICD10sList(this.prescriptionData.icd10title, this.prescriptionData.icd10description).subscribe((data: any) => {
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

  selectRepeatability(rep1): void {
    this.selectedRepeatability = rep1;
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
    if (this.prescriptionData.diseaseName.trim() === '') {
      this.searchedDiseases = null;
    } else {
      this.searchedDiseases = [];
      const badDiseaseIds = [1];
      for (const disease of this.diseases) {
        if (!badDiseaseIds.includes(disease.id) && disease.name.toString().includes(this.prescriptionData.diseaseName)) {
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

  addPrescription(): void {
    this.rest.addPrescription(this.prescription).subscribe((result) => {
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

    this.visit.reason = tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
      .entryRelationship[0].observation[0].text[0];

    if (tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
      .entryRelationship[1].observation[0].text !== undefined) {
      this.visit.comments = tempVisit.ClinicalDocument.component[0].structuredBody[0].component[0].section[0].entry[0].encounter[0]
        .entryRelationship[1].observation[0].text[0];
    }

    this.visit.startDate = tempVisit.ClinicalDocument.effectiveTime[0].low[0].$.value;
    this.visit.startDate = DateHelper.transformDate(this.visit.startDate);
  }

  getVisit(id): void {
    this.rest.getVisit(id).subscribe((data: unknown) => {
      parseString(data, (err, result) => {
        this.getRequiredVisitInfo(result);
        console.log(result);
      });
    });
  }
}
