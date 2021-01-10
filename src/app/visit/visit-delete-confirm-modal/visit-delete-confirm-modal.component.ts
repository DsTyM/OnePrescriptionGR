import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-visit-delete-confirm-modal',
  templateUrl: './visit-delete-confirm-modal.component.html',
  styleUrls: ['./visit-delete-confirm-modal.component.css']
})
export class VisitDeleteConfirmModalComponent implements OnInit {
  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }
}
