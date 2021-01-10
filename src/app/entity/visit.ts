import {Patient} from './patient';
import {Doctor} from './doctor';
import {DoctorUnit} from './doctor-unit';

export class Visit {
  'id': string;
  'patient': Patient;
  'doctor': Doctor;
  'unit': DoctorUnit;
  'reason': unknown;
  'comments': unknown;
  'startDate': unknown;
  'status': unknown;
}
