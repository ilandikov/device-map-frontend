import {
    deviceApproveRequest,
    deviceApproved,
    deviceCreateRequest,
    deviceCreated,
    deviceCreated2,
    deviceCreationSubscriptionRequest,
    deviceDeleteRequest,
    deviceDeleted,
    deviceListRequest,
    deviceRemoteError,
    devicesListed,
} from '../DeviceAction';
import { deviceSubscriptions, devices, subscription, subscriptionError } from '../devices';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { rejectingDevicesClient, resolvingDevicesClient } from './devicesTestHelpers';

const testDevicesEpic = buildEpicTester(devices);

const deviceCreationTimeStampFromBackend = 1896916059204;

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(deviceCreationTimeStampFromBackend));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('devices epic test', () => {
    it('should return no action to a non-remote request action', async () => {
        const mapAppState = {};
        const sentAction = { type: 'notAMapAppAction' };
        const expectedActions = [];

        // @ts-expect-error
        await testDevicesEpic({ devicesClient: resolvingDevicesClient }, { mapAppState }, sentAction, expectedActions);
    });
});

describe('devices - list devices', () => {
    it('should process a resolved promise', async () => {
        const mapAppState = {};
        const sentAction = deviceListRequest();
        const expectedAction = devicesListed([
            {
                __typename: 'T22Device',
                id: 'dev1',
                createdDate: '1754126457812',
                creatorID: 'fancy creator',
                location: {
                    __typename: 'T22Location',
                    lat: 42.85862508449081,
                    lon: 74.6085298061371,
                },
            },
        ]);

        await testDevicesEpic({ devicesClient: resolvingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });

    it('should process a rejected promise', async () => {
        const mapAppState = {};
        const sentAction = deviceListRequest();
        const expectedAction = deviceRemoteError('list devices went wrong');

        await testDevicesEpic({ devicesClient: rejectingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });
});

describe('devices - create device', () => {
    it('should send action with the new device at selected marker location', async () => {
        const mapAppState = { selectedMarker: { location: { lat: 5, lon: 6 }, address: null } };
        const sentAction = deviceCreateRequest();
        const expectedAction = deviceCreated({
            id: 'testId',
            createdDate: '1796354896548',
            creatorID: 'new creator',
            location: { lat: 5, lon: 6 },
        });

        await testDevicesEpic({ devicesClient: resolvingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const mapAppState = {};
        const sentAction = deviceCreateRequest();
        const expectedAction = deviceRemoteError('create device went wrong');

        await testDevicesEpic({ devicesClient: rejectingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });
});

describe('devices - delete device', () => {
    it('should send action to delete device', async () => {
        const mapAppState = {};
        const sentAction = deviceDeleteRequest('deleteThisOne');
        const expectedAction = deviceDeleted('deleteThisOne');

        await testDevicesEpic({ devicesClient: resolvingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const mapAppState = {};
        const sentAction = deviceDeleteRequest('deleteThisOne');
        const expectedAction = deviceRemoteError('delete device went wrong');

        await testDevicesEpic({ devicesClient: rejectingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });
});

describe('devices - approve device', () => {
    it('should send action to approve device', async () => {
        const mapAppState = {};
        const sentAction = deviceApproveRequest('approve me!');
        const expectedAction = deviceApproved('approve me!', deviceCreationTimeStampFromBackend);

        await testDevicesEpic({ devicesClient: resolvingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const mapAppState = {};
        const sentAction = deviceApproveRequest('approve me!');
        const expectedAction = deviceRemoteError('approve device went wrong');

        await testDevicesEpic({ devicesClient: rejectingDevicesClient }, { mapAppState }, sentAction, [expectedAction]);
    });
});

const testDeviceSubscriptionsEpic = buildEpicTester(deviceSubscriptions);

describe('devices - response from subscription to device creation', () => {
    it('should send action with the new device', async () => {
        const sentAction = deviceCreationSubscriptionRequest('id-to-be-created');
        const expectedAction = deviceCreated2({
            id: 'id-to-be-created',
            creatorID: 'created-from-subscription',
            createdDate: 12345678000,
            lastUpdate: 12345678000,
            location: { lat: 9, lon: 5 },
        });

        await testDeviceSubscriptionsEpic({ project: (id) => subscription(id) }, {}, sentAction, [expectedAction]);
    });

    it('should notify about the error', async () => {
        const sentAction = deviceCreationSubscriptionRequest('id-to-be-created');
        const expectedAction = deviceRemoteError('could not subscribe to device update');

        await testDeviceSubscriptionsEpic({ project: () => subscriptionError() }, {}, sentAction, [expectedAction]);
    });
});
