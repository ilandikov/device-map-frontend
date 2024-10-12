import { Location } from './MapAppState';

export enum MapAppActionType {
    LOGIN_BUTTON_CLICK = 'LOGIN_BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGOUT_BUTTON_CLICK = 'LOGOUT_BUTTON_CLICK',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    DEVICE_MARKER_CLICK = 'DEVICE_MARKER_CLICK',
}

export type MapAppAction = MapAppGenericAction | MapAppDeviceMarkerClick;

export interface MapAppGenericAction {
    type:
        | MapAppActionType.LOGIN_BUTTON_CLICK
        | MapAppActionType.LOGOUT_BUTTON_CLICK
        | MapAppActionType.LOGIN_MODAL_CLOSE
        | MapAppActionType.AUTHENTICATION_COMPLETED;
}

export function mapAppLoginButtonClick(): MapAppGenericAction {
    return { type: MapAppActionType.LOGIN_BUTTON_CLICK };
}

export function mapAppLogoutButtonClick(): MapAppGenericAction {
    return { type: MapAppActionType.LOGOUT_BUTTON_CLICK };
}

export function mapAppLoginModalClose(): MapAppGenericAction {
    return { type: MapAppActionType.LOGIN_MODAL_CLOSE };
}

export function mapAppAuthenticationCompleted(): MapAppGenericAction {
    return { type: MapAppActionType.AUTHENTICATION_COMPLETED };
}

export interface MapAppDeviceMarkerClick {
    type: MapAppActionType.DEVICE_MARKER_CLICK;
    markerLocation: Location;
}

export function mapAppClickDeviceMarker(markerLocation: Location): MapAppDeviceMarkerClick {
    return { type: MapAppActionType.DEVICE_MARKER_CLICK, markerLocation };
}
