import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { DeviceList } from '../DeviceList';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Device List snapshot tests', () => {
    it('should show only the device matching the selected marker', () => {
        mockMapAppState({
            devices: [
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
            ],
            selectedMarker: {
                location: { lat: 26.3553423, lon: 19.23131 },
                address: null,
            },
            loggedInUser: null,
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<DeviceList />);
    });
});
