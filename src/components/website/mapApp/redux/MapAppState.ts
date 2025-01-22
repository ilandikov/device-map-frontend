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

export type T22DeviceTemp = T22Device & { approvals?: number; lastUpdate?: number };

export interface MapAppState {
    usageStep: MapAppUsageStep;
    selectedMarker: {
        location: T22Location | null;
        address: MapAppAddress | null;
    };
    devices: T22DeviceTemp[];
    currentUserID: string;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
    DEVICE_MANAGEMENT = 'DEVICE_MANAGEMENT',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
    devices: [],
    selectedMarker: {
        location: null,
        address: null,
    },
    currentUserID: '',
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
