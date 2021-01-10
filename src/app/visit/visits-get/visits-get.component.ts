import {Component, OnInit} from '@angular/core';
import {RestService} from '../../rest.service';
import {VisitsList} from '../../entity/visits-list';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VisitDeleteConfirmModalComponent} from '../visit-delete-confirm-modal/visit-delete-confirm-modal.component';

@Component({
  selector: 'app-visits-get',
  templateUrl: './visits-get.component.html',
  styleUrls: ['./visits-get.component.css']
})
export class VisitsGetComponent implements OnInit {
  constructor(public rest: RestService,
              private router: Router,
              private ngbModal: NgbModal) {
  }

  visits: VisitsList;
  isFetching = false;

  ngOnInit(): void {
    this.getVisits();
  }

  createVisit(): void {
    this.router.navigate(['/create-visit']);
  }

  openConfirmDeleteModal(id): void {
    this.ngbModal.open(VisitDeleteConfirmModalComponent).result.then(() => {
      this.deleteVisit(id);
    });
  }

  editVisit(id): void {
    this.router.navigate(['/visit-edit/' + id]);
  }

  viewVisitDetails(id): void {
    this.router.navigate(['/visit-details/' + id]);
  }

  getVisits(): void {
    this.visits = null;
    this.isFetching = true;

    this.rest.getVisits().subscribe((data: VisitsList) => {
      console.log(data);
      this.visits = data;
      this.isFetching = false;
    });
  }

  deleteVisit(id): void {
    this.rest.deleteVisit(id).subscribe((result) => {
      console.log(result);
      if (result !== null) {
        for (const visit of this.visits.item) {
          if (visit.id === id) {
            visit.status.status = 'Ακυρωμένη';
          }
        }
      }
    }, (err) => {
      console.log(err);
    });
  }
}
