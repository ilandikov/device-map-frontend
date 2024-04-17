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
        mockMapAppState({ usageStep: MapAppUsageStep.HOME_SCREEN });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at user authentication state', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at device management state', () => {
        mockMapAppState({
            usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
        });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });
});
