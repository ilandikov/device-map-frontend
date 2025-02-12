import { MapAppReducer } from '../MapAppReducer';
import {
    MapAppAction,
    mapAppAuthenticationCompleted,
    mapAppGetLocationAddress,
    mapAppGetUserPoints,
    mapAppLoginModalClose,
    mapAppResetCurrentUser,
    mapAppSetLocationAddress,
    mapAppSetLocationCoordinates,
    mapAppSetUserPoints,
    mapAppShowComponent,
} from '../MapAppAction';
import { MapAppComponents, MapAppState, buildMapAppState } from '../MapAppState';
import {
    deviceApproved,
    deviceCreateRequest,
    deviceCreated,
    deviceDeleted,
    deviceListRequest,
    devicesListed,
} from '../DeviceAction';

function testMapAppStateChange(initialState: MapAppState, action: MapAppAction, stateChange: Partial<MapAppState>) {
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
        testMapAppStateChange(initialState, action, {});
    });

    it('should reset current user id', () => {
        const initialState = buildMapAppState({
            loggedInUser: { id: 'reset me!', points: 0 },
        });
        const action = mapAppResetCurrentUser();

        testMapAppStateChange(initialState, action, { loggedInUser: null });
    });

    it('should move to mainPage screen on navigation cancel action', () => {
        const initialState = buildMapAppState({
            component: MapAppComponents.LOGIN_MODAL,
        });
        const action = mapAppLoginModalClose();

        testMapAppStateChange(initialState, action, { component: MapAppComponents.PRODUCT_DESCRIPTION });
    });

    it('should move to device management when authentication has been completed', () => {
        const initialState = buildMapAppState({
            component: MapAppComponents.LOGIN_MODAL,
        });
        const action = mapAppAuthenticationCompleted('set me in the state');

        testMapAppStateChange(initialState, action, {
            component: MapAppComponents.DEVICE_LOCATION,
            loggedInUser: { id: 'set me in the state', points: 0 },
        });
    });

    it('should set coordinates', () => {
        const initialState = buildMapAppState({});
        const action = mapAppSetLocationCoordinates({ lat: 42.85862508449081, lon: 74.6085298061371 });

        testMapAppStateChange(initialState, action, {
            selectedMarker: { location: { lat: 42.85862508449081, lon: 74.6085298061371 }, address: null },
        });
    });

    it('should do nothing when getting an address', () => {
        const initialState = buildMapAppState({});
        const action = mapAppGetLocationAddress({ lat: 42.85862508449081, lon: 74.6085298061371 });

        testMapAppStateChange(initialState, action, {});
    });

    it('should set location address', () => {
        const initialState = buildMapAppState({
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: null,
            },
        });
        const action = mapAppSetLocationAddress({ addressLine1: 'line1', addressLine2: 'line2' });

        testMapAppStateChange(initialState, action, {
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: {
                    addressLine1: 'line1',
                    addressLine2: 'line2',
                },
            },
        });
    });

    it('should reset current user points', () => {
        const initialState = buildMapAppState({ currentUserPoints: 100500 });
        const action = mapAppGetUserPoints();

        testMapAppStateChange(initialState, action, { currentUserPoints: null });
    });

    it('should set current user points', () => {
        const initialState = buildMapAppState({});
        const action = mapAppSetUserPoints(10);

        testMapAppStateChange(initialState, action, { currentUserPoints: 10 });
    });

    it('should change the map app state', () => {
        const initialState = buildMapAppState({ component: MapAppComponents.LOGIN_MODAL });
        const action = mapAppShowComponent(MapAppComponents.DEVICE_LOCATION);

        testMapAppStateChange(initialState, action, { component: MapAppComponents.DEVICE_LOCATION });
    });
});

describe('rename me', () => {
    it('should not change state on list devices remote request', () => {
        const initialState = buildMapAppState({});
        const action = deviceListRequest();

        testMapAppStateChange(initialState, action, {});
    });

    it('should not change state on create device remote request', () => {
        const initialState = buildMapAppState({});
        const action = deviceCreateRequest();

        testMapAppStateChange(initialState, action, {});
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

        const action = devicesListed([receivedDevice]);

        testMapAppStateChange(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should add device', () => {
        const initialState = buildMapAppState({
            devices: [existingDevice],
        });

        const action = deviceCreated(receivedDevice);

        testMapAppStateChange(initialState, action, {
            devices: [existingDevice, receivedDevice],
        });
    });

    it('should delete a device', () => {
        const initialState = buildMapAppState({
            devices: [existingDevice, receivedDevice],
        });
        const action = deviceDeleted('existing');

        testMapAppStateChange(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should approve a device', () => {
        const initialState = buildMapAppState({
            devices: [existingDevice, receivedDevice],
        });
        const action = deviceApproved(receivedDevice.id, 1112222233333);

        testMapAppStateChange(initialState, action, {
            devices: [existingDevice, { ...receivedDevice, approvals: 1, lastUpdate: 1112222233333 }],
        });
    });
});
