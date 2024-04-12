import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useMapAppState(): MapAppState {
    return useSelector((state: RootState) => state.mapAppState);
}

export interface MapAppState {
    usageStep: MapAppUsageStep;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...partialState, ...mapAppInitialState };
}
