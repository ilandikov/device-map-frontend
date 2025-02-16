import { MapAppReducer } from '../MapAppReducer';
import {
    mapAppAuthenticationCompleted,
    mapAppGetLocationAddress,
    mapAppLoginModalClose,
    mapAppResetCurrentUser,
    mapAppSetLocationAddress,
    mapAppSetLocationCoordinates,
    mapAppSetLoggedInUser,
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

function buildReducerTester<TState, TAction>(
    reducer: (state: TState, action: TAction) => TState,
    stateBuilder: (partialState: Partial<TState>) => TState,
) {
    return function (partialInitialState: Partial<TState>, action: TAction, stateChange: Partial<TState>) {
        const initialState = stateBuilder(partialInitialState);
        const expectedState: TState = {
            ...initialState,
            ...stateChange,
        };

        const resultingState = reducer(initialState, action);

        expect(resultingState).toEqual(expectedState);
    };
}

const testReducer = buildReducerTester(MapAppReducer, buildMapAppState);

describe('MapApp reducer tests', () => {
    it('should match the initial state', () => {
        expect(buildMapAppState({})).toMatchObject<MapAppState>({
            component: MapAppComponents.PRODUCT_DESCRIPTION,
            devices: [],
            selectedMarker: {
                location: null,
                address: null,
            },
            loggedInUser: null,
        });
    });

    it('should not change the initial state on a dummy action', () => {
        // @ts-expect-error
        testReducer({}, { type: 'DUMMY_ACTION' }, {});
    });

    it('should reset current user id', () => {
        const initialState = { loggedInUser: { id: 'reset me!', points: 0 } };
        const action = mapAppResetCurrentUser();

        testReducer(initialState, action, { loggedInUser: null });
    });

    it('should move to mainPage screen on navigation cancel action', () => {
        const initialState = { component: MapAppComponents.LOGIN_MODAL };
        const action = mapAppLoginModalClose();

        testReducer(initialState, action, { component: MapAppComponents.PRODUCT_DESCRIPTION });
    });

    it('should move to device management when authentication has been completed', () => {
        const initialState = { component: MapAppComponents.LOGIN_MODAL };
        const action = mapAppAuthenticationCompleted('set me in the state');

        testReducer(initialState, action, {
            component: MapAppComponents.DEVICE_LOCATION,
            loggedInUser: { id: 'set me in the state', points: null },
        });
    });

    it('should set coordinates', () => {
        const initialState = {};
        const action = mapAppSetLocationCoordinates({ lat: 42.85862508449081, lon: 74.6085298061371 });

        testReducer(initialState, action, {
            selectedMarker: { location: { lat: 42.85862508449081, lon: 74.6085298061371 }, address: null },
        });
    });

    it('should do nothing when getting an address', () => {
        const initialState = {};
        const action = mapAppGetLocationAddress({ lat: 42.85862508449081, lon: 74.6085298061371 });

        testReducer(initialState, action, {});
    });

    it('should set location address', () => {
        const initialState = {
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: null,
            },
        };
        const action = mapAppSetLocationAddress({ line1: 'line1', line2: 'line2' });

        testReducer(initialState, action, {
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: {
                    line1: 'line1',
                    line2: 'line2',
                },
            },
        });
    });

    it('should set current user points', () => {
        const initialState = {};
        const action = mapAppSetLoggedInUser({ id: 'i have to be set', points: 10 });

        testReducer(initialState, action, {
            loggedInUser: { id: 'i have to be set', points: 10 },
        });
    });

    it('should change the map app state', () => {
        const initialState = { component: MapAppComponents.LOGIN_MODAL };
        const action = mapAppShowComponent(MapAppComponents.DEVICE_LOCATION);

        testReducer(initialState, action, { component: MapAppComponents.DEVICE_LOCATION });
    });
});

describe('rename me', () => {
    it('should not change state on list devices remote request', () => {
        const initialState = {};
        const action = deviceListRequest();

        testReducer(initialState, action, {});
    });

    it('should not change state on create device remote request', () => {
        const initialState = {};
        const action = deviceCreateRequest();

        testReducer(initialState, action, {});
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
        const initialState = { devices: [existingDevice] };
        const action = devicesListed([receivedDevice]);

        testReducer(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should add device', () => {
        const initialState = { devices: [existingDevice] };
        const action = deviceCreated(receivedDevice);

        testReducer(initialState, action, {
            devices: [existingDevice, receivedDevice],
        });
    });

    it('should delete a device', () => {
        const initialState = { devices: [existingDevice, receivedDevice] };
        const action = deviceDeleted('existing');

        testReducer(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should approve a device', () => {
        const initialState = { devices: [existingDevice, receivedDevice] };
        const action = deviceApproved(receivedDevice.id, 1112222233333);

        testReducer(initialState, action, {
            devices: [existingDevice, { ...receivedDevice, approvals: 1, lastUpdate: 1112222233333 }],
        });
    });
});
