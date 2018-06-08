/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CarmanBackendTestModule } from '../../../test.module';
import { ActivitiesDetailComponent } from '../../../../../../main/webapp/app/entities/activities/activities-detail.component';
import { ActivitiesService } from '../../../../../../main/webapp/app/entities/activities/activities.service';
import { Activities } from '../../../../../../main/webapp/app/entities/activities/activities.model';

describe('Component Tests', () => {

    describe('Activities Management Detail Component', () => {
        let comp: ActivitiesDetailComponent;
        let fixture: ComponentFixture<ActivitiesDetailComponent>;
        let service: ActivitiesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CarmanBackendTestModule],
                declarations: [ActivitiesDetailComponent],
                providers: [
                    ActivitiesService
                ]
            })
            .overrideTemplate(ActivitiesDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ActivitiesDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ActivitiesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Activities(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.activities).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
