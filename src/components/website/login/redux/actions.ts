export type LoginModalAction =
    | LoginModalInput
    | LoginModalButtonClick
    | LoginModalVerifyRequest
    | LoginModalNotification
    | LoginModalNoAction;

export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
    INPUT = 'input',
    VERIFY_REQUEST = 'verifyRequest',
    NOTIFICATION = 'notification',
    NO_ACTION = 'noAction',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes.BUTTON_CLICKED;
    button: string;
}

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}

export interface LoginModalVerifyRequest {
    type: LoginModalActionTypes.VERIFY_REQUEST;
    verify: LoginModalVerifyTypes;
}

export enum LoginModalVerifyTypes {
    EMAIL = 'email',
    PASSWORD = 'password',
    EMAIL_AND_PASSWORD = 'emailAndPassword',
    OTP = 'OTP',
    EMAIL_FOR_PASSWORD_RESET = 'emailForPasswordReset',
}

export function loginModalVerifyRequest(verify: LoginModalVerifyTypes): LoginModalVerifyRequest {
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
    EMAIL = 'userEmail',
    PASSWORD = 'userPassword',
    PASSWORD_REPEAT = 'userPasswordRepeat',
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

interface LoginModalNoAction {
    type: LoginModalActionTypes.NO_ACTION;
}

export function loginModalNoAction(): LoginModalNoAction {
    return { type: LoginModalActionTypes.NO_ACTION };
}
