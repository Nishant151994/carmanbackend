import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Galary } from './galary.model';
import { GalaryPopupService } from './galary-popup.service';
import { GalaryService } from './galary.service';

@Component({
    selector: 'jhi-galary-delete-dialog',
    templateUrl: './galary-delete-dialog.component.html'
})
export class GalaryDeleteDialogComponent {

    galary: Galary;

    constructor(
        private galaryService: GalaryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.galaryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'galaryListModification',
                content: 'Deleted an galary'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-galary-delete-popup',
    template: ''
})
export class GalaryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private galaryPopupService: GalaryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.galaryPopupService
                .open(GalaryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
