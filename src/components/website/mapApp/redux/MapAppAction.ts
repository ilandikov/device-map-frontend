import { MapAppComponents } from './MapAppState';
import { DeviceAction } from './DeviceAction';
import { LoggedInUserAction } from './LoggedInUserAction';
import { SelectedMarkerAction } from './SelectedMarkerAction';

export enum MapAppActionType {
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    SELECTED_MARKER = 'SELECTED_MARKER',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
    LOGGED_IN_USER = 'LOGGED_IN_USER',
}

export type MapAppAction = MapAppShowComponent | LoggedInUserAction | SelectedMarkerAction | DeviceAction;

interface MapAppShowComponent {
    type: MapAppActionType.SHOW_COMPONENT;
    component: MapAppComponents;
}

export function mapAppShowComponent(step: MapAppComponents): MapAppShowComponent {
    return { type: MapAppActionType.SHOW_COMPONENT, component: step };
}
