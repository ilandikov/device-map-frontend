export enum LoginModalActionTypes {
    BUTTON_CLICKED = 'buttonClicked',
}

export interface LoginModalButtonClick {
    type: LoginModalActionTypes;
    button: string;
}

export type LoginModalAction = LoginModalButtonClick;

export function loginModalButtonClick(button: string): LoginModalButtonClick {
    return { type: LoginModalActionTypes.BUTTON_CLICKED, button: button };
}
