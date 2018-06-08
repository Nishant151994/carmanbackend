/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CarmanBackendTestModule } from '../../../test.module';
import { GalaryComponent } from '../../../../../../main/webapp/app/entities/galary/galary.component';
import { GalaryService } from '../../../../../../main/webapp/app/entities/galary/galary.service';
import { Galary } from '../../../../../../main/webapp/app/entities/galary/galary.model';

describe('Component Tests', () => {

    describe('Galary Management Component', () => {
        let comp: GalaryComponent;
        let fixture: ComponentFixture<GalaryComponent>;
        let service: GalaryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CarmanBackendTestModule],
                declarations: [GalaryComponent],
                providers: [
                    GalaryService
                ]
            })
            .overrideTemplate(GalaryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GalaryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GalaryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Galary(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.galaries[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
