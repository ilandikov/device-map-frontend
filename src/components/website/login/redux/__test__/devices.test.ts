import { mapAppRemoteAnswer } from '../../../mapApp/redux/MapAppAction';
import { testDevicesEpic, testListDevicesProcessor } from './devicesTestHelpers';

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic(sentAction, expectedActions);
    });
});

describe('list devices', () => {
    it('should process a resolved promise', async () => {
        const remoteAnswer = Promise.resolve({
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

        const expectedAction = mapAppRemoteAnswer([
            { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
        ]);

        await testListDevicesProcessor(remoteAnswer, [expectedAction]);
    });

    it('should process a rejected promise', async () => {
        const remoteAnswer = Promise.reject();

        await testListDevicesProcessor(remoteAnswer, []);
    });
});
