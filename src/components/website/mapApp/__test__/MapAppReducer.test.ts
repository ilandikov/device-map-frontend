import { MapAppReducer } from '../redux/MapAppReducer';
import {
    MapAppAction,
    MapAppButton,
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppAuthenticationCompleted,
    mapAppButtonClick,
    mapAppDeleteDevice,
    mapAppGetLocationAddress,
    mapAppLoginModalClose,
    mapAppRemoteRequest,
    mapAppSetDevices,
    mapAppSetLocationAddress,
    mapAppSetLocationCoordinates,
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

        // @ts-expect-error
        verifyMapAppStateChange(initialState, action, {});
    });

    it('should move to user authentication step on user button click', () => {
        const initialState = buildMapAppState({});
        const action = mapAppButtonClick(MapAppButton.LOGIN);

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.USER_AUTHENTICATION });
    });

    it('should move to mainPage screen step on logout button click', () => {
        const initialState = buildMapAppState({ usageStep: MapAppUsageStep.USER_AUTHENTICATION });
        const action = mapAppButtonClick(MapAppButton.LOGOUT);

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
        const action = mapAppAuthenticationCompleted('set me in the state');

        verifyMapAppStateChange(initialState, action, {
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
            currentUserID: 'set me in the state',
        });
    });

    it('should set coordinates', () => {
        const initialState = buildMapAppState({});
        const action = mapAppSetLocationCoordinates({ lat: 42.85862508449081, lon: 74.6085298061371 });

        verifyMapAppStateChange(initialState, action, {
            selectedMarker: { location: { lat: 42.85862508449081, lon: 74.6085298061371 }, address: null },
        });
    });

    it('should do nothing when getting an address', () => {
        const initialState = buildMapAppState({});
        const action = mapAppGetLocationAddress({ lat: 42.85862508449081, lon: 74.6085298061371 });

        verifyMapAppStateChange(initialState, action, {});
    });

    it('should set location address', () => {
        const initialState = buildMapAppState({
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: null,
            },
        });
        const action = mapAppSetLocationAddress({ addressLine1: 'line1', addressLine2: 'line2' });

        verifyMapAppStateChange(initialState, action, {
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: {
                    addressLine1: 'line1',
                    addressLine2: 'line2',
                },
            },
        });
    });

    it('should not change state on list devices remote request', () => {
        const initialState = buildMapAppState({});
        const action = mapAppRemoteRequest(MapAppRemoteRequestType.LIST_DEVICES);

        verifyMapAppStateChange(initialState, action, {});
    });

    it('should overwrite devices', () => {
        const initialState = buildMapAppState({ devices: [{ id: 'existing', location: { lat: 0, lon: 1 } }] });
        const action = mapAppSetDevices([{ id: 'received', location: { lat: 10, lon: 11 } }]);

        verifyMapAppStateChange(initialState, action, {
            devices: [{ id: 'received', location: { lat: 10, lon: 11 } }],
        });
    });

    it('should add device', () => {
        const initialState = buildMapAppState({ devices: [{ id: 'number1', location: { lat: 78, lon: 34 } }] });
        const action = mapAppAddDevice({ id: 'number2', location: { lat: 9, lon: 31 } });

        verifyMapAppStateChange(initialState, action, {
            devices: [
                { id: 'number1', location: { lat: 78, lon: 34 } },
                { id: 'number2', location: { lat: 9, lon: 31 } },
            ],
        });
    });

    it('should delete a device', () => {
        const initialState = buildMapAppState({
            devices: [
                { id: 'toBeDeleted', location: { lat: 5.456, lon: 1.947 } },
                { id: 'toBeKept', location: { lat: 3.853, lon: 0.537 } },
            ],
        });
        const action = mapAppDeleteDevice('toBeDeleted');

        verifyMapAppStateChange(initialState, action, {
            devices: [{ id: 'toBeKept', location: { lat: 3.853, lon: 0.537 } }],
        });
    });
});
