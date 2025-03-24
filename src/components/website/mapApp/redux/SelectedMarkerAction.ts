import { T22Address, T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppActionType } from './MapAppAction';

export type SelectedMarkerAction = SelectedMarkerSetCoordinates | SelectedMarkerSetAddress | SelectedMarkerGetAddress;

export interface SelectedMarkerSetCoordinates {
    type: MapAppActionType.SELECTED_MARKER_SET_COORDINATES;
    markerLocation: T22Location;
}

export function selectedMarkerSetCoordinates(markerLocation: T22Location): SelectedMarkerSetCoordinates {
    return { type: MapAppActionType.SELECTED_MARKER_SET_COORDINATES, markerLocation };
}

export interface SelectedMarkerGetAddress {
    type: MapAppActionType.SELECTED_MARKER_GET_ADDRESS;
    location: T22Location;
}

export function selectedMarkerGetAddress(location: T22Location): SelectedMarkerGetAddress {
    return { type: MapAppActionType.SELECTED_MARKER_GET_ADDRESS, location };
}

export interface SelectedMarkerSetAddress {
    type: MapAppActionType.SELECTED_MARKER_SET_ADDRESS;
    address: T22Address;
}

export function selectedMarkerSetAddress(address: T22Address): SelectedMarkerSetAddress {
    return { type: MapAppActionType.SELECTED_MARKER_SET_ADDRESS, address };
}
