import React from 'react';
import MapApp from '../MapApp';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { MapAppUsageStep } from '../redux/MapAppState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapApp snapshot tests', () => {
    it('should match the snapshot at home screen step', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.HOME_SCREEN,
            devices: [],
            selectedMarker: { location: null, address: null },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at user authentication state', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
            devices: [],
            selectedMarker: { location: null, address: null },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management state', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
            devices: [],
            selectedMarker: { location: null, address: null },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should list devices matching the selected marker and show the address', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.HOME_SCREEN,
            devices: [
                { id: 'test device 1', location: { lat: 1, lng: 2 } },
                { id: 'test device 2', location: { lat: 3, lng: 4 } },
                { id: 'test device 3', location: { lat: 1, lng: 2 } },
                { id: 'test device 4', location: { lat: 5, lng: 6 } },
            ],
            selectedMarker: {
                location: {
                    lat: 1,
                    lng: 2,
                },
                address: {
                    addressLine1: 'Street and number',
                    addressLine2: 'District and city',
                },
            },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should list devices matching the selected marker and show the loader', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.HOME_SCREEN,
            devices: [
                { id: 'test device 1', location: { lat: 1, lng: 2 } },
                { id: 'test device 2', location: { lat: 3, lng: 4 } },
                { id: 'test device 3', location: { lat: 1, lng: 2 } },
                { id: 'test device 4', location: { lat: 5, lng: 6 } },
                { id: 'test device 5', location: { lat: 1, lng: 2 } },
                { id: 'test device 6', location: { lat: 1, lng: 2 } },
            ],
            selectedMarker: {
                location: {
                    lat: 1,
                    lng: 2,
                },
                address: null,
            },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });
});
