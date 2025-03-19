import { MapAppReducer } from '../MapAppReducer';
import {
    MapAppAction,
    mapAppGetLocationAddress,
    mapAppResetCurrentUser,
    mapAppSetLocationAddress,
    mapAppSetLocationCoordinates,
    mapAppSetLoggedInUser,
    mapAppSetLoggedInUserID,
    mapAppShowComponent,
    mapAppUpdateLoggedInUser,
} from '../MapAppAction';
import { MapAppComponents, MapAppState, buildMapAppState } from '../MapAppState';
import {
    deviceApproved,
    deviceCreateRequest,
    deviceCreated,
    deviceCreation,
    deviceDeleted,
    deviceListRequest,
    devicesListed,
} from '../DeviceAction';
import { buildReducerTester, testInitialState } from '../../../../../redux/__test__/helpers';

const testMapAppReducer = buildReducerTester(MapAppReducer, buildMapAppState);

interface MapAppReducerTest<TState, TAction> {
    initialState: Partial<TState>;
    action: TAction;
    stateChange: Partial<TState>;
}

function itShouldReduceBy(name: string, scenario: MapAppReducerTest<MapAppState, MapAppAction>) {
    it(name, () => {
        const testMapAppReducer = buildReducerTester(MapAppReducer, buildMapAppState);
        testMapAppReducer(scenario.initialState, scenario.action, scenario.stateChange);
    });
}

describe('MapApp reducer tests', () => {
    it('should match the initial state', () => {
        testInitialState(buildMapAppState, {
            component: MapAppComponents.PRODUCT_DESCRIPTION,
            devices: [],
            isDeviceCreationOngoing: false,
            selectedMarker: {
                location: null,
                address: null,
            },
            loggedInUser: null,
        });
    });

    it('should not change the initial state on a dummy action', () => {
        // @ts-expect-error
        testMapAppReducer({}, { type: 'DUMMY_ACTION' }, {});
    });

    itShouldReduceBy('should reset current user id', {
        initialState: { loggedInUser: { id: 'reset me!', points: 0 } },
        action: mapAppResetCurrentUser(),
        stateChange: { loggedInUser: null },
    });

    it('should set logged in user id', () => {
        const initialState = { component: MapAppComponents.LOGIN_MODAL };
        const action = mapAppSetLoggedInUserID('set me in the state');

        testMapAppReducer(initialState, action, {
            loggedInUser: { id: 'set me in the state', points: null },
        });
    });

    it('should update logged in user if the ids match', () => {
        const initialState = { loggedInUser: { id: 'i should get more points', points: 0 } };
        const action = mapAppUpdateLoggedInUser({ id: 'i should get more points', points: 30 });

        testMapAppReducer(initialState, action, {
            loggedInUser: { id: 'i should get more points', points: 30 },
        });
    });

    it('should not update logged in user if the ids dont match', () => {
        const initialState = { loggedInUser: { id: 'my points should not change', points: 53 } };
        const action = mapAppUpdateLoggedInUser({ id: 'because ids dont match', points: 71 });

        testMapAppReducer(initialState, action, {});
    });

    it('should set coordinates', () => {
        const initialState = {};
        const action = mapAppSetLocationCoordinates({ lat: 42.85862508449081, lon: 74.6085298061371 });

        testMapAppReducer(initialState, action, {
            selectedMarker: { location: { lat: 42.85862508449081, lon: 74.6085298061371 }, address: null },
        });
    });

    it('should do nothing when getting an address', () => {
        const initialState = {};
        const action = mapAppGetLocationAddress({ lat: 42.85862508449081, lon: 74.6085298061371 });

        testMapAppReducer(initialState, action, {});
    });

    it('should set location address', () => {
        const initialState = {
            selectedMarker: {
                location: { lat: 0, lon: 1 },
                address: null,
            },
        };
        const action = mapAppSetLocationAddress({ line1: 'line1', line2: 'line2' });

        testMapAppReducer(initialState, action, {
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

        testMapAppReducer(initialState, action, {
            loggedInUser: { id: 'i have to be set', points: 10 },
        });
    });

    it('should change the map app state', () => {
        const initialState = { component: MapAppComponents.LOGIN_MODAL };
        const action = mapAppShowComponent(MapAppComponents.DEVICE_LOCATION);

        testMapAppReducer(initialState, action, { component: MapAppComponents.DEVICE_LOCATION });
    });
});

describe('MapApp reducer test - devices', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(1234567890));
    });
    afterAll(() => {
        jest.useRealTimers();
    });

    it('should not change state on list devices remote request', () => {
        const initialState = {};
        const action = deviceListRequest();

        testMapAppReducer(initialState, action, {});
    });

    it('should not change state on create device remote request', () => {
        const initialState = {};
        const action = deviceCreateRequest();

        testMapAppReducer(initialState, action, {});
    });

    const existingDevice = {
        id: 'existing',
        createdDate: '1796354896548',
        lastUpdate: '1796354897659',
        creatorID: 'new creator',
        location: { lat: 0, lon: 1 },
        approvals: 4,
    };
    const receivedDevice = {
        id: 'received',
        createdDate: '1701482094513',
        lastUpdate: '1701482095624',
        creatorID: 'another creator',
        location: { lat: 10, lon: 11 },
        approvals: 0,
    };

    it('should overwrite devices', () => {
        const initialState = { devices: [existingDevice] };
        const action = devicesListed([receivedDevice]);

        testMapAppReducer(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should add device', () => {
        const initialState = { devices: [existingDevice] };
        const action = deviceCreated(receivedDevice);

        testMapAppReducer(initialState, action, {
            devices: [existingDevice, receivedDevice],
        });
    });

    it('should delete a device', () => {
        const initialState = { devices: [existingDevice, receivedDevice] };
        const action = deviceDeleted('existing');

        testMapAppReducer(initialState, action, {
            devices: [receivedDevice],
        });
    });

    it('should approve a device and maintain previous device order', () => {
        const initialState = { devices: [receivedDevice, existingDevice] };
        const action = deviceApproved(receivedDevice.id);

        testMapAppReducer(initialState, action, {
            devices: [{ ...receivedDevice, approvals: 1, lastUpdate: 1234567890 }, existingDevice],
        });
    });
});

describe('MapApp reducer tests - device creation ongoing', () => {
    it('should set device creation ongoing to true', () => {
        const initialState = { isDeviceCreationOngoing: false };

        const action = deviceCreation(true);

        testMapAppReducer(initialState, action, {
            isDeviceCreationOngoing: true,
        });
    });

    it('should set device creation ongoing to false', () => {
        const initialState = { isDeviceCreationOngoing: true };

        const action = deviceCreation(false);

        testMapAppReducer(initialState, action, {
            isDeviceCreationOngoing: false,
        });
    });
});
