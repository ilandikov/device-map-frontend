import {
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppRemoteRequest,
    mapAppSetDevices,
} from '../../../mapApp/redux/MapAppAction';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { DevicesClient } from '../../../../../redux/store';
import { testDevicesEpic, testListDevicesProcessor } from './devicesTestHelpers';

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
};

const rejectingClient: DevicesClient = {
    listDevices: () => Promise.reject('list devices went wrong'),
};

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const mapAppState = buildMapAppState({});
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(mapAppState, resolvingClient, sentAction, expectedActions);
    });
});

describe('list devices', () => {
    it('should process a resolved promise', async () => {
        const expectedAction = mapAppSetDevices([
            { id: 'dev1', location: { lat: 42.85862508449081, lon: 74.6085298061371 } },
        ]);

        await testListDevicesProcessor(resolvingClient.listDevices(), [expectedAction]);
    });

    it('should process a rejected promise', async () => {
        await testListDevicesProcessor(rejectingClient.listDevices(), []);
    });
});

describe('devices - create device', () => {
    it('should send action with the new device', async () => {
        const mapAppState = buildMapAppState({
            selectedMarker: {
                location: { lat: 2, lon: 3 },
                address: null,
            },
        });
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedAction = mapAppAddDevice({ id: 'testId', location: { lat: 2, lon: 3 } });

        await testDevicesEpic(mapAppState, resolvingClient, sentAction, [expectedAction]);
    });
});
