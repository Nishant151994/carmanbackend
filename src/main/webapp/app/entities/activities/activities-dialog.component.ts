import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Activities } from './activities.model';
import { ActivitiesPopupService } from './activities-popup.service';
import { ActivitiesService } from './activities.service';

@Component({
    selector: 'jhi-activities-dialog',
    templateUrl: './activities-dialog.component.html'
})
export class ActivitiesDialogComponent implements OnInit {

    activities: Activities;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private activitiesService: ActivitiesService,
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
        this.dataUtils.clearInputImage(this.activities, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.activities.id !== undefined) {
            this.subscribeToSaveResponse(
                this.activitiesService.update(this.activities));
        } else {
            this.subscribeToSaveResponse(
                this.activitiesService.create(this.activities));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Activities>>) {
        result.subscribe((res: HttpResponse<Activities>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Activities) {
        this.eventManager.broadcast({ name: 'activitiesListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-activities-popup',
    template: ''
})
export class ActivitiesPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private activitiesPopupService: ActivitiesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.activitiesPopupService
                    .open(ActivitiesDialogComponent as Component, params['id']);
            } else {
                this.activitiesPopupService
                    .open(ActivitiesDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
