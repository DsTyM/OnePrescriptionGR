import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {XmlTemplates} from './xml-templates';
import {Visit} from './entity/visit';
import {NgbdModalContentComponent} from './ngbd-modal-content/ngbd-modal-content.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {properties} from '../environments/properties';
import {Prescription} from './entity/prescription';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient,
              private modalService: NgbModal,
              private authService: AuthService) {
  }

  endpoint = 'http://localhost:8080/https://eps.e-prescription.gr/doctorapi/api/v1/';

  httpHeadersForJSONResponse = new HttpHeaders({
    Authorization: this.authService.doctor.value.authentication.toString(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key': properties.apiKey
  });

  httpHeadersForXHL7Response = new HttpHeaders({
    Authorization: this.authService.doctor.value.authentication.toString(),
    Accept: 'application/x-hl7',
    'Content-Type': 'application/x-hl7',
    'api-key': properties.apiKey
  });

  httpHeadersForXMLResponse = new HttpHeaders({
    Authorization: this.authService.doctor.value.authentication.toString(),
    Accept: 'application/xml',
    'Content-Type': 'application/xml',
    'api-key': properties.apiKey
  });

  httpHeadersForPDFResponse = new HttpHeaders({
    Authorization: this.authService.doctor.value.authentication.toString(),
    Accept: 'application/pdf, application/xml',
    'Content-Type': 'application/xml',
    'api-key': properties.apiKey
  });

  private static extractData(res: Response): {} {
    return res || {};
  }

  getVisits(): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'me/visits', httpOptions).pipe(
      map(RestService.extractData));
  }

  getVisit(id): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    return this.http.get(this.endpoint + 'me/visits/' + id, httpOptions).pipe(
      // @ts-ignore
      map(RestService.extractData));
  }

  getPatientInfo(amka): Observable<any> {
    let urlParams = new HttpParams();
    urlParams = urlParams.append('amka', amka);
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'patients', httpOptions).pipe(
      map(RestService.extractData));
  }

  getDoctorInfoMe(): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'me', httpOptions).pipe(
      map(RestService.extractData));
  }

  getDoctorUnitsMe(): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'me/units', httpOptions).pipe(
      map(RestService.extractData));
  }

  addVisit(visit: Visit): Observable<any> {
    const urlParams = new HttpParams();
    const xmlData = XmlTemplates.addVisitXMLTemplate(visit);
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    // @ts-ignore
    return this.http.post<any>(this.endpoint + 'me/visits', xmlData, httpOptions).pipe(
      tap(() => {
        console.log(`new visit created`);
        this.openCreateVisitResultModal('Η επίσκεψη δημιουργήθηκε με επιτυχία!');
      }),
      catchError((error: any) => {
        console.error(error);
        console.log(`addVisit failed: ${error.message}`);
        this.openCreateVisitResultModal('Η επίσκεψη δεν δημιουργήθηκε!<br>Κωδικός Σφάλματος:<br>' + error.error);
        // Let the app keep running by returning an empty result.
        return of(null);
      })
    );
  }

  openCreateVisitResultModal(result: string): void {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Επίσκεψη';
    modalRef.componentInstance.result = result;
    modalRef.componentInstance.redirectRelativeURL = '/visits';
  }

  openCreatePrescriptionResultModal(result: string): void {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Συνταγή';
    modalRef.componentInstance.result = result;
    modalRef.componentInstance.redirectRelativeURL = '/prescriptions';
  }

  editVisit(visit: Visit, visitId): Observable<any> {
    const urlParams = new HttpParams();
    const xmlData = XmlTemplates.editVisitXMLTemplate(visit);
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    // @ts-ignore
    return this.http.put<any>(this.endpoint + 'me/visits/' + visitId, xmlData, httpOptions).pipe(
      tap(() => {
        console.log(`visit with id: ` + visitId + ` edited`);
        this.openCreateVisitResultModal('Η επίσκεψη επεξεργάστηκε με επιτυχία!');
      }),
      catchError((error: any) => {
        console.error(error);
        console.log(`editVisit failed: ${error.message}`);
        this.openCreateVisitResultModal('Η επίσκεψη δεν επεξεργάστηκε!<br>Κωδικός Σφάλματος:<br>' + error.error);
        // Let the app keep running by returning an empty result.
        return of(null);
      })
    );
  }

  deleteVisit(id): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    // @ts-ignore
    return this.http.put<any>(this.endpoint + 'me/visits/' + id + '/cancel', '', httpOptions).pipe(
      tap(() => {
        console.log(`visit was canceled`);
        this.openCreateVisitResultModal('Η επίσκεψη ακυρώθηκε με επιτυχία!');
      }),
      catchError((error: any) => {
        console.error(error);
        console.log(`deleteVisit failed: ${error.message}`);
        this.openCreateVisitResultModal('Η επίσκεψη δεν ακυρώθηκε!<br>Κωδικός Σφάλματος:<br>' + error.error);
        return of(null);
      })
    );
  }

  getPrescriptions(): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'me/prescriptions', httpOptions).pipe(
      map(RestService.extractData));
  }

  getPrescription(id): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    return this.http.get(this.endpoint + 'me/prescriptions/' + id, httpOptions).pipe(
      // @ts-ignore
      map(RestService.extractData));
  }

  deletePrescription(id): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    // @ts-ignore
    return this.http.put<any>(this.endpoint + 'me/prescriptions/' + id + '/cancel', '', httpOptions).pipe(
      tap(() => {
        console.log(`prescription was canceled`);
        this.openCreatePrescriptionResultModal('Η συνταγή ακυρώθηκε με επιτυχία!');
      }),
      catchError((error: any) => {
        console.error(error);
        console.log(`deletePrescription failed: ${error.message}`);
        this.openCreatePrescriptionResultModal('Η συνταγή δεν ακυρώθηκε!<br>Κωδικός Σφάλματος:<br>' + error.error);
        return of(null);
      })
    );
  }

  addPrescription(prescription: Prescription): Observable<any> {
    const urlParams = new HttpParams();
    const xmlData = XmlTemplates.addOrEditPrescriptionXMLTemplate(prescription);
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    // @ts-ignore
    return this.http.post<any>(this.endpoint + 'me/prescriptions', xmlData, httpOptions).pipe(
      tap(() => {
        console.log(`new prescription created`);
        this.openCreatePrescriptionResultModal('Η συνταγή δημιουργήθηκε με επιτυχία!');
      }),
      catchError((error: any) => {
        console.error(error);
        console.log(`addPrescription failed: ${error.message}`);
        this.openCreatePrescriptionResultModal('Η συνταγή δεν δημιουργήθηκε!<br>Κωδικός Σφάλματος:<br>' + error.error);
        // Let the app keep running by returning an empty result.
        return of(null);
      })
    );
  }

  editPrescription(prescription: Prescription): Observable<any> {
    const urlParams = new HttpParams();
    const xmlData = XmlTemplates.addOrEditPrescriptionXMLTemplate(prescription);
    const httpOptions = {
      headers: this.httpHeadersForXHL7Response,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    // @ts-ignore
    return this.http.post<any>(this.endpoint + 'me/prescriptions', xmlData, httpOptions).pipe(
      tap(() => {
        console.log(`prescription edited`);
        this.openCreatePrescriptionResultModal('Η συνταγή επεξεργάστηκε με επιτυχία!');
      }),
      catchError((error: any) => {
        console.error(error);
        console.log(`editPrescription failed: ${error.message}`);
        this.openCreatePrescriptionResultModal('Η συνταγή δεν επεξεργάστηκε!<br>' +
          'Κωδικός Σφάλματος:<br>' + error.error);
        // Let the app keep running by returning an empty result.
        return of(null);
      })
    );
  }

  getMedicinesList(name): Observable<any> {
    let urlParams = new HttpParams();
    urlParams = urlParams.append('commercialName', name);
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'masterdata/medicines', httpOptions).pipe(
      map(RestService.extractData));
  }

  getMedicine(barcode): Observable<any> {
    let urlParams = new HttpParams();
    urlParams = urlParams.append('barcode', barcode);
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'masterdata/medicines', httpOptions).pipe(
      map(RestService.extractData));
  }

  getICD10sList(title, description): Observable<any> {
    let urlParams = new HttpParams();
    urlParams = urlParams.append('icd10title', title);
    urlParams = urlParams.append('icd10description', description);
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'masterdata/icd10s', httpOptions).pipe(
      map(RestService.extractData));
  }

  getReasonsForBrandNamedMedicines(): Observable<any> {
    const urlParams = new HttpParams();
    const httpOptions = {
      headers: this.httpHeadersForXMLResponse,
      params: urlParams,
      responseType: 'text' as 'text'
    };
    return this.http.get(this.endpoint + 'masterdata/noinncases', httpOptions).pipe(
      // @ts-ignore
      map(RestService.extractData));
  }

  getDiseases(): Observable<any> {
    let urlParams = new HttpParams();
    urlParams = urlParams.append('size', '200');
    const httpOptions = {
      headers: this.httpHeadersForJSONResponse,
      params: urlParams
    };
    return this.http.get(this.endpoint + 'masterdata/diseases', httpOptions).pipe(
      map(RestService.extractData));
  }

  getDownloadPrescriptionAsPDF(id): Observable<any> {
    return this.http.get(this.endpoint + 'me/prescriptions/' + id + '/print', {
      headers: this.httpHeadersForPDFResponse,
      responseType: 'blob'
    }).pipe(catchError((error: any) => {
      console.error(error);
      console.log(`getDownloadPrescriptionAsPDF failed: ${error.message}`);
      this.openCreatePrescriptionResultModal('Η συνταγή δεν είναι δυνατόν να κατέβει όταν αυτή έχει ακυρωθεί!');
      // Let the app keep running by returning an empty result.
      return of(null);
    }));
  }
}
