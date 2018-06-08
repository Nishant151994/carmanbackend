import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { FacilitiesComponent } from './facilities.component';
import { FacilitiesDetailComponent } from './facilities-detail.component';
import { FacilitiesPopupComponent } from './facilities-dialog.component';
import { FacilitiesDeletePopupComponent } from './facilities-delete-dialog.component';

export const facilitiesRoute: Routes = [
    {
        path: 'facilities',
        component: FacilitiesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Facilities'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'facilities/:id',
        component: FacilitiesDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Facilities'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const facilitiesPopupRoute: Routes = [
    {
        path: 'facilities-new',
        component: FacilitiesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Facilities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'facilities/:id/edit',
        component: FacilitiesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Facilities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'facilities/:id/delete',
        component: FacilitiesDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Facilities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
