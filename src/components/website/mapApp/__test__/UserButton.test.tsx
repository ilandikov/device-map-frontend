import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import {
    mockAuthenticationState,
    mockDispatch,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/AuthenticationState';
import { mapAppLoginButtonClick, mapAppLogoutButtonClick } from '../redux/actions';
import { LoginButton, LogoutButton } from '../UserButton';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('UserButton snapshot tests', () => {
    it('Login button should match the snapshot', () => {
        const component = renderForSnapshotTest(<LoginButton />);

        expect(component).toMatchSnapshot();
    });

    it('Logout button should match the snapshot', () => {
        mockAuthenticationState({ email: 'logged@in.kr' });
        const component = renderForSnapshotTest(<LogoutButton />);

        expect(component).toMatchSnapshot();
    });
});

describe('UserButton action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<LoginButton />);

        const loginButton = getByTestId(container, 'userButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppLoginButtonClick());
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<LogoutButton />);

        const loginButton = getByTestId(container, 'userButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppLogoutButtonClick());
    });
});
