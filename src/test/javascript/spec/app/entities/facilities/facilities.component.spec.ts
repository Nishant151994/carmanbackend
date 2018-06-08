/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CarmanBackendTestModule } from '../../../test.module';
import { FacilitiesComponent } from '../../../../../../main/webapp/app/entities/facilities/facilities.component';
import { FacilitiesService } from '../../../../../../main/webapp/app/entities/facilities/facilities.service';
import { Facilities } from '../../../../../../main/webapp/app/entities/facilities/facilities.model';

describe('Component Tests', () => {

    describe('Facilities Management Component', () => {
        let comp: FacilitiesComponent;
        let fixture: ComponentFixture<FacilitiesComponent>;
        let service: FacilitiesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CarmanBackendTestModule],
                declarations: [FacilitiesComponent],
                providers: [
                    FacilitiesService
                ]
            })
            .overrideTemplate(FacilitiesComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FacilitiesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FacilitiesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Facilities(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.facilities[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
