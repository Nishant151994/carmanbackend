import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarmanBackendSharedModule } from '../../shared';
import {
    FacilitiesService,
    FacilitiesPopupService,
    FacilitiesComponent,
    FacilitiesDetailComponent,
    FacilitiesDialogComponent,
    FacilitiesPopupComponent,
    FacilitiesDeletePopupComponent,
    FacilitiesDeleteDialogComponent,
    facilitiesRoute,
    facilitiesPopupRoute,
} from './';

const ENTITY_STATES = [
    ...facilitiesRoute,
    ...facilitiesPopupRoute,
];

@NgModule({
    imports: [
        CarmanBackendSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        FacilitiesComponent,
        FacilitiesDetailComponent,
        FacilitiesDialogComponent,
        FacilitiesDeleteDialogComponent,
        FacilitiesPopupComponent,
        FacilitiesDeletePopupComponent,
    ],
    entryComponents: [
        FacilitiesComponent,
        FacilitiesDialogComponent,
        FacilitiesPopupComponent,
        FacilitiesDeleteDialogComponent,
        FacilitiesDeletePopupComponent,
    ],
    providers: [
        FacilitiesService,
        FacilitiesPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarmanBackendFacilitiesModule {}
