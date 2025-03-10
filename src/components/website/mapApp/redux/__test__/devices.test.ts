import {
    deviceApproveRequest,
    deviceApproved,
    deviceCreateRequest,
    deviceCreated,
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

const deviceListFromMock = [
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
];
const deviceCreatedByTheMock = {
    id: 'testId',
    createdDate: '1796354896548',
    lastUpdate: '1796354897659',
    creatorID: 'new creator',
    location: { lat: 5, lon: 6 },
    approvals: -1,
};

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(deviceCreationTimeStampFromBackend));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('devices epic test - receiving irrelevant action', () => {
    itShouldAnswerBy('no action to a non-remote request action', {
        epic: devices,
        // @ts-expect-error
        sentAction: { type: 'notAMapAppAction' },
        expectedActions: [],
    });
});

describe('devices epic test - nominal cases', () => {
    [
        {
            sentAction: deviceListRequest(),
            expectedActions: [devicesListed(deviceListFromMock)],
        },
        {
            sentAction: deviceCreateRequest(),
            expectedActions: [deviceCreated(deviceCreatedByTheMock)],
        },
        { sentAction: deviceDeleteRequest('deleteThisOne'), expectedActions: [deviceDeleted('deleteThisOne')] },
        {
            sentAction: deviceApproveRequest('approve me!'),
            expectedActions: [deviceApproved('approve me!', deviceCreationTimeStampFromBackend)],
        },
    ].forEach(({ sentAction, expectedActions: expectedAction }) => {
        itShouldAnswerBy(`sending ${sentAction.request}`, {
            epic: devices,
            partialRootState: { mapAppState: { selectedMarker: { location: { lat: 5, lon: 6 }, address: null } } },
            remoteClients: { devicesClient: resolvingDevicesClient },
            sentAction,
            expectedActions: expectedAction,
        });
    });
});

describe('devices epic tests - error cases', () => {
    [
        { sentAction: deviceListRequest(), expectedAction: deviceRemoteError('list devices went wrong') },
        { sentAction: deviceCreateRequest(), expectedAction: deviceRemoteError('create device went wrong') },
        {
            sentAction: deviceDeleteRequest('deleteThisOne'),
            expectedAction: deviceRemoteError('delete device went wrong'),
        },
        {
            sentAction: deviceApproveRequest('approve me!'),
            expectedAction: deviceRemoteError('approve device went wrong'),
        },
    ].forEach(({ sentAction, expectedAction }) => {
        itShouldAnswerBy(`sending an error for action ${sentAction.request}`, {
            epic: devices,
            remoteClients: { devicesClient: rejectingDevicesClient },
            sentAction,
            expectedActions: [expectedAction],
        });
    });
});
