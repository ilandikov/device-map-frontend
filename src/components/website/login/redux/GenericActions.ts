export enum GenericActionType {
    REMOTE_REQUEST = 'REMOTE_REQUEST',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
}

export enum Domain {
    AUTHENTICATION = 'AUTHENTICATION',
}

export interface RemoteRequest {
    type: GenericActionType.REMOTE_REQUEST;
    domain: Domain;
}

export interface RemoteAnswer {
    type: GenericActionType.REMOTE_ANSWER;
    domain: Domain;
}
