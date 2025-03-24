import { MapAppReducer } from '../MapAppReducer';
import {
    mapAppGetLocationAddress,
    mapAppLoggedInUserReset,
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
import { itShouldReduceBy, testInitialState } from '../../../../../redux/__test__/helpers';

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

    [
        {
            name: 'not changing the initial state on a dummy action',
            initialState: {},
            action: { type: 'DUMMY_ACTION' },
            stateChange: {},
        },
        {
            name: 'resetting current user id',
            initialState: { loggedInUser: { id: 'reset me!', points: 0 } },
            action: mapAppLoggedInUserReset(),
            stateChange: { loggedInUser: null },
        },
        {
            name: 'setting logged in user id',
            initialState: { component: MapAppComponents.LOGIN_MODAL },
            action: mapAppSetLoggedInUserID('set me in the state'),
            stateChange: {
                loggedInUser: { id: 'set me in the state', points: null },
            },
        },
        {
            name: 'updating logged in user if the ids match',
            initialState: { loggedInUser: { id: 'i should get more points', points: 0 } },
            action: mapAppUpdateLoggedInUser({ id: 'i should get more points', points: 30 }),
            stateChange: {
                loggedInUser: { id: 'i should get more points', points: 30 },
            },
        },
        {
            name: 'not updating logged in user if the ids dont match',
            initialState: { loggedInUser: { id: 'my points should not change', points: 53 } },
            action: mapAppUpdateLoggedInUser({ id: 'because ids dont match', points: 71 }),
            stateChange: {},
        },
        {
            name: 'setting coordinates',
            initialState: {},
            action: mapAppSetLocationCoordinates({ lat: 42.85862508449081, lon: 74.6085298061371 }),
            stateChange: {
                selectedMarker: { location: { lat: 42.85862508449081, lon: 74.6085298061371 }, address: null },
            },
        },
        {
            name: 'doing nothing when getting an address',
            initialState: {},
            action: mapAppGetLocationAddress({ lat: 42.85862508449081, lon: 74.6085298061371 }),
            stateChange: {},
        },
        {
            name: 'setting location address',
            initialState: {
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
            name: 'setting current user points',
            initialState: {},
            action: mapAppSetLoggedInUser({ id: 'i have to be set', points: 10 }),
            stateChange: {
                loggedInUser: { id: 'i have to be set', points: 10 },
            },
        },
        {
            name: 'changing the map app state',
            initialState: { component: MapAppComponents.LOGIN_MODAL },
            action: mapAppShowComponent(MapAppComponents.DEVICE_LOCATION),
            stateChange: { component: MapAppComponents.DEVICE_LOCATION },
        },
    ].forEach(({ name, initialState, action, stateChange }) => {
        itShouldReduceBy(name, {
            reducer: MapAppReducer,
            stateBuilder: buildMapAppState,
            initialState,
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
            name: 'overwriting devices on list devices',
            initialDevices: [existingDevice],
            action: devicesListed([receivedDevice]),
            resultingDevices: [receivedDevice],
        },

        {
            name: 'adding device',
            initialDevices: [existingDevice],
            action: deviceCreated(receivedDevice),
            resultingDevices: [existingDevice, receivedDevice],
        },

        {
            name: 'deleting a device',
            initialDevices: [existingDevice, receivedDevice],
            action: deviceDeleted('existing'),
            resultingDevices: [receivedDevice],
        },

        {
            name: 'approving a device and maintaining device order',
            initialDevices: [receivedDevice, existingDevice],
            action: deviceApproved(receivedDevice.id),
            resultingDevices: [{ ...receivedDevice, approvals: 1, lastUpdate: 1234567890 }, existingDevice],
        },
    ].forEach(({ name, initialDevices, action, resultingDevices }) => {
        itShouldReduceBy(name, {
            reducer: MapAppReducer,
            stateBuilder: buildMapAppState,
            initialState: { devices: initialDevices },
            action,
            stateChange: { devices: resultingDevices },
        });
    });
});

describe('MapApp reducer tests - device creation ongoing', () => {
    [
        {
            name: 'setting device creation ongoing to true',
            initialState: { isDeviceCreationOngoing: false },
            action: deviceCreation(true),
            stateChange: { isDeviceCreationOngoing: true },
        },
        {
            name: 'setting device creation ongoing to false',
            initialState: { isDeviceCreationOngoing: true },
            action: deviceCreation(false),
            stateChange: { isDeviceCreationOngoing: false },
        },
    ].forEach(({ name, initialState, action, stateChange }) => {
        itShouldReduceBy(name, {
            reducer: MapAppReducer,
            stateBuilder: buildMapAppState,
            initialState,
            action,
            stateChange,
        });
    });
});
