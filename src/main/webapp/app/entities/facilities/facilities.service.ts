import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Facilities } from './facilities.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Facilities>;

@Injectable()
export class FacilitiesService {

    private resourceUrl =  SERVER_API_URL + 'api/facilities';

    constructor(private http: HttpClient) { }

    create(facilities: Facilities): Observable<EntityResponseType> {
        const copy = this.convert(facilities);
        return this.http.post<Facilities>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(facilities: Facilities): Observable<EntityResponseType> {
        const copy = this.convert(facilities);
        return this.http.put<Facilities>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Facilities>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Facilities[]>> {
        const options = createRequestOption(req);
        return this.http.get<Facilities[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Facilities[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Facilities = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Facilities[]>): HttpResponse<Facilities[]> {
        const jsonResponse: Facilities[] = res.body;
        const body: Facilities[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Facilities.
     */
    private convertItemFromServer(facilities: Facilities): Facilities {
        const copy: Facilities = Object.assign({}, facilities);
        return copy;
    }

    /**
     * Convert a Facilities to a JSON which can be sent to the server.
     */
    private convert(facilities: Facilities): Facilities {
        const copy: Facilities = Object.assign({}, facilities);
        return copy;
    }
}
