/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CarmanBackendTestModule } from '../../../test.module';
import { FacilitiesDetailComponent } from '../../../../../../main/webapp/app/entities/facilities/facilities-detail.component';
import { FacilitiesService } from '../../../../../../main/webapp/app/entities/facilities/facilities.service';
import { Facilities } from '../../../../../../main/webapp/app/entities/facilities/facilities.model';

describe('Component Tests', () => {

    describe('Facilities Management Detail Component', () => {
        let comp: FacilitiesDetailComponent;
        let fixture: ComponentFixture<FacilitiesDetailComponent>;
        let service: FacilitiesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CarmanBackendTestModule],
                declarations: [FacilitiesDetailComponent],
                providers: [
                    FacilitiesService
                ]
            })
            .overrideTemplate(FacilitiesDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FacilitiesDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FacilitiesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Facilities(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.facilities).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
