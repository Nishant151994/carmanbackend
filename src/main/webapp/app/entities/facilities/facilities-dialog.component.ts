import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Facilities } from './facilities.model';
import { FacilitiesPopupService } from './facilities-popup.service';
import { FacilitiesService } from './facilities.service';

@Component({
    selector: 'jhi-facilities-dialog',
    templateUrl: './facilities-dialog.component.html'
})
export class FacilitiesDialogComponent implements OnInit {

    facilities: Facilities;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private facilitiesService: FacilitiesService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.facilities, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.facilities.id !== undefined) {
            this.subscribeToSaveResponse(
                this.facilitiesService.update(this.facilities));
        } else {
            this.subscribeToSaveResponse(
                this.facilitiesService.create(this.facilities));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Facilities>>) {
        result.subscribe((res: HttpResponse<Facilities>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Facilities) {
        this.eventManager.broadcast({ name: 'facilitiesListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-facilities-popup',
    template: ''
})
export class FacilitiesPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private facilitiesPopupService: FacilitiesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.facilitiesPopupService
                    .open(FacilitiesDialogComponent as Component, params['id']);
            } else {
                this.facilitiesPopupService
                    .open(FacilitiesDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
