import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Galary } from './galary.model';
import { GalaryPopupService } from './galary-popup.service';
import { GalaryService } from './galary.service';

@Component({
    selector: 'jhi-galary-dialog',
    templateUrl: './galary-dialog.component.html'
})
export class GalaryDialogComponent implements OnInit {

    galary: Galary;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private galaryService: GalaryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.galary.id !== undefined) {
            this.subscribeToSaveResponse(
                this.galaryService.update(this.galary));
        } else {
            this.subscribeToSaveResponse(
                this.galaryService.create(this.galary));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Galary>>) {
        result.subscribe((res: HttpResponse<Galary>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Galary) {
        this.eventManager.broadcast({ name: 'galaryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-galary-popup',
    template: ''
})
export class GalaryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private galaryPopupService: GalaryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.galaryPopupService
                    .open(GalaryDialogComponent as Component, params['id']);
            } else {
                this.galaryPopupService
                    .open(GalaryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
