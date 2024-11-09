import { ApolloQueryResult } from '@apollo/client';
import { Query } from '@mancho-school-t22/graphql-types';
import {
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppRemoteRequest,
    mapAppSetDevices,
} from '../../../mapApp/redux/MapAppAction';
import { MapAppState, mapAppInitialState } from '../../../mapApp/redux/MapAppState';
import { testDevicesEpic, testListDevicesProcessor } from './devicesTestHelpers';

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const mapAppState = mapAppInitialState;
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(sentAction, mapAppState, expectedActions);
    });
});

describe('list devices', () => {
    it('should process a resolved promise', async () => {
        const remoteAnswer: Promise<ApolloQueryResult<Query>> = Promise.resolve({
            data: {
                T22ListDevices: [
                    {
                        __typename: 'T22Device',
                        id: 'dev1',
                        location: {
                            __typename: 'T22Location',
                            lat: 42.85862508449081,
                            lon: 74.6085298061371,
                        },
                    },
                ],
            },
            loading: false,
            networkStatus: 7,
        });

        const expectedAction = mapAppSetDevices([
            { id: 'dev1', location: { lat: 42.85862508449081, lon: 74.6085298061371 } },
        ]);

        await testListDevicesProcessor(remoteAnswer, [expectedAction]);
    });

    it('should process a rejected promise', async () => {
        const remoteAnswer = Promise.reject();

        await testListDevicesProcessor(remoteAnswer, []);
    });
});

describe('devices - create device', () => {
    it.failing('should send action with the new device', async () => {
        const mapAppState: MapAppState = {
            ...mapAppInitialState,
            selectedMarker: { location: { lat: 2, lon: 3 }, address: null },
        };
        const sentAction = mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE);
        const expectedActions = [mapAppAddDevice({ id: 'testId', location: { lat: 2, lon: 3 } })];

        await testDevicesEpic(sentAction, mapAppState, expectedActions);
    });
});
