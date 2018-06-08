import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Galary } from './galary.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Galary>;

@Injectable()
export class GalaryService {

    private resourceUrl =  SERVER_API_URL + 'api/galaries';

    constructor(private http: HttpClient) { }

    create(galary: Galary): Observable<EntityResponseType> {
        const copy = this.convert(galary);
        return this.http.post<Galary>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(galary: Galary): Observable<EntityResponseType> {
        const copy = this.convert(galary);
        return this.http.put<Galary>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Galary>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Galary[]>> {
        const options = createRequestOption(req);
        return this.http.get<Galary[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Galary[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Galary = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Galary[]>): HttpResponse<Galary[]> {
        const jsonResponse: Galary[] = res.body;
        const body: Galary[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Galary.
     */
    private convertItemFromServer(galary: Galary): Galary {
        const copy: Galary = Object.assign({}, galary);
        return copy;
    }

    /**
     * Convert a Galary to a JSON which can be sent to the server.
     */
    private convert(galary: Galary): Galary {
        const copy: Galary = Object.assign({}, galary);
        return copy;
    }
}
