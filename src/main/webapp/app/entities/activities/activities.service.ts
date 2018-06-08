import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Activities } from './activities.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Activities>;

@Injectable()
export class ActivitiesService {

    private resourceUrl =  SERVER_API_URL + 'api/activities';

    constructor(private http: HttpClient) { }

    create(activities: Activities): Observable<EntityResponseType> {
        const copy = this.convert(activities);
        return this.http.post<Activities>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(activities: Activities): Observable<EntityResponseType> {
        const copy = this.convert(activities);
        return this.http.put<Activities>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Activities>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Activities[]>> {
        const options = createRequestOption(req);
        return this.http.get<Activities[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Activities[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Activities = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Activities[]>): HttpResponse<Activities[]> {
        const jsonResponse: Activities[] = res.body;
        const body: Activities[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Activities.
     */
    private convertItemFromServer(activities: Activities): Activities {
        const copy: Activities = Object.assign({}, activities);
        return copy;
    }

    /**
     * Convert a Activities to a JSON which can be sent to the server.
     */
    private convert(activities: Activities): Activities {
        const copy: Activities = Object.assign({}, activities);
        return copy;
    }
}
