export enum MapAppActionType {
    LOGIN_BUTTON_CLICK = 'LOGIN_BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGOUT_BUTTON_CLICK = 'LOGOUT_BUTTON_CLICK',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SHOW_DEVICES_LIST = 'SHOW_DEVICES_LIST',
}

export interface MapAppAction {
    type: MapAppActionType;
}

export function mapAppLoginButtonClick(): MapAppAction {
    return { type: MapAppActionType.LOGIN_BUTTON_CLICK };
}

export function mapAppLogoutButtonClick(): MapAppAction {
    return { type: MapAppActionType.LOGOUT_BUTTON_CLICK };
}

export function mapAppLoginModalClose(): MapAppAction {
    return { type: MapAppActionType.LOGIN_MODAL_CLOSE };
}

export function mapAppAuthenticationCompleted(): MapAppAction {
    return { type: MapAppActionType.AUTHENTICATION_COMPLETED };
}

export function mapAppShowDevicesList(lat: number, lng: number) {
    return { type: MapAppActionType.SHOW_DEVICES_LIST, location: { lat, lng } };
}
