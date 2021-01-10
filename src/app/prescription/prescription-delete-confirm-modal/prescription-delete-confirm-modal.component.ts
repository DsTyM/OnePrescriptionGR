import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prescription-delete-confirm-modal',
  templateUrl: './prescription-delete-confirm-modal.component.html',
  styleUrls: ['./prescription-delete-confirm-modal.component.css']
})
export class PrescriptionDeleteConfirmModalComponent implements OnInit {
  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }
}
