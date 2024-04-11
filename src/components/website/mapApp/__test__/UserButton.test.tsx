import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import {
    mockAuthenticationState,
    mockDispatch,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/AuthenticationState';
import { mapAppLoginModalOpen } from '../redux/actions';
import { UserButton } from '../UserButton';
import { AuthenticationStep } from '../../login/redux/state';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('UserButton snapshot tests', () => {
    it('should match the snapshot at the initial state', () => {
        mockAuthenticationState({ step: AuthenticationStep.WELCOME });
        const component = renderForSnapshotTest(<UserButton />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at user authenticated state', () => {
        mockAuthenticationState({ step: AuthenticationStep.LOGGED_IN });
        const component = renderForSnapshotTest(<UserButton />);

        expect(component).toMatchSnapshot();
    });
});

describe('UserButton action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<UserButton />);

        const loginButton = getByTestId(container, 'loginButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppLoginModalOpen());
    });
});
