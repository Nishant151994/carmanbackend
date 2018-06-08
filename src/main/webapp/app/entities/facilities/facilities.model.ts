import { BaseEntity } from './../../shared';

export class Facilities implements BaseEntity {
    constructor(
        public id?: number,
        public facilityName?: string,
        public facilityDetails?: string,
        public imageContentType?: string,
        public image?: any,
    ) {
    }
}
