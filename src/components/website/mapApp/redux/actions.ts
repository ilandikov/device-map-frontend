export enum MapAppActionTypes {
    LOGIN_BUTTON_CLICK = 'LOGIN_BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
}

export interface MapAppAction {
    type: MapAppActionTypes;
}

export function mapAppLoginButtonClick(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_BUTTON_CLICK };
}

export function mapAppLoginModalClose(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_MODAL_CLOSE };
}
