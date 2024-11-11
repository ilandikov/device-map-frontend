import {
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppRemoteErrorAnswer,
    mapAppRemoteRequest,
    mapAppSetDevices,
} from '../../../mapApp/redux/MapAppAction';
import { DevicesClient } from '../../../../../redux/store';
import { testDevicesEpic } from './devicesTestHelpers';

const resolvingClient: DevicesClient = {
    listDevices: () =>
        Promise.resolve([
            {
                __typename: 'T22Device',
                id: 'dev1',
                location: {
                    __typename: 'T22Location',
                    lat: 42.85862508449081,
                    lon: 74.6085298061371,
                },
            },
        ]),
    createDevice: () => Promise.resolve({ id: 'testId', location: { lat: 2, lon: 3 } }),
};

const rejectingClient: DevicesClient = {
    listDevices: () => Promise.reject('list devices went wrong'),
    createDevice: () => Promise.reject('create device went wrong'),
};

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(resolvingClient, sentAction, expectedActions);
    });
});

describe('list devices', () => {
    it('should process a resolved promise', async () => {
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.LIST_DEVICES);
        const expectedAction = mapAppSetDevices([
            { id: 'dev1', location: { lat: 42.85862508449081, lon: 74.6085298061371 } },
        ]);

        await testDevicesEpic(resolvingClient, sentAction, [expectedAction]);
    });

    it('should process a rejected promise', async () => {
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.LIST_DEVICES);
        const expectedAction = mapAppRemoteErrorAnswer('list devices went wrong');

        await testDevicesEpic(rejectingClient, sentAction, [expectedAction]);
    });
});

describe('devices - create device', () => {
    it('should send action with the new device', async () => {
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppAddDevice({ id: 'testId', location: { lat: 2, lon: 3 } });

        await testDevicesEpic(resolvingClient, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppRemoteErrorAnswer('create device went wrong');

        await testDevicesEpic(rejectingClient, sentAction, [expectedAction]);
    });
});
