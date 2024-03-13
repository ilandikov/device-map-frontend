export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
    USER_EMAIL_INPUT = 'userEmailInput',
    REQUEST_VERIFY_USER_EMAIL = 'requestVerifyUserEmail',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes;
    button: string;
}

export type LoginModalAction = LoginModalButtonClick;

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}
