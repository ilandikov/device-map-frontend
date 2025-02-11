import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { MapAppButton, mapAppButtonClick, mapAppSetUsageStep } from '../redux/MapAppAction';
import { LoginButton, LogoutButton } from '../UserButton';
import {
    LoginModalButton,
    LoginModalCheck,
    loginModalButtonClick,
    loginModalRemoteRequest,
} from '../../login/redux/LoginModalAction';
import { MapAppUsageStep } from '../redux/MapAppState';

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

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppSetUsageStep(MapAppUsageStep.USER_AUTHENTICATION));
        expect(mockDispatch).toHaveBeenNthCalledWith(2, mapAppButtonClick(MapAppButton.LOGIN));
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<LogoutButton />);

        const loginButton = getByTestId(container, 'userButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppSetUsageStep(MapAppUsageStep.HOME_SCREEN));
        expect(mockDispatch).toHaveBeenNthCalledWith(2, mapAppButtonClick(MapAppButton.LOGOUT));
        expect(mockDispatch).toHaveBeenNthCalledWith(3, loginModalButtonClick(LoginModalButton.USER_BUTTON));
        expect(mockDispatch).toHaveBeenNthCalledWith(4, loginModalRemoteRequest(LoginModalCheck.NONE));
    });
});
