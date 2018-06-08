import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Activities } from './activities.model';
import { ActivitiesPopupService } from './activities-popup.service';
import { ActivitiesService } from './activities.service';

@Component({
    selector: 'jhi-activities-delete-dialog',
    templateUrl: './activities-delete-dialog.component.html'
})
export class ActivitiesDeleteDialogComponent {

    activities: Activities;

    constructor(
        private activitiesService: ActivitiesService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.activitiesService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'activitiesListModification',
                content: 'Deleted an activities'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-activities-delete-popup',
    template: ''
})
export class ActivitiesDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private activitiesPopupService: ActivitiesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.activitiesPopupService
                .open(ActivitiesDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
