import {
    deviceApproveRequest,
    deviceApproved,
    deviceCreateRequest,
    deviceCreated,
    deviceCreationSubscriptionRequest,
    deviceDeleteRequest,
    deviceDeleted,
    deviceListRequest,
    deviceRemoteError,
    devicesListed,
} from '../DeviceAction';
import { devices } from '../devices';
import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { rejectingDevicesClient, resolvingDevicesClient } from './devicesTestHelpers';

const deviceCreationTimeStampFromBackend = 1896916059204;

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(deviceCreationTimeStampFromBackend));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('devices epic test', () => {
    itShouldAnswerBy('no action to a non-remote request action', {
        epic: devices,
        // @ts-expect-error
        sentAction: { type: 'notAMapAppAction' },
        expectedActions: [],
    });
});

describe('devices - list devices', () => {
    itShouldAnswerBy('listing devices', {
        epic: devices,
        remoteClients: { devicesClient: resolvingDevicesClient },
        sentAction: deviceListRequest(),
        expectedActions: [
            devicesListed([
                {
                    id: 'dev1',
                    createdDate: '1754126457812',
                    lastUpdate: '1754126458923',
                    creatorID: 'fancy creator',
                    location: {
                        lat: 42.85862508449081,
                        lon: 74.6085298061371,
                    },
                    approvals: 6,
                },
            ]),
        ],
    });

    itShouldAnswerBy('sending an error', {
        epic: devices,
        remoteClients: { devicesClient: rejectingDevicesClient },
        sentAction: deviceListRequest(),
        expectedActions: [deviceRemoteError('list devices went wrong')],
    });
});

describe('devices - create device', () => {
    itShouldAnswerBy('creating device at selected marker location', {
        epic: devices,
        partialRootState: { mapAppState: { selectedMarker: { location: { lat: 5, lon: 6 }, address: null } } },
        remoteClients: { devicesClient: resolvingDevicesClient },
        sentAction: deviceCreateRequest(),
        expectedActions: [
            deviceCreated({
                id: 'testId',
                createdDate: '1796354896548',
                lastUpdate: '1796354897659',
                creatorID: 'new creator',
                location: { lat: 5, lon: 6 },
                approvals: -1,
            }),
            deviceCreationSubscriptionRequest('testId'),
        ],
    });

    itShouldAnswerBy('sending an error', {
        epic: devices,
        remoteClients: { devicesClient: rejectingDevicesClient },
        sentAction: deviceCreateRequest(),
        expectedActions: [deviceRemoteError('create device went wrong')],
    });
});

describe('devices - delete device', () => {
    itShouldAnswerBy('deleting device', {
        epic: devices,
        remoteClients: { devicesClient: resolvingDevicesClient },
        sentAction: deviceDeleteRequest('deleteThisOne'),
        expectedActions: [deviceDeleted('deleteThisOne')],
    });

    itShouldAnswerBy('sending an error', {
        epic: devices,
        remoteClients: { devicesClient: rejectingDevicesClient },
        sentAction: deviceDeleteRequest('deleteThisOne'),
        expectedActions: [deviceRemoteError('delete device went wrong')],
    });
});

describe('devices - approve device', () => {
    itShouldAnswerBy('approving device', {
        epic: devices,
        remoteClients: { devicesClient: resolvingDevicesClient },
        sentAction: deviceApproveRequest('approve me!'),
        expectedActions: [deviceApproved('approve me!', deviceCreationTimeStampFromBackend)],
    });

    itShouldAnswerBy('sending an error', {
        epic: devices,
        remoteClients: { devicesClient: rejectingDevicesClient },
        sentAction: deviceApproveRequest('approve me!'),
        expectedActions: [deviceRemoteError('approve device went wrong')],
    });
});
