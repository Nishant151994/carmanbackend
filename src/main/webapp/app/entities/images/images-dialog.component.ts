import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Images } from './images.model';
import { ImagesPopupService } from './images-popup.service';
import { ImagesService } from './images.service';
import { Galary, GalaryService } from '../galary';
import { Activities, ActivitiesService } from '../activities';
import { Facilities, FacilitiesService } from '../facilities';

@Component({
    selector: 'jhi-images-dialog',
    templateUrl: './images-dialog.component.html'
})
export class ImagesDialogComponent implements OnInit {

    images: Images;
    isSaving: boolean;

    galaries: Galary[];

    activities: Activities[];

    facilities: Facilities[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private imagesService: ImagesService,
        private galaryService: GalaryService,
        private activitiesService: ActivitiesService,
        private facilitiesService: FacilitiesService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.galaryService.query()
            .subscribe((res: HttpResponse<Galary[]>) => { this.galaries = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.activitiesService.query()
            .subscribe((res: HttpResponse<Activities[]>) => { this.activities = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.facilitiesService.query()
            .subscribe((res: HttpResponse<Facilities[]>) => { this.facilities = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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
        this.dataUtils.clearInputImage(this.images, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.images.id !== undefined) {
            this.subscribeToSaveResponse(
                this.imagesService.update(this.images));
        } else {
            this.subscribeToSaveResponse(
                this.imagesService.create(this.images));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Images>>) {
        result.subscribe((res: HttpResponse<Images>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Images) {
        this.eventManager.broadcast({ name: 'imagesListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackGalaryById(index: number, item: Galary) {
        return item.id;
    }

    trackActivitiesById(index: number, item: Activities) {
        return item.id;
    }

    trackFacilitiesById(index: number, item: Facilities) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-images-popup',
    template: ''
})
export class ImagesPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private imagesPopupService: ImagesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.imagesPopupService
                    .open(ImagesDialogComponent as Component, params['id']);
            } else {
                this.imagesPopupService
                    .open(ImagesDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
