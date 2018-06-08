import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Activities } from './activities.model';
import { ActivitiesService } from './activities.service';

@Component({
    selector: 'jhi-activities-detail',
    templateUrl: './activities-detail.component.html'
})
export class ActivitiesDetailComponent implements OnInit, OnDestroy {

    activities: Activities;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private activitiesService: ActivitiesService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInActivities();
    }

    load(id) {
        this.activitiesService.find(id)
            .subscribe((activitiesResponse: HttpResponse<Activities>) => {
                this.activities = activitiesResponse.body;
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

    registerChangeInActivities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'activitiesListModification',
            (response) => this.load(this.activities.id)
        );
    }
}
