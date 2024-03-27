export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
    INPUT = 'input',
    VERIFY_REQUEST = 'verifyRequest',
    NOTIFICATION = 'notification',
    NO_ACTION = 'noAction',
}

export enum LoginModalVerifyTypes {
    USER_EMAIL = 'userEmail',
    USER_PASSWORD = 'userPassword',
    USER_EMAIL_AND_PASSWORD = 'userEmailAndPassword',
    OTP = 'OTP',
}

export enum LoginModalInputTypes {
    USER_EMAIL = 'userEmail',
    USER_PASSWORD = 'userPassword',
    USER_PASSWORD_REPEAT = 'userPasswordRepeat',
    OTP = 'OTP',
}

export enum LoginModalNotificationTypes {
    SIGNUP = 'signUp',
    OTP = 'OTP',
}

export enum LoginModalNotificationResult {
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes.BUTTON_CLICKED;
    button: string;
}

export interface LoginModalInput {
    type: LoginModalActionTypes.INPUT;
    input: {
        type: LoginModalInputTypes;
        payload: string;
    };
}

export interface LoginModalNotification {
    type: LoginModalActionTypes.NOTIFICATION;
    notification: LoginModalNotificationTypes;
    result: LoginModalNotificationResult;
}

export interface LoginModalVerifyRequest {
    type: LoginModalActionTypes.VERIFY_REQUEST;
    verify: LoginModalVerifyTypes;
}

export type LoginModalAction =
    | LoginModalInput
    | LoginModalButtonClick
    | LoginModalVerifyRequest
    | LoginModalNotification
    | LoginModalNoAction;

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}

export function loginModalVerifyRequest(verify: LoginModalVerifyTypes): LoginModalVerifyRequest {
    return {
        type: LoginModalActionTypes.VERIFY_REQUEST,
        verify: verify,
    };
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

export function loginModalSuccessNotification(notification: LoginModalNotificationTypes): LoginModalNotification {
    return {
        type: LoginModalActionTypes.NOTIFICATION,
        notification: notification,
        result: LoginModalNotificationResult.SUCCESS,
    };
}

export function loginModalFailureNotification(notification: LoginModalNotificationTypes): LoginModalNotification {
    return {
        type: LoginModalActionTypes.NOTIFICATION,
        notification: notification,
        result: LoginModalNotificationResult.FAILURE,
    };
}

interface LoginModalNoAction {
    type: LoginModalActionTypes.NO_ACTION;
}

export function loginModalNoAction(): LoginModalNoAction {
    return { type: LoginModalActionTypes.NO_ACTION };
}
