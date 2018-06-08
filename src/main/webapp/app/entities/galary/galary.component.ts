import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Galary } from './galary.model';
import { GalaryService } from './galary.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-galary',
    templateUrl: './galary.component.html'
})
export class GalaryComponent implements OnInit, OnDestroy {
galaries: Galary[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private galaryService: GalaryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.galaryService.query().subscribe(
            (res: HttpResponse<Galary[]>) => {
                this.galaries = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInGalaries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Galary) {
        return item.id;
    }
    registerChangeInGalaries() {
        this.eventSubscriber = this.eventManager.subscribe('galaryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
