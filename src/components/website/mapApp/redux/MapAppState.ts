import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useMapAppState(): MapAppState {
    return useSelector((state: RootState) => state.mapAppState);
}

export interface Device {
    name: string;
    location: Location;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface MapAppState {
    devices: Device[];
    usageStep: MapAppUsageStep;
    selectedMarkerLocation: Location | null;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
    DEVICE_MANAGEMENT = 'DEVICE_MANAGEMENT',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
    devices: [
        { name: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
        { name: 'dev2', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
        { name: 'dev3', location: { lat: 42.85610049481582, lng: 74.60671663284303 } },
    ],
    selectedMarkerLocation: null,
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
