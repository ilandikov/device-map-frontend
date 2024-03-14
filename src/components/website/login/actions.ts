export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
    USER_EMAIL_INPUT = 'userEmailInput',
    VERIFY_REQUEST = 'verifyRequest',
    USER_PASSWORD_INPUT = 'userPasswordInput',
    USER_PASSWORD_REPEAT_INPUT = 'userPasswordRepeatInput',
}

export enum LoginModalVerifyTypes {
    USER_EMAIL = 'userEmail',
    USER_PASSWORD = 'userPassword',
}

export enum LoginModalInput {
    USER_EMAIL = 'userEmail',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes.BUTTON_CLICKED;
    button: string;
}

export interface LoginModalUserEmailInput {
    type: LoginModalActionTypes.USER_EMAIL_INPUT;
    input: string;
}

export interface LoginModalVerifyRequest {
    type: LoginModalActionTypes.VERIFY_REQUEST;
    verify: LoginModalVerifyTypes;
}

export interface LoginModalUserPasswordInput {
    type: LoginModalActionTypes.USER_PASSWORD_INPUT;
    userPassword: string;
}

export interface LoginModalUserPasswordRepeatInput {
    type: LoginModalActionTypes.USER_PASSWORD_REPEAT_INPUT;
    userPasswordRepeat: string;
}

export type LoginModalAction =
    | LoginModalUserEmailInput
    | LoginModalButtonClick
    | LoginModalVerifyRequest
    | LoginModalUserPasswordInput
    | LoginModalUserPasswordRepeatInput;

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}

export function loginModalVerifyRequest(verify: LoginModalVerifyTypes): LoginModalVerifyRequest {
    return {
        type: LoginModalActionTypes.VERIFY_REQUEST,
        verify: verify,
    };
}

export function loginModalInput(type: LoginModalInput, input: string): LoginModalUserEmailInput {
    return {
        type: LoginModalActionTypes.USER_EMAIL_INPUT,
        input: input,
    };
}
