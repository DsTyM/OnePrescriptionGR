import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ngbd-modal-content',
  templateUrl: './ngbd-modal-content.component.html',
  styleUrls: ['./ngbd-modal-content.component.css']
})
export class NgbdModalContentComponent implements OnInit {
  @Input() result;
  @Input() title;
  @Input() redirectRelativeURL;

  constructor(public activeModal: NgbActiveModal,
              private router: Router) {
  }

  close(command): void {
    this.router.navigate([this.redirectRelativeURL]);
    this.activeModal.close(command);
  }

  ngOnInit(): void {
  }
}
