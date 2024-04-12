export interface MapAppState {
    usageStep: MapAppUsageStep;
    showProductDescription: boolean;
    showLoginModal: boolean;
    showLoggedInUserHeader: boolean;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
    AUTHENTICATED_USER = 'AUTHENTICATED_USER',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
    showProductDescription: true,
    showLoginModal: false,
    showLoggedInUserHeader: false,
};

export function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...partialState, ...mapAppInitialState };
}
