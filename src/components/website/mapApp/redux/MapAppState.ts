import { useSelector } from 'react-redux';
import { T22Address, T22Device, T22Location, T22User } from '@mancho-school-t22/graphql-types';
import { RootState, StateBuilder } from '../../../../redux/store';

export function useMapAppState(): MapAppState {
    return useSelector((state: RootState) => state).mapAppState;
}

interface MapAppUser extends T22User {
    points: number | null;
}

export interface MapAppState {
    component: MapAppComponents;
    selectedMarker: {
        location: T22Location | null;
        address: T22Address | null;
    };
    devices: T22Device[];
    loggedInUser: MapAppUser | null;
}

export enum MapAppComponents {
    PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION',
    LOGIN_MODAL = 'LOGIN_MODAL',
    DEVICE_LOCATION = 'DEVICE_LOCATION',
}

export const buildMapAppState: StateBuilder<MapAppState> = (partialState) => ({
    component: MapAppComponents.PRODUCT_DESCRIPTION,
    devices: [],
    selectedMarker: {
        location: null,
        address: null,
    },
    loggedInUser: null,
    ...partialState,
});
