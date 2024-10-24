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
    lng: number;
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
    devices: [
        { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
        { id: 'dev2a', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
        { id: 'dev2b', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
        { id: 'dev2c', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
        { id: 'dev2d', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
        { id: 'dev3', location: { lat: 42.85610049481582, lng: 74.60671663284303 } },
    ],
    selectedMarker: {
        location: null,
        address: null,
    },
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
