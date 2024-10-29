import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppRemoteRequest, mapAppRemoteAnswer, mapAppRemoteRequest } from '../../../mapApp/redux/MapAppAction';
import { deviceTransformer, listDevices } from '../devices';
import { testDevicesEpic } from './devicesTestHelpers';

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(sentAction, expectedActions);
    });

    it('should get a list of devices', async () => {
        const request: MapAppRemoteRequest = mapAppRemoteRequest();
        const answer = mapAppRemoteAnswer([
            { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
            { id: 'dev2a', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
            { id: 'dev2b', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
            { id: 'dev2c', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
            { id: 'dev2d', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
            { id: 'dev3', location: { lat: 42.85610049481582, lng: 74.60671663284303 } },
        ]);

        await testDevicesEpic(request, [answer]);
    });
});

describe('Devices - list', () => {
    it('test transformer', () => {
        const input = {
            __typename: 'T22Device',
            id: 'dev1',
            location: {
                __typename: 'T22Location',
                lat: 42.85862508449081,
                lon: 74.6085298061371,
            },
        };

        expect(deviceTransformer(input)).toEqual({
            id: 'dev1',
            location: {
                lat: 42.85862508449081,
                lng: 74.6085298061371,
            },
        });
    });

    it('test list devices', async () => {
        const devices = {
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
        };

        const deviceListLoader = Promise.resolve(devices);

        const incomingAction = {};
        const receivedAction = await lastValueFrom(
            of(incomingAction).pipe(() => listDevices(deviceListLoader), toArray()),
        );

        expect(receivedAction).toEqual([
            mapAppRemoteAnswer([
                {
                    id: 'dev1',
                    location: {
                        lat: 42.85862508449081,
                        lng: 74.6085298061371,
                    },
                },
            ]),
        ]);
    });
});
