import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CarmanBackendImagesModule } from './images/images.module';
import { CarmanBackendGalaryModule } from './galary/galary.module';
import { CarmanBackendActivitiesModule } from './activities/activities.module';
import { CarmanBackendFacilitiesModule } from './facilities/facilities.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        CarmanBackendImagesModule,
        CarmanBackendGalaryModule,
        CarmanBackendActivitiesModule,
        CarmanBackendFacilitiesModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarmanBackendEntityModule {}
