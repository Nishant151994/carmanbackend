import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Galary } from './galary.model';
import { GalaryService } from './galary.service';

@Component({
    selector: 'jhi-galary-detail',
    templateUrl: './galary-detail.component.html'
})
export class GalaryDetailComponent implements OnInit, OnDestroy {

    galary: Galary;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private galaryService: GalaryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGalaries();
    }

    load(id) {
        this.galaryService.find(id)
            .subscribe((galaryResponse: HttpResponse<Galary>) => {
                this.galary = galaryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGalaries() {
        this.eventSubscriber = this.eventManager.subscribe(
            'galaryListModification',
            (response) => this.load(this.galary.id)
        );
    }
}
