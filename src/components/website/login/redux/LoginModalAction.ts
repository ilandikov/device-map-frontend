export type LoginModalAction =
    | LoginModalInput
    | LoginModalButtonClick
    | LoginModalRemoteRequest
    | LoginModalNotification;

export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'BUTTON_CLICKED',
    INPUT = 'INPUT',
    VERIFY_REQUEST = 'VERIFY_REQUEST',
    NOTIFICATION = 'NOTIFICATION',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes.BUTTON_CLICKED;
    button: string;
}

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}

export interface LoginModalRemoteRequest {
    type: LoginModalActionTypes.VERIFY_REQUEST;
    verify: LoginModalRemoteRequestType;
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
        type: LoginModalActionTypes.VERIFY_REQUEST,
        verify: verify,
    };
}

export interface LoginModalInput {
    type: LoginModalActionTypes.INPUT;
    input: {
        type: LoginModalInputTypes;
        payload: string;
    };
}

export enum LoginModalInputTypes {
    EMAIL = 'EMAIL',
    PASSWORD = 'PASSWORD',
    PASSWORD_REPEAT = 'PASSWORD_REPEAT',
    OTP = 'OTP',
}

export function loginModalInput(inputType: LoginModalInputTypes, inputPayload: string): LoginModalInput {
    return {
        type: LoginModalActionTypes.INPUT,
        input: {
            type: inputType,
            payload: inputPayload,
        },
    };
}

export interface LoginModalNotification {
    type: LoginModalActionTypes.NOTIFICATION;
    notification: LoginModalNotificationTypes;
    result: LoginModalNotificationResult;
    reason?: string;
}

export enum LoginModalNotificationTypes {
    SIGN_UP = 'signUp',
    OTP = 'OTP',
    SIGN_IN = 'signIn',
    FORGOT_PASSWORD = 'forgotPassword',
    PASSWORD_RESET = 'passwordReset',
    SIGN_OUT = 'signOut',
}

export enum LoginModalNotificationResult {
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export function loginModalSuccessNotification(notification: LoginModalNotificationTypes): LoginModalNotification {
    return {
        type: LoginModalActionTypes.NOTIFICATION,
        notification: notification,
        result: LoginModalNotificationResult.SUCCESS,
    };
}

export function loginModalFailureNotification(
    notification: LoginModalNotificationTypes,
    reason: string,
): LoginModalNotification {
    return {
        type: LoginModalActionTypes.NOTIFICATION,
        notification: notification,
        result: LoginModalNotificationResult.FAILURE,
        reason: reason,
    };
}
