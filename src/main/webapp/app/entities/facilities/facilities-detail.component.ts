import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Facilities } from './facilities.model';
import { FacilitiesService } from './facilities.service';

@Component({
    selector: 'jhi-facilities-detail',
    templateUrl: './facilities-detail.component.html'
})
export class FacilitiesDetailComponent implements OnInit, OnDestroy {

    facilities: Facilities;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private facilitiesService: FacilitiesService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFacilities();
    }

    load(id) {
        this.facilitiesService.find(id)
            .subscribe((facilitiesResponse: HttpResponse<Facilities>) => {
                this.facilities = facilitiesResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFacilities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'facilitiesListModification',
            (response) => this.load(this.facilities.id)
        );
    }
}
