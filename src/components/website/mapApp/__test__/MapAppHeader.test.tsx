import React from 'react';
import { fireEvent, getByTestId } from '@testing-library/react';
import { MapAppHeader } from '../MapAppHeader';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mapAppLoginModalOpen } from '../redux/actions';
import { AuthenticationStep } from '../../login/redux/state';
import {
    mockAuthenticationState,
    mockDispatch,
    mockMapAppState,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/AuthenticationState';

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

    it('should match the snapshot at user authenticated state', () => {
        mockAuthenticationState({ step: AuthenticationStep.LOGGED_IN });
        const component = renderForSnapshotTest(<MapAppHeader />);

        expect(component).toMatchSnapshot();
    });
});

describe('MapAppHeader action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<MapAppHeader />);

        const loginButton = getByTestId(container, 'loginButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppLoginModalOpen());
    });
});
