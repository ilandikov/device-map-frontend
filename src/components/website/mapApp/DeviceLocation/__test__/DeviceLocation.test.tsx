import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { MapAppComponents } from '../../redux/MapAppState';
import { DeviceLocation } from '../DeviceLocation';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('device list snapshot tests', () => {
    it('should show address loader and a list devices matching the selected marker without the create device item', () => {
        mockMapAppState({
            component: MapAppComponents.PRODUCT_DESCRIPTION,
            devices: [
                { id: '85378', createdDate: '0000000000000', creatorID: 'John Doe', location: { lat: 6.3, lon: 9.2 } },
            ],
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: null,
            },
        });

        testSnapshot(<DeviceLocation />);
    });

    it('should show the address and a list devices matching the selected marker with the create device item', () => {
        mockMapAppState({
            component: MapAppComponents.DEVICE_LOCATION,
            loggedInUser: { id: 'I created the second one!', points: 0 },
            devices: [
                {
                    id: 'Not matching selected marker',
                    createdDate: '0000000000001',
                    creatorID: 'someone',
                    location: { lat: 0, lon: 0 },
                },
                {
                    id: 'Matching selected marker',
                    createdDate: '0000000000001',
                    creatorID: 'I created the second one!',
                    location: { lat: 26.3553423, lon: 19.23131 },
                },
            ],
            selectedMarker: {
                location: { lat: 26.3553423, lon: 19.23131 },
                address: {
                    addressLine1: 'Street and number',
                    addressLine2: 'District and city',
                },
            },
        });

        testSnapshot(<DeviceLocation />);
    });
});
