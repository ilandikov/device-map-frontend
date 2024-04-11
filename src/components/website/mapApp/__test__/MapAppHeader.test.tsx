import React from 'react';
import { MapAppHeader } from '../MapAppHeader';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { AuthenticationStep } from '../../login/redux/state';
import {
    mockAuthenticationState,
    mockDispatch,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapAppHeader snapshot tests', () => {
    it('should match the snapshot at the initial state', () => {
        mockAuthenticationState({ step: AuthenticationStep.WELCOME });
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at user authenticated state', () => {
        mockAuthenticationState({ step: AuthenticationStep.LOGGED_IN });
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });
});
