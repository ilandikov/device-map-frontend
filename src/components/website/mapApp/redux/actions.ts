export enum MapAppActionTypes {
    USER_BUTTON_CLICK = 'USER_BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
}

export interface MapAppAction {
    type: MapAppActionTypes;
}

export function mapAppUserButtonClick(): MapAppAction {
    return { type: MapAppActionTypes.USER_BUTTON_CLICK };
}

export function mapAppLoginModalClose(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_MODAL_CLOSE };
}
