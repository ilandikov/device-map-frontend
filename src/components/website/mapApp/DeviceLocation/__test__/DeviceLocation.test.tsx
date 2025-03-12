import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { DeviceList } from '../DeviceList';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('device list snapshot tests', () => {
    it('should show only the device matching the selected marker', () => {
        mockMapAppState({
            devices: [],
            selectedMarker: { location: { lat: 0, lon: 0 }, address: null },
            loggedInUser: null,
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<DeviceList />);
    });

    it('should show only the create device item', () => {
        mockMapAppState({
            devices: [],
            selectedMarker: { location: { lat: 0, lon: 0 }, address: null },
            loggedInUser: { id: 'i am logged in', points: 0 },
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<DeviceList />);
    });

    it('should show the temporary item and the create device item', () => {
        mockMapAppState({
            devices: [],
            selectedMarker: { location: { lat: 0, lon: 0 }, address: null },
            loggedInUser: { id: 'i am logged in', points: 0 },
            isDeviceCreationOngoing: true,
        });

        testSnapshot(<DeviceList />);
    });
});
