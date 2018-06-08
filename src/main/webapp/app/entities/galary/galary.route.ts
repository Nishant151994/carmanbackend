import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GalaryComponent } from './galary.component';
import { GalaryDetailComponent } from './galary-detail.component';
import { GalaryPopupComponent } from './galary-dialog.component';
import { GalaryDeletePopupComponent } from './galary-delete-dialog.component';

export const galaryRoute: Routes = [
    {
        path: 'galary',
        component: GalaryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Galaries'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'galary/:id',
        component: GalaryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Galaries'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const galaryPopupRoute: Routes = [
    {
        path: 'galary-new',
        component: GalaryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Galaries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'galary/:id/edit',
        component: GalaryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Galaries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'galary/:id/delete',
        component: GalaryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Galaries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
