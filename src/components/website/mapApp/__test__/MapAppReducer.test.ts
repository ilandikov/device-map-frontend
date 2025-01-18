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

    it('should move to mainPage screen step and reset user id on logout button click', () => {
        const initialState = buildMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
            currentUserID: 'reset me!',
        });
        const action = mapAppButtonClick(MapAppButton.LOGOUT);

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.HOME_SCREEN, currentUserID: '' });
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

    const existingDevice = {
        id: 'existing',
        createdDate: '1796354896548',
        creatorID: 'new creator',
        location: { lat: 0, lon: 1 },
    };
    const receivedDevice = {
        id: 'received',
        createdDate: '1701482094513',
        creatorID: 'another creator',
        location: { lat: 10, lon: 11 },
    };

    it('should overwrite devices', () => {
        const initialState = buildMapAppState({
            devices: [existingDevice],
        });

        const action = mapAppSetDevices([receivedDevice]);

        verifyMapAppStateChange(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should add device', () => {
        const initialState = buildMapAppState({
            devices: [existingDevice],
        });

        const action = mapAppAddDevice(receivedDevice);

        verifyMapAppStateChange(initialState, action, {
            devices: [existingDevice, receivedDevice],
        });
    });

    it('should delete a device', () => {
        const initialState = buildMapAppState({
            devices: [existingDevice, receivedDevice],
        });
        const action = mapAppDeleteDevice('existing');

        verifyMapAppStateChange(initialState, action, {
            devices: [receivedDevice],
        });
    });
});
