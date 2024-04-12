export enum MapAppActionTypes {
    LOGIN_BUTTON_CLICK = 'LOGIN_BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGOUT_BUTTON_CLICK = 'LOGOUT_BUTTON_CLICK',
}

export interface MapAppAction {
    type: MapAppActionTypes;
}

export function mapAppLoginButtonClick(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_BUTTON_CLICK };
}

export function mapAppLogoutButtonClick(): MapAppAction {
    return { type: MapAppActionTypes.LOGOUT_BUTTON_CLICK };
}

export function mapAppLoginModalClose(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_MODAL_CLOSE };
}
