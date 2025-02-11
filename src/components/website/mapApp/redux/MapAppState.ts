import { useSelector } from 'react-redux';
import { T22Device, T22Location } from '@mancho-school-t22/graphql-types';
import { RootState } from '../../../../redux/store';

export function useMapAppState(): MapAppState {
    return useSelector((state: RootState) => state.mapAppState);
}

export interface MapAppAddress {
    addressLine1: string;
    addressLine2: string;
}

export interface MapAppState {
    component: MapAppComponents;
    selectedMarker: {
        location: T22Location | null;
        address: MapAppAddress | null;
    };
    devices: T22Device[];
    // TODO extract loggedUser field containing id and points
    currentUserID: string | null;
    currentUserPoints: number | null;
}

export enum MapAppComponents {
    HOME_SCREEN = 'PRODUCT_DESCRIPTION',
    USER_AUTHENTICATION = 'LOGIN_MODAL',
    DEVICE_MANAGEMENT = 'DEVICE_LOCATION',
}

export const mapAppInitialState: MapAppState = {
    component: MapAppComponents.HOME_SCREEN,
    devices: [],
    selectedMarker: {
        location: null,
        address: null,
    },
    currentUserID: null,
    currentUserPoints: null,
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
