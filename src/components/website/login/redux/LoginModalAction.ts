export type LoginModalAction =
    | LoginModalInput
    | LoginModalButtonClick
    | LoginModalRemoteRequest
    | LoginModalNotification;

export enum LoginModalActionType {
    BUTTON_CLICKED = 'BUTTON_CLICKED',
    INPUT = 'INPUT',
    REMOTE_REQUEST = 'REMOTE_REQUEST',
    NOTIFICATION = 'NOTIFICATION',
}

export interface LoginModalButtonClick {
    type: LoginModalActionType.BUTTON_CLICKED;
    button: string;
}

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionType.BUTTON_CLICKED, button: button };
}

export interface LoginModalRemoteRequest {
    type: LoginModalActionType.REMOTE_REQUEST;
    request: LoginModalRemoteRequestType;
}

export enum LoginModalRemoteRequestType {
    USERNAME = 'USERNAME',
    PASSWORD = 'PASSWORD',
    USERNAME_AND_PASSWORD = 'USERNAME_AND_PASSWORD',
    OTP = 'OTP',
    SIGN_OUT = 'SIGN_OUT',
}

export function loginModalRemoteRequest(verify: LoginModalRemoteRequestType): LoginModalRemoteRequest {
    return {
        type: LoginModalActionType.REMOTE_REQUEST,
        request: verify,
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

export interface LoginModalNotification {
    type: LoginModalActionType.NOTIFICATION;
    answer: LoginModalRemoteAnswerType;
    result: LoginModalRemoteAnswerResult;
    reason?: string;
}

export enum LoginModalRemoteAnswerType {
    SIGN_UP = 'signUp',
    OTP = 'OTP',
    SIGN_IN = 'signIn',
    FORGOT_PASSWORD = 'forgotPassword',
    PASSWORD_RESET = 'passwordReset',
    SIGN_OUT = 'signOut',
}

export enum LoginModalRemoteAnswerResult {
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export function loginModalRemoteAnswerSuccess(answer: LoginModalRemoteAnswerType): LoginModalNotification {
    return {
        type: LoginModalActionType.NOTIFICATION,
        answer: answer,
        result: LoginModalRemoteAnswerResult.SUCCESS,
    };
}

export function loginModalRemoteAnswerFailure(
    answer: LoginModalRemoteAnswerType,
    reason: string,
): LoginModalNotification {
    return {
        type: LoginModalActionType.NOTIFICATION,
        answer: answer,
        result: LoginModalRemoteAnswerResult.FAILURE,
        reason: reason,
    };
}
