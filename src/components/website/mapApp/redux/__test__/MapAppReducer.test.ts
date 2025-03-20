import { MapAppReducer } from '../MapAppReducer';
import {
    mapAppGetLocationAddress,
    mapAppResetCurrentUser,
    mapAppSetLocationAddress,
    mapAppSetLocationCoordinates,
    mapAppSetLoggedInUser,
    mapAppSetLoggedInUserID,
    mapAppShowComponent,
    mapAppUpdateLoggedInUser,
} from '../MapAppAction';
import { MapAppComponents, buildMapAppState } from '../MapAppState';
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
import { StateBuilder } from '../../../../../redux/store';

const testMapAppReducer = buildReducerTester(MapAppReducer, buildMapAppState);

interface ReducerTest<TState, TAction> {
    reducer: (state: TState, action: TAction) => TState;
    stateBuilder: StateBuilder<TState>;
    partialState: Partial<TState>;
    action: TAction;
    stateChange: Partial<TState>;
}

function itShouldReduceBy<TState, TAction>(name: string, scenario: ReducerTest<TState, TAction>) {
    const { reducer, stateBuilder, partialState, action, stateChange } = scenario;
    it(name, () => {
        const initialState = stateBuilder(partialState);

        const resultingState = reducer(initialState, action);

        expect(resultingState).toEqual({
            ...initialState,
            ...stateChange,
        });
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

    [
        {
            name: 'resetting current user id',
            partialState: { loggedInUser: { id: 'reset me!', points: 0 } },
            action: mapAppResetCurrentUser(),
            stateChange: { loggedInUser: null },
        },
        {
            name: 'should set logged in user id',
            partialState: { component: MapAppComponents.LOGIN_MODAL },
            action: mapAppSetLoggedInUserID('set me in the state'),
            stateChange: {
                loggedInUser: { id: 'set me in the state', points: null },
            },
        },
        {
            name: 'should update logged in user if the ids match',
            partialState: { loggedInUser: { id: 'i should get more points', points: 0 } },
            action: mapAppUpdateLoggedInUser({ id: 'i should get more points', points: 30 }),
            stateChange: {
                loggedInUser: { id: 'i should get more points', points: 30 },
            },
        },
        {
            name: 'should not update logged in user if the ids dont match',
            partialState: { loggedInUser: { id: 'my points should not change', points: 53 } },
            action: mapAppUpdateLoggedInUser({ id: 'because ids dont match', points: 71 }),
            stateChange: {},
        },
        {
            name: 'should set coordinates',
            partialState: {},
            action: mapAppSetLocationCoordinates({ lat: 42.85862508449081, lon: 74.6085298061371 }),
            stateChange: {
                selectedMarker: { location: { lat: 42.85862508449081, lon: 74.6085298061371 }, address: null },
            },
        },
        {
            name: 'should do nothing when getting an address',
            partialState: {},
            action: mapAppGetLocationAddress({ lat: 42.85862508449081, lon: 74.6085298061371 }),
            stateChange: {},
        },
        {
            name: 'should set location address',
            partialState: {
                selectedMarker: {
                    location: { lat: 0, lon: 1 },
                    address: null,
                },
            },
            action: mapAppSetLocationAddress({ line1: 'line1', line2: 'line2' }),
            stateChange: {
                selectedMarker: {
                    location: { lat: 0, lon: 1 },
                    address: {
                        line1: 'line1',
                        line2: 'line2',
                    },
                },
            },
        },
        {
            name: 'should set current user points',
            partialState: {},
            action: mapAppSetLoggedInUser({ id: 'i have to be set', points: 10 }),
            stateChange: {
                loggedInUser: { id: 'i have to be set', points: 10 },
            },
        },
        {
            name: 'should change the map app state',
            partialState: { component: MapAppComponents.LOGIN_MODAL },
            action: mapAppShowComponent(MapAppComponents.DEVICE_LOCATION),
            stateChange: { component: MapAppComponents.DEVICE_LOCATION },
        },
    ].forEach(({ name, partialState, action, stateChange }) => {
        itShouldReduceBy(name, {
            reducer: MapAppReducer,
            stateBuilder: buildMapAppState,
            partialState,
            action,
            stateChange,
        });
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

    [
        {
            name: 'not changing state on list devices remote request',
            initialDevices: [],
            action: deviceListRequest(),
            resultingDevices: [],
        },
        {
            name: 'not changing state on create device remote request',
            initialDevices: [],
            action: deviceCreateRequest(),
            resultingDevices: [],
        },
        {
            name: 'should overwrite devices',
            initialDevices: [existingDevice],
            action: devicesListed([receivedDevice]),
            resultingDevices: [receivedDevice],
        },

        {
            name: 'should add device',
            initialDevices: [existingDevice],
            action: deviceCreated(receivedDevice),
            resultingDevices: [existingDevice, receivedDevice],
        },

        {
            name: 'should delete a device',
            initialDevices: [existingDevice, receivedDevice],
            action: deviceDeleted('existing'),
            resultingDevices: [receivedDevice],
        },

        {
            name: 'should approve a device and maintain previous device order',
            initialDevices: [receivedDevice, existingDevice],
            action: deviceApproved(receivedDevice.id),
            resultingDevices: [{ ...receivedDevice, approvals: 1, lastUpdate: 1234567890 }, existingDevice],
        },
    ].forEach(({ name, initialDevices, action, resultingDevices }) => {
        itShouldReduceBy(name, {
            reducer: MapAppReducer,
            stateBuilder: buildMapAppState,
            partialState: { devices: initialDevices },
            action,
            stateChange: { devices: resultingDevices },
        });
    });
});

describe('MapApp reducer tests - device creation ongoing', () => {
    [
        {
            name: 'should set device creation ongoing to true',
            partialState: { isDeviceCreationOngoing: false },
            action: deviceCreation(true),
            stateChange: { isDeviceCreationOngoing: true },
        },
        {
            name: 'should set device creation ongoing to false',
            partialState: { isDeviceCreationOngoing: true },
            action: deviceCreation(false),
            stateChange: { isDeviceCreationOngoing: false },
        },
    ].forEach(({ name, partialState, action, stateChange }) => {
        itShouldReduceBy(name, {
            reducer: MapAppReducer,
            stateBuilder: buildMapAppState,
            partialState,
            action,
            stateChange,
        });
    });
});
