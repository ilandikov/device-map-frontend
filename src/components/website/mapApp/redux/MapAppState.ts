import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useMapAppState(): MapAppState {
    return useSelector((state: RootState) => state.mapAppState);
}

export interface MapAppState {
    devices: { lat: number; lng: number }[];
    usageStep: MapAppUsageStep;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
    DEVICE_MANAGEMENT = 'DEVICE_MANAGEMENT',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
    devices: [
        { lat: 42.85862508449081, lng: 74.6085298061371 },
        { lat: 42.85883742844907, lng: 74.6039915084839 },
        { lat: 42.85610049481582, lng: 74.60671663284303 },
    ],
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...mapAppInitialState, ...partialState };
}
