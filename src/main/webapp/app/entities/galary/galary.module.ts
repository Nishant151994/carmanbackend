import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarmanBackendSharedModule } from '../../shared';
import {
    GalaryService,
    GalaryPopupService,
    GalaryComponent,
    GalaryDetailComponent,
    GalaryDialogComponent,
    GalaryPopupComponent,
    GalaryDeletePopupComponent,
    GalaryDeleteDialogComponent,
    galaryRoute,
    galaryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...galaryRoute,
    ...galaryPopupRoute,
];

@NgModule({
    imports: [
        CarmanBackendSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GalaryComponent,
        GalaryDetailComponent,
        GalaryDialogComponent,
        GalaryDeleteDialogComponent,
        GalaryPopupComponent,
        GalaryDeletePopupComponent,
    ],
    entryComponents: [
        GalaryComponent,
        GalaryDialogComponent,
        GalaryPopupComponent,
        GalaryDeleteDialogComponent,
        GalaryDeletePopupComponent,
    ],
    providers: [
        GalaryService,
        GalaryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarmanBackendGalaryModule {}
