import React from 'react';
import MapApp from '../MapApp';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { MapAppComponents } from '../redux/MapAppState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapApp snapshot tests', () => {
    it('should match the snapshot at home screen step', () => {
        mockMapAppState({
            component: MapAppComponents.PRODUCT_DESCRIPTION,
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at user authentication state', () => {
        mockMapAppState({
            component: MapAppComponents.LOGIN_MODAL,
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management state', () => {
        mockMapAppState({
            component: MapAppComponents.DEVICE_LOCATION,
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management with a device location open', () => {
        mockMapAppState({
            component: MapAppComponents.DEVICE_LOCATION,
            currentUserID: 'i clicked at device location',
            currentUserPoints: 320,
            selectedMarker: { location: { lat: 1, lon: 2 }, address: { addressLine1: 'street', addressLine2: 'city' } },
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });
});
