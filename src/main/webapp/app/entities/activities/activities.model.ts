import { BaseEntity } from './../../shared';

export class Activities implements BaseEntity {
    constructor(
        public id?: number,
        public activityName?: string,
        public activityDetails?: string,
        public imageContentType?: string,
        public image?: any,
    ) {
    }
}
