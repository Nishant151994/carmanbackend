import { BaseEntity } from './../../shared';

export class Galary implements BaseEntity {
    constructor(
        public id?: number,
        public galaryName?: string,
    ) {
    }
}
