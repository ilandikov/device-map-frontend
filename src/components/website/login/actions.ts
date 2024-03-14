export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
    USER_EMAIL_INPUT = 'userEmailInput',
    REQUEST_VERIFY_USER_EMAIL = 'requestVerifyUserEmail',
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

export type LoginModalAction = LoginModalUserEmailInput | LoginModalButtonClick | LoginModalRequestVerifyUserEmail;

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}
