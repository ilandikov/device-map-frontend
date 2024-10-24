import { MapAppActionType, MapAppRemoteAnswer, MapAppRemoteRequest } from '../../../mapApp/redux/MapAppAction';
import { testDevicesEpic } from './devicesTestHelpers';

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(sentAction, expectedActions);
    });

    it('should get a list of devices', async () => {
        const sentAction: MapAppRemoteRequest = { type: MapAppActionType.REMOTE_REQUEST };
        const expectedActions: MapAppRemoteAnswer[] = [
            {
                type: MapAppActionType.REMOTE_ANSWER,
                devices: [
                    { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
                    { id: 'dev2a', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev2b', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev2c', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev2d', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev3', location: { lat: 42.85610049481582, lng: 74.60671663284303 } },
                ],
            },
        ];

        await testDevicesEpic(sentAction, expectedActions);
    });
});
