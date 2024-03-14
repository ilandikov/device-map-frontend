export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
    USER_EMAIL_INPUT = 'userEmailInput',
    REQUEST_VERIFY_USER_EMAIL = 'requestVerifyUserEmail',
    USER_PASSWORD_INPUT = 'userPasswordInput',
    USER_PASSWORD_REPEAT_INPUT = 'userPasswordRepeatInput',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes.BUTTON_CLICKED;
    button: string;
}

export interface LoginModalUserEmailInput {
    type: LoginModalActionTypes.USER_EMAIL_INPUT;
    userEmail: string;
}

export interface LoginModalRequestVerifyUserEmail {
    type: LoginModalActionTypes.REQUEST_VERIFY_USER_EMAIL;
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
    | LoginModalRequestVerifyUserEmail
    | LoginModalUserPasswordInput
    | LoginModalUserPasswordRepeatInput;

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}
