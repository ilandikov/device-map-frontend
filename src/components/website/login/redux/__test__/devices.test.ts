import { MapAppActionType } from '../../../mapApp/redux/MapAppAction';
import { testDevicesEpic } from './devicesTestHelpers';

describe('devices epic test', () => {
    it('should get a list of devices', async () => {
        const sentAction = { type: MapAppActionType.REMOTE_REQUEST };
        const expectedActions = [];

        await testDevicesEpic(sentAction, expectedActions);
    });
});
