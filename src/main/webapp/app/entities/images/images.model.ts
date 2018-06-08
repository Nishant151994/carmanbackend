import { BaseEntity } from './../../shared';

export class Images implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public imageContentType?: string,
        public image?: any,
        public galary?: BaseEntity,
        public activity?: BaseEntity,
        public facilities?: BaseEntity,
    ) {
    }
}
