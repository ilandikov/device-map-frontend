import { LoginModalActionType } from './LoginModalAction';

export enum GenericActionType {
    REMOTE_REQUEST = 'REMOTE_REQUEST',
}

export enum Domain {
    AUTHENTICATION = 'AUTHENTICATION',
}

export interface RemoteRequest {
    type: GenericActionType.REMOTE_REQUEST;
    domain: Domain;
}

export interface RemoteAnswer {
    type: LoginModalActionType.REMOTE_ANSWER;
    domain: Domain;
}
