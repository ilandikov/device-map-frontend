import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { MapAppUsageStep } from '../redux/MapAppState';
import { DeviceMarkerDescription } from '../DeviceMarkerDescription';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('device list snapshot tests', () => {
    it('should show address loader and a list devices matching the selected marker without the create device item', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.HOME_SCREEN,
            devices: [{ id: '85378', location: { lat: 6.3, lon: 9.2 } }],
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: null,
            },
        });
        const component = renderForSnapshotTest(<DeviceMarkerDescription />);

        expect(component).toMatchSnapshot();
    });

    it('should show the address and a list devices matching the selected marker with the create device item', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
            devices: [{ id: '85378', location: { lat: 6.3, lon: 9.2 } }],
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: {
                    addressLine1: 'Street and number',
                    addressLine2: 'District and city',
                },
            },
        });
        const component = renderForSnapshotTest(<DeviceMarkerDescription />);

        expect(component).toMatchSnapshot();
    });
});
