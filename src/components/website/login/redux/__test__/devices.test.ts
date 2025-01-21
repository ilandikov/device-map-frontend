import {
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppApproveDevice,
    mapAppApproveDeviceRequest,
    mapAppDeleteDevice,
    mapAppDeleteDeviceRequest,
    mapAppRemoteErrorAnswer,
    mapAppRemoteRequest,
    mapAppSetDevices,
} from '../../../mapApp/redux/MapAppAction';
import { DevicesClient } from '../../../../../redux/store';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { testDevicesEpic } from './devicesTestHelpers';

const resolvingClient: DevicesClient = {
    forAnonymousUser: {
        listDevices: () =>
            Promise.resolve({
                devices: [
                    {
                        __typename: 'T22Device',
                        id: 'dev1',
                        createdDate: '1754126457812',
                        creatorID: 'fancy creator',
                        location: {
                            __typename: 'T22Location',
                            lat: 42.85862508449081,
                            lon: 74.6085298061371,
                        },
                    },
                ],
                count: 1,
            }),
    },
    forAuthenticatedUser: {
        createDevice: (createDeviceInput) =>
            Promise.resolve({
                device: {
                    id: 'testId',
                    createdDate: '1796354896548',
                    creatorID: 'new creator',
                    location: createDeviceInput.location,
                },
            }),
        deleteDevice: (deleteDeviceInput) => Promise.resolve({ id: deleteDeviceInput.id }),
        approveDevice: (approveDeviceInput) => Promise.resolve({ id: approveDeviceInput.id, lastUpdate: Date.now() }),
    },
};

const rejectingClient: DevicesClient = {
    forAnonymousUser: {
        listDevices: () => Promise.reject('list devices went wrong'),
    },
    forAuthenticatedUser: {
        createDevice: () => Promise.reject('create device went wrong'),
        deleteDevice: () => Promise.reject('delete device went wrong'),
        approveDevice: () => Promise.reject('approve device went wrong'),
    },
};

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(resolvingClient, mapAppState, sentAction, expectedActions);
    });
});

describe('devices - list devices', () => {
    it('should process a resolved promise', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.LIST_DEVICES);
        const expectedAction = mapAppSetDevices([
            {
                __typename: 'T22Device',
                id: 'dev1',
                createdDate: '1754126457812',
                creatorID: 'fancy creator',
                location: {
                    __typename: 'T22Location',
                    lat: 42.85862508449081,
                    lon: 74.6085298061371,
                },
            },
        ]);

        await testDevicesEpic(resolvingClient, mapAppState, sentAction, [expectedAction]);
    });

    it('should process a rejected promise', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.LIST_DEVICES);
        const expectedAction = mapAppRemoteErrorAnswer('list devices went wrong');

        await testDevicesEpic(rejectingClient, mapAppState, sentAction, [expectedAction]);
    });
});

describe('devices - create device', () => {
    it('should send action with the new device at selected marker location', async () => {
        const mapAppState = buildMapAppState({ selectedMarker: { location: { lat: 5, lon: 6 }, address: null } });
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppAddDevice({
            id: 'testId',
            createdDate: '1796354896548',
            creatorID: 'new creator',
            location: { lat: 5, lon: 6 },
        });

        await testDevicesEpic(resolvingClient, mapAppState, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppRemoteErrorAnswer('create device went wrong');

        await testDevicesEpic(rejectingClient, mapAppState, sentAction, [expectedAction]);
    });
});

describe('devices - delete device', () => {
    it('should send action to delete device', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppDeleteDeviceRequest('deleteThisOne');
        const expectedAction = mapAppDeleteDevice('deleteThisOne');

        await testDevicesEpic(resolvingClient, mapAppState, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppDeleteDeviceRequest('deleteThisOne');
        const expectedAction = mapAppRemoteErrorAnswer('delete device went wrong');

        await testDevicesEpic(rejectingClient, mapAppState, sentAction, [expectedAction]);
    });
});

describe('devices - approve device', () => {
    it.failing('should send action to approve device', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppApproveDeviceRequest('approve me!');
        const expectedAction = mapAppApproveDevice('approve me!', 1781204597512);

        await testDevicesEpic(resolvingClient, mapAppState, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppApproveDeviceRequest('approve me!');
        const expectedAction = mapAppRemoteErrorAnswer('approve device went wrong');

        await testDevicesEpic(rejectingClient, mapAppState, sentAction, [expectedAction]);
    });
});
