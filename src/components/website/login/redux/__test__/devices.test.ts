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
        const expectedActions: MapAppRemoteAnswer[] = [{ type: MapAppActionType.REMOTE_ANSWER, devices: [] }];

        await testDevicesEpic(sentAction, expectedActions);
    });
});
