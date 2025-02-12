import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { DeviceItem } from '../DeviceItem';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

const testDevice: T22Device = {
    id: 'try to delete me',
    createdDate: '1704558741541',
    creatorID: 'i created the device',
    location: { lat: 3, lon: 7 },
};

describe('DeviceItem snapshot tests - logged in user', () => {
    it('should match snapshot - created device with approve button and without delete button', () => {
        mockMapAppState({ loggedInUser: { id: 'i did not create the device', points: 0 } });

        testSnapshot(<DeviceItem device={{ ...testDevice, approvals: 0 }} isDeviceCreatedByCurrentUser={false} />);
    });

    it('should match snapshot - validating device with approve button and without delete button', () => {
        mockMapAppState({ loggedInUser: { id: 'i did not create the device', points: 0 } });

        testSnapshot(<DeviceItem device={{ ...testDevice, approvals: 1 }} isDeviceCreatedByCurrentUser={false} />);
    });

    it('should match snapshot - validated device without approve button and without delete button', () => {
        mockMapAppState({ loggedInUser: { id: 'i did not create the device', points: 0 } });

        testSnapshot(<DeviceItem device={{ ...testDevice, approvals: 2 }} isDeviceCreatedByCurrentUser={false} />);
    });

    it('should match snapshot - created device without approval button and with delete button', () => {
        mockMapAppState({ loggedInUser: { id: 'i created the device', points: 0 } });

        testSnapshot(<DeviceItem device={testDevice} isDeviceCreatedByCurrentUser={true} />);
    });
});

describe('DeviceItem snapshot tests - anonymous user', () => {
    it('should match snapshot - created device without approval button and without delete button', () => {
        mockMapAppState({ loggedInUser: null });

        testSnapshot(<DeviceItem device={testDevice} isDeviceCreatedByCurrentUser={false} />);
    });
});
