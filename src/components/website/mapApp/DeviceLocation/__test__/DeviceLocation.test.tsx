import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { DeviceList } from '../DeviceList';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

const twoDevicesAtDifferentLocations = [
    {
        id: 'Not matching selected marker',
        createdDate: '0000000000001',
        lastUpdate: '0000000000002',
        creatorID: 'someone',
        location: { lat: 0, lon: 0 },
        approvals: 0,
    },
    {
        id: 'Matching selected marker',
        createdDate: '0000000000001',
        lastUpdate: '0000000000002',
        creatorID: 'I created the second one!',
        location: { lat: 26.3553423, lon: 19.23131 },
        approvals: 0,
    },
];

const matchingSecondDeviceLocation = {
    location: { lat: 26.3553423, lon: 19.23131 },
    address: null,
};

describe('device list snapshot tests', () => {
    it('should show only the device matching the selected marker', () => {
        mockMapAppState({
            devices: twoDevicesAtDifferentLocations,
            selectedMarker: matchingSecondDeviceLocation,
            loggedInUser: null,
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<DeviceList />);
    });

    it('should show the devices matching the selected marker, the temporary item and the create device item', () => {
        mockMapAppState({
            devices: twoDevicesAtDifferentLocations,
            selectedMarker: matchingSecondDeviceLocation,
            loggedInUser: { id: 'I created the second one!', points: 0 },
            isDeviceCreationOngoing: true,
        });

        testSnapshot(<DeviceList />);
    });
});
