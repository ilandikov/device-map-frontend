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
    it('should show address loader and a list devices matching the selected marker without the create device item', () => {
        mockMapAppState({
            devices: twoDevicesAtDifferentLocations,
            selectedMarker: matchingSecondDeviceLocation,
        });

        testSnapshot(<DeviceList />);
    });

    it('should show the address and a list devices matching the selected marker with the create device item and the temporary item', () => {
        mockMapAppState({
            loggedInUser: { id: 'I created the second one!', points: 0 },
            devices: twoDevicesAtDifferentLocations,
            selectedMarker: matchingSecondDeviceLocation,
            isDeviceCreationOngoing: true,
        });

        testSnapshot(<DeviceList />);
    });
});
