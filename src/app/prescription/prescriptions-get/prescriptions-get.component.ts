import {Component, OnInit} from '@angular/core';
import {RestService} from '../../rest.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrescriptionDeleteConfirmModalComponent} from '../prescription-delete-confirm-modal/prescription-delete-confirm-modal.component';
import {PrescriptionsList} from '../../entity/prescriptions-list';

@Component({
  selector: 'app-prescriptions-get',
  templateUrl: './prescriptions-get.component.html',
  styleUrls: ['./prescriptions-get.component.css']
})
export class PrescriptionsGetComponent implements OnInit {
  constructor(public rest: RestService,
              private router: Router,
              private ngbModal: NgbModal) {
  }

  prescriptions: PrescriptionsList;
  isFetching = false;

  ngOnInit(): void {
    this.getPrescriptions();
  }

  openConfirmDeleteModal(id): void {
    this.ngbModal.open(PrescriptionDeleteConfirmModalComponent).result.then(() => {
      this.deletePrescription(id);
    });
  }

  editPrescription(id): void {
    this.router.navigate(['/edit-prescription/' + id]);
  }

  viewPrescriptionDetails(id): void {
    this.router.navigate(['/prescription-details/' + id]);
  }

  getPrescriptions(): void {
    this.prescriptions = null;
    this.isFetching = true;
    this.rest.getPrescriptions().subscribe((data: PrescriptionsList) => {
      console.log(data);
      this.prescriptions = data;
      this.isFetching = false;
    });
  }

  deletePrescription(id): void {
    this.rest.deletePrescription(id).subscribe((result) => {
      console.log(result);
      if (result !== null) {
        for (const prescription of this.prescriptions.item) {
          if (prescription.barcode === id) {
            prescription.status.status = 'ΑΚΥΡΩΜΕΝΗ';
          }
        }
      }
    }, (err) => {
      console.log(err);
    });
  }
}
