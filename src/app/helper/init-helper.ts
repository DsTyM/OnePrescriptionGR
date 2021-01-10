import {Visit} from '../entity/visit';
import {Patient} from '../entity/patient';
import {Doctor} from '../entity/doctor';
import {DoctorUnit} from '../entity/doctor-unit';
import {Prescription} from '../entity/prescription';

export class InitHelper {
  static initVisit(): Visit {
    const visit = new Visit();
    visit.patient = new Patient();
    visit.doctor = new Doctor();
    visit.unit = new DoctorUnit();

    return visit;
  }

  static initPrescription(): Prescription {
    const prescription = new Prescription();
    prescription.patient = new Patient();
    prescription.doctor = new Doctor();
    prescription.unit = new DoctorUnit();
    prescription.visit = {
      id: '',
      reason: '',
      comments: '',
      startDate: ''
    };
    prescription.medicine = {
      name: '',
      barcode: '',
      code: '',
      quantity: '',
      content: '',
      doseUnit: '',
      dailyDose: '',
      treatmentDuration: '',
      activeSubstanceDescription: ''
    };
    prescription.icd10 = {
      code: '',
      diagnosis: ''
    };
    prescription.disease = {
      id: '',
      name: ''
    };
    prescription.info = {
      repeatability: {
        id: '',
        description: ''
      }, reasonForBrandNamedMedicines: {
        id: '',
        name: ''
      }
    };

    return prescription;
  }
}
