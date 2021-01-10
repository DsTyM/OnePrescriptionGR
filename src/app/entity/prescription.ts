import {Patient} from './patient';
import {Doctor} from './doctor';
import {DoctorUnit} from './doctor-unit';

export class Prescription {
  'id': string;
  'title': unknown;
  'patient': Patient;
  'doctor': Doctor;
  'unit': DoctorUnit;
  'startDate': unknown;
  'status': unknown;
  'comments': unknown;
  'patientParticipationPercentage': unknown;
  'createdDate': unknown;
  'cancelledDate': unknown;
  'isChronicIllness': unknown;
  'isMonthlyPrescription': unknown;
  'isTwoMonthsPrescription': unknown;
  'isPrescribedByBrandNameMedicine': unknown;
  'info': {
    'repeatability': {
      'id': unknown;
      'description': unknown;
    },
    'reasonForBrandNamedMedicines': {
      'id': unknown;
      'name': unknown;
    };
  };
  'icd10': {
    'code': unknown;
    'diagnosis': unknown;
  };
  'disease': {
    'id': unknown;
    'name': unknown;
  };
  'visit': {
    'id': unknown;
    'reason': unknown;
    'comments': unknown;
    'startDate': unknown;
  };
  'medicine': {
    'code': unknown;
    'barcode': unknown;
    'name': unknown;
    'quantity': unknown;
    'content': unknown;
    'doseUnit': unknown;
    'dailyDose': unknown;
    'treatmentDuration': unknown;
    'activeSubstanceDescription': unknown;
  };
}
