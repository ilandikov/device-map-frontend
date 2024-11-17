export enum GenericActionType {
    REMOTE_REQUEST = 'REMOTE_REQUEST',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
}

export enum Domain {
    AUTHENTICATION = 'AUTHENTICATION',
}

interface GenericAction {
    domain: Domain;
}

export interface RemoteRequest extends GenericAction {
    type: GenericActionType.REMOTE_REQUEST;
}

export interface RemoteAnswer extends GenericAction {
    type: GenericActionType.REMOTE_ANSWER;
}
