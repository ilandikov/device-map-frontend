import React from 'react';
import { MapAppHeader } from '../MapAppHeader';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapAppHeader snapshot tests', () => {
    it('should match the snapshot before the user is logged in', () => {
        mockMapAppState({ currentUserID: null });
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot when the user is logged in', () => {
        mockMapAppState({ currentUserID: 'i am logged in' });
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });
});
