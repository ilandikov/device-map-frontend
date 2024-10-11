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
        mockMapAppState({ usageStep: MapAppUsageStep.HOME_SCREEN, devices: [] });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at user authentication state', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
            devices: [],
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management state', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
            devices: [],
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at when devices list is shown', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
            devices: [
                { name: 'test device 1', location: { lat: 1, lng: 2 } },
                { name: 'test device 2', location: { lat: 3, lng: 4 } },
                { name: 'test device 3', location: { lat: 1, lng: 2 } },
                { name: 'test device 4', location: { lat: 5, lng: 6 } },
            ],
            selectedDeviceMarker: {
                lat: 123,
                lng: 456,
            },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });
});
