/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CarmanBackendTestModule } from '../../../test.module';
import { GalaryDetailComponent } from '../../../../../../main/webapp/app/entities/galary/galary-detail.component';
import { GalaryService } from '../../../../../../main/webapp/app/entities/galary/galary.service';
import { Galary } from '../../../../../../main/webapp/app/entities/galary/galary.model';

describe('Component Tests', () => {

    describe('Galary Management Detail Component', () => {
        let comp: GalaryDetailComponent;
        let fixture: ComponentFixture<GalaryDetailComponent>;
        let service: GalaryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CarmanBackendTestModule],
                declarations: [GalaryDetailComponent],
                providers: [
                    GalaryService
                ]
            })
            .overrideTemplate(GalaryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GalaryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GalaryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Galary(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.galary).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
