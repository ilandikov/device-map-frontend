import { mapAppRemoteAnswer, mapAppRemoteRequest } from '../../../mapApp/redux/MapAppAction';
import { testDevicesEpic } from './devicesTestHelpers';

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(sentAction, expectedActions);
    });

    it('should get a list of devices', async () => {
        const request = mapAppRemoteRequest();
        const answer = mapAppRemoteAnswer([
            { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
        ]);

        await testDevicesEpic(request, [answer]);
    });
});
