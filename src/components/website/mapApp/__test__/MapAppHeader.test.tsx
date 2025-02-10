import React from 'react';
import { MapAppHeader } from '../MapAppHeader';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { MapAppUsageStep } from '../redux/MapAppState';
import { UserPoints } from '../UserPoints';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapAppHeader snapshot tests', () => {
    it('should match the snapshot at the initial state', () => {
        mockMapAppState({});
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management while waiting for user points', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management step with 0 points', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT, currentUserPoints: 0 });
        const component = renderForSnapshotTest(<UserPoints className="map-app-header-block" />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management step after getting the user points', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT, currentUserPoints: 320 });
        const component = renderForSnapshotTest(<UserPoints className="map-app-header-block" />);

        expect(component).toMatchSnapshot();
    });
});
