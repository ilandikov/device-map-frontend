import React from 'react';
import MapApp from '../MapApp';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../redux/__mocks__/MapAppState';
import { MapAppUsageStep } from '../MapAppReducer';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapApp snapshot tests', () => {
    it('should match the snapshot', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.HOMESCREEN, showProductDescription: true, showLoginModal: false });
        const component = renderForSnapshotTest(<MapApp />);

        expect(component).toMatchSnapshot();
    });
});
