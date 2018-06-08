import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Facilities } from './facilities.model';
import { FacilitiesPopupService } from './facilities-popup.service';
import { FacilitiesService } from './facilities.service';

@Component({
    selector: 'jhi-facilities-delete-dialog',
    templateUrl: './facilities-delete-dialog.component.html'
})
export class FacilitiesDeleteDialogComponent {

    facilities: Facilities;

    constructor(
        private facilitiesService: FacilitiesService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.facilitiesService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'facilitiesListModification',
                content: 'Deleted an facilities'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-facilities-delete-popup',
    template: ''
})
export class FacilitiesDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private facilitiesPopupService: FacilitiesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.facilitiesPopupService
                .open(FacilitiesDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
