import { T22Location } from '@mancho-school-t22/graphql-types';
import {
    MapAppRemoteRequestType,
    mapAppAddDevice,
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
    },
    createDevice: (location: T22Location) =>
        Promise.resolve({ id: 'testId', location: { lat: location.lat, lon: location.lon } }),
};

const rejectingClient: DevicesClient = {
    forAnonymousUser: {
        listDevices: () => Promise.reject('list devices went wrong'),
    },
    createDevice: () => Promise.reject('create device went wrong'),
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

describe('list devices', () => {
    it('should process a resolved promise', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.LIST_DEVICES);
        const expectedAction = mapAppSetDevices([
            {
                __typename: 'T22Device',
                id: 'dev1',
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
    it.failing('should send action with the new device at selected marker location', async () => {
        const mapAppState = buildMapAppState({ selectedMarker: { location: { lat: 5, lon: 6 }, address: null } });
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppAddDevice({ id: 'testId', location: { lat: 5, lon: 6 } });

        await testDevicesEpic(resolvingClient, mapAppState, sentAction, [expectedAction]);
    });

    it.failing('should notify about the error', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppRemoteErrorAnswer('create device went wrong');

        await testDevicesEpic(rejectingClient, mapAppState, sentAction, [expectedAction]);
    });
});
