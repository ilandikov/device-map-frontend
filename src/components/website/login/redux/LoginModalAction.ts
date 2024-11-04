export type LoginModalAction =
    | LoginModalInput
    | LoginModalButtonClick
    | LoginModalRemoteRequest
    | LoginModalRemoteAnswer;

export enum LoginModalActionType {
    BUTTON_CLICKED = 'BUTTON_CLICKED',
    INPUT = 'INPUT',
    REMOTE_REQUEST = 'REMOTE_REQUEST',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
}

export enum LoginModalButton {
    ACCOUNT_REGISTER = 'accountRegister',
    ACCOUNT_LOGIN = 'accountLogin',
    CANCEL = 'cancel',
    RESET_PASSWORD = 'resetPassword',
    // TODO rename this button to something account related
    USER_BUTTON = 'userButton',
    NEXT = 'next',
    GO_BACK = 'goBack',
}

export interface LoginModalButtonClick {
    type: LoginModalActionType.BUTTON_CLICKED;
    button: LoginModalButton;
}

export function loginModalButtonClick(button: LoginModalButton): LoginModalButtonClick {
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
    OTP_RESEND = 'OTP_RESEND',
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

export interface LoginModalRemoteAnswer {
    type: LoginModalActionType.REMOTE_ANSWER;
    answer: LoginModalRemoteAnswerType;
    result: LoginModalRemoteAnswerResult;
    reason?: string;
}

export enum LoginModalRemoteAnswerType {
    SIGN_UP = 'SIGN_UP',
    OTP = 'OTP',
    OTP_RESEND = 'OTP_RESEND',
    SIGN_IN = 'SIGN_IN',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
    PASSWORD_RESET = 'PASSWORD_RESET',
    SIGN_OUT = 'SIGN_OUT',
}

export enum LoginModalRemoteAnswerResult {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export function loginModalRemoteAnswerSuccess(answer: LoginModalRemoteAnswerType): LoginModalRemoteAnswer {
    return {
        type: LoginModalActionType.REMOTE_ANSWER,
        answer: answer,
        result: LoginModalRemoteAnswerResult.SUCCESS,
    };
}

export function loginModalRemoteAnswerFailure(
    answer: LoginModalRemoteAnswerType,
    reason: string,
): LoginModalRemoteAnswer {
    return {
        type: LoginModalActionType.REMOTE_ANSWER,
        answer: answer,
        result: LoginModalRemoteAnswerResult.FAILURE,
        reason: reason,
    };
}
