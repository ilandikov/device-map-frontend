import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useMapAppState(): MapAppState {
    return useSelector((state: RootState) => state.mapAppState);
}

export interface Device {
    id: string;
    location: MapAppLocation;
}

export interface MapAppLocation {
    lat: number;
    lon: number;
}

export interface MapAppAddress {
    addressLine1: string;
    addressLine2: string;
}

export interface MapAppState {
    usageStep: MapAppUsageStep;
    selectedMarker: {
        location: MapAppLocation | null;
        address: MapAppAddress | null;
    };
    devices: Device[];
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
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
