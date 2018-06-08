import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ActivitiesComponent } from './activities.component';
import { ActivitiesDetailComponent } from './activities-detail.component';
import { ActivitiesPopupComponent } from './activities-dialog.component';
import { ActivitiesDeletePopupComponent } from './activities-delete-dialog.component';

export const activitiesRoute: Routes = [
    {
        path: 'activities',
        component: ActivitiesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Activities'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'activities/:id',
        component: ActivitiesDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Activities'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const activitiesPopupRoute: Routes = [
    {
        path: 'activities-new',
        component: ActivitiesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Activities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'activities/:id/edit',
        component: ActivitiesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Activities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'activities/:id/delete',
        component: ActivitiesDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Activities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
