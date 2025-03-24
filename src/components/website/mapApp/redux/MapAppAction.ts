import { MapAppComponents } from './MapAppState';
import { DeviceAction } from './DeviceAction';
import { LoggedInUserAction } from './LoggedInUserAction';
import { SelectedMarkerAction } from './SelectedMarkerAction';

export enum MapAppActionType {
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGGED_IN_USER_RESET = 'LOGGED_IN_USER_RESET',
    LOGGED_IN_USER_SET_ID = 'LOGGED_IN_USER_SET_ID',
    SELECTED_MARKER = 'SELECTED_MARKER',
    LOGGED_IN_USER_SET = 'LOGGED_IN_USER_SET',
    LOGGED_IN_USER_ERROR = 'LOGGED_IN_USER_ERROR',
    LOGGED_IN_USER_UPDATE = 'LOGGED_IN_USER_UPDATE',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
    LOGGED_IN_USER = 'LOGGED_IN_USER',
    LOGGED_IN_USER_SUBSCRIPTION_ERROR = 'LOGGED_IN_USER_SUBSCRIPTION_ERROR',
}

export type MapAppAction = MapAppShowComponent | LoggedInUserAction | SelectedMarkerAction | DeviceAction;

interface MapAppShowComponent {
    type: MapAppActionType.SHOW_COMPONENT;
    component: MapAppComponents;
}

export function mapAppShowComponent(step: MapAppComponents): MapAppShowComponent {
    return { type: MapAppActionType.SHOW_COMPONENT, component: step };
}
