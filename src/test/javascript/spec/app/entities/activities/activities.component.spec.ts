/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CarmanBackendTestModule } from '../../../test.module';
import { ActivitiesComponent } from '../../../../../../main/webapp/app/entities/activities/activities.component';
import { ActivitiesService } from '../../../../../../main/webapp/app/entities/activities/activities.service';
import { Activities } from '../../../../../../main/webapp/app/entities/activities/activities.model';

describe('Component Tests', () => {

    describe('Activities Management Component', () => {
        let comp: ActivitiesComponent;
        let fixture: ComponentFixture<ActivitiesComponent>;
        let service: ActivitiesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CarmanBackendTestModule],
                declarations: [ActivitiesComponent],
                providers: [
                    ActivitiesService
                ]
            })
            .overrideTemplate(ActivitiesComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ActivitiesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ActivitiesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Activities(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.activities[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
