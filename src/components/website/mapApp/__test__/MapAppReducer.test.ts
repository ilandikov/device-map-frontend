import { MapAppReducer } from '../redux/MapAppReducer';
import {
    MapAppAction,
    mapAppAuthenticationCompleted,
    mapAppClickDeviceMarker,
    mapAppGetLocationAddress,
    mapAppLoginButtonClick,
    mapAppLoginModalClose,
    mapAppLogoutButtonClick,
    mapAppSetLocationAddress,
} from '../redux/MapAppAction';
import { MapAppState, MapAppUsageStep, buildMapAppState } from '../redux/MapAppState';

function verifyMapAppStateChange(initialState: MapAppState, action: MapAppAction, stateChange: Partial<MapAppState>) {
    const resultingState = MapAppReducer(initialState, action);

    const expectedState: MapAppState = {
        ...initialState,
        ...stateChange,
    };
    expect(resultingState).toEqual(expectedState);
}

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = buildMapAppState({});
        const action = { type: 'DUMMY_ACTION' };

        // @ts-ignore
        verifyMapAppStateChange(initialState, action, {});
    });

    it('should move to user authentication step on user button click', () => {
        const initialState = buildMapAppState({});
        const action = mapAppLoginButtonClick();

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.USER_AUTHENTICATION });
    });

    it('should move to mainPage screen step on logout button click', () => {
        const initialState = buildMapAppState({ usageStep: MapAppUsageStep.USER_AUTHENTICATION });
        const action = mapAppLogoutButtonClick();

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.HOME_SCREEN });
    });

    it('should move to mainPage screen on navigation cancel action', () => {
        const initialState = buildMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        });
        const action = mapAppLoginModalClose();

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.HOME_SCREEN });
    });

    it('should move to device management when authentication has been completed', () => {
        const initialState = buildMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        });
        const action = mapAppAuthenticationCompleted();

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
    });

    it('should set marker at the selected location', () => {
        const initialState = buildMapAppState({});
        const action = mapAppClickDeviceMarker({ lat: 42.85862508449081, lng: 74.6085298061371 });

        verifyMapAppStateChange(initialState, action, {
            selectedMarker: { location: { lat: 42.85862508449081, lng: 74.6085298061371 }, address: null },
        });
    });

    it('should do nothing when getting an address', () => {
        const initialState = buildMapAppState({});
        const action = mapAppGetLocationAddress({ lat: 42.85862508449081, lng: 74.6085298061371 });

        verifyMapAppStateChange(initialState, action, {});
    });

    it('should do nothing when getting an address', () => {
        const initialState = buildMapAppState({
            selectedMarker: {
                location: { lat: 0, lng: 1 },
                address: null,
            },
        });
        const action = mapAppSetLocationAddress({ addressLine1: 'line1', addressLine2: 'line2' });

        verifyMapAppStateChange(initialState, action, {
            selectedMarker: {
                location: { lat: 0, lng: 1 },
                address: {
                    addressLine1: 'line1',
                    addressLine2: 'line2',
                },
            },
        });
    });
});
