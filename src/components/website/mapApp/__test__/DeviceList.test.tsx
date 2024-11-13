import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { DeviceList } from '../DeviceList';
import { MapAppUsageStep } from '../redux/MapAppState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('device list snapshot tests', () => {
    it('should list devices matching the selected marker without the create device item', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.HOME_SCREEN,
            devices: [{ id: '85378', location: { lat: 6.3, lon: 9.2 } }],
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: null,
            },
        });
        const component = renderForSnapshotTest(<DeviceList />);

        expect(component).toMatchSnapshot();
    });

    it('should list devices matching the selected marker with the create device item', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
            devices: [{ id: '85378', location: { lat: 6.3, lon: 9.2 } }],
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: null,
            },
        });
        const component = renderForSnapshotTest(<DeviceList />);

        expect(component).toMatchSnapshot();
    });
});
