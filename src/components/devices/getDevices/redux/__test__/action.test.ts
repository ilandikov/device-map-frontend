import { GetDevicesRequest, GetServiceActionTypes, getDevices } from '../action';

describe('getDevices() action tests', () => {
    it('should create action for a new device', () => {
        const createdAction = getDevices('996557189977', true);

        const expectedAction: GetDevicesRequest = {
            type: GetServiceActionTypes.GET_DEVICES_REQUEST,
            id: '996557189977',
            acquiring: true,
        };

        expect(createdAction).toEqual(expectedAction);
    });
});
