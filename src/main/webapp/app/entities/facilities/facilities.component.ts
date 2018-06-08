import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Facilities } from './facilities.model';
import { FacilitiesService } from './facilities.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-facilities',
    templateUrl: './facilities.component.html'
})
export class FacilitiesComponent implements OnInit, OnDestroy {
facilities: Facilities[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private facilitiesService: FacilitiesService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.facilitiesService.query().subscribe(
            (res: HttpResponse<Facilities[]>) => {
                this.facilities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInFacilities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Facilities) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInFacilities() {
        this.eventSubscriber = this.eventManager.subscribe('facilitiesListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
