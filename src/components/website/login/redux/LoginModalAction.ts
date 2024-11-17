import { Domain, GenericActionType, RemoteAnswer, RemoteRequest } from './GenericActions';

export type LoginModalAction =
    | LoginModalInput
    | LoginModalButtonClick
    | LoginModalRemoteRequest
    | LoginModalRemoteAnswer;

export enum LoginModalActionType {
    BUTTON_CLICKED = 'BUTTON_CLICKED',
    INPUT = 'INPUT',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
}

export enum LoginModalButton {
    ACCOUNT_REGISTER = 'ACCOUNT_REGISTER',
    ACCOUNT_LOGIN = 'ACCOUNT_LOGIN',
    CANCEL = 'CANCEL',
    RESET_PASSWORD = 'RESET_PASSWORD',
    USER_BUTTON = 'USER_BUTTON',
    GO_BACK = 'GO_BACK',
}

export interface LoginModalButtonClick {
    type: LoginModalActionType.BUTTON_CLICKED;
    button: LoginModalButton;
}

export function loginModalButtonClick(button: LoginModalButton): LoginModalButtonClick {
    return { type: LoginModalActionType.BUTTON_CLICKED, button: button };
}

export interface LoginModalRemoteRequest extends RemoteRequest {
    domain: Domain.AUTHENTICATION;
    check: LoginModalCheck;
}

export enum LoginModalCheck {
    USERNAME = 'USERNAME',
    PASSWORD = 'PASSWORD',
    OTP = 'OTP',
    NONE = 'NONE',
}

export function loginModalRemoteRequest(verify: LoginModalCheck): LoginModalRemoteRequest {
    return {
        type: GenericActionType.REMOTE_REQUEST,
        domain: Domain.AUTHENTICATION,
        check: verify,
    };
}

export interface LoginModalInput {
    type: LoginModalActionType.INPUT;
    input: {
        type: LoginModalInputType;
        payload: string;
    };
}

export enum LoginModalInputType {
    EMAIL = 'EMAIL',
    PASSWORD = 'PASSWORD',
    PASSWORD_REPEAT = 'PASSWORD_REPEAT',
    OTP = 'OTP',
}

export function loginModalInput(inputType: LoginModalInputType, inputPayload: string): LoginModalInput {
    return {
        type: LoginModalActionType.INPUT,
        input: {
            type: inputType,
            payload: inputPayload,
        },
    };
}

export interface LoginModalRemoteAnswer extends RemoteAnswer {
    domain: Domain.AUTHENTICATION;
    result: LoginModalRemoteAnswerResult;
    reason?: string;
}

export enum LoginModalRemoteAnswerResult {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export function loginModalRemoteAnswerSuccess(): LoginModalRemoteAnswer {
    return {
        type: LoginModalActionType.REMOTE_ANSWER,
        domain: Domain.AUTHENTICATION,
        result: LoginModalRemoteAnswerResult.SUCCESS,
    };
}

export function loginModalRemoteAnswerFailure(reason: string): LoginModalRemoteAnswer {
    return {
        type: LoginModalActionType.REMOTE_ANSWER,
        domain: Domain.AUTHENTICATION,
        result: LoginModalRemoteAnswerResult.FAILURE,
        reason: reason,
    };
}
