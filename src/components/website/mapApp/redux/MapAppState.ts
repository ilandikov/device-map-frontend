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

export interface T22User {
    id: string;
    points: number;
}

interface MapAppUser extends T22User {
    points: number | null;
}

export interface MapAppState {
    component: MapAppComponents;
    selectedMarker: {
        location: T22Location | null;
        address: MapAppAddress | null;
    };
    devices: T22Device[];
    // TODO extract loggedUser field containing id and points
    loggedInUser: MapAppUser | null;
    currentUserPoints: number | null;
}

export enum MapAppComponents {
    PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION',
    LOGIN_MODAL = 'LOGIN_MODAL',
    DEVICE_LOCATION = 'DEVICE_LOCATION',
}

export const mapAppInitialState: MapAppState = {
    component: MapAppComponents.PRODUCT_DESCRIPTION,
    devices: [],
    selectedMarker: {
        location: null,
        address: null,
    },
    loggedInUser: null,
    currentUserPoints: null,
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
