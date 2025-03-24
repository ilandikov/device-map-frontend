import React from 'react';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
    testSnapshot,
} from '../../../../../tests/utils/RenderingHelpers';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { mapAppShowComponent } from '../redux/MapAppAction';
import { LoginButton, LogoutButton } from '../UserButton';
import {
    LoginModalButton,
    LoginModalCheck,
    loginModalButtonClick,
    loginModalRemoteRequest,
} from '../../login/redux/LoginModalAction';
import { MapAppComponents } from '../redux/MapAppState';
import { loggedInUserReset } from '../redux/LoggedInUserAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('UserButton snapshot tests', () => {
    it('Login button should match the snapshot', () => {
        testSnapshot(<LoginButton />);
    });

    it('Logout button should match the snapshot', () => {
        mockAuthenticationState({ email: 'logged@in.kr' });

        testSnapshot(<LogoutButton />);
    });
});

describe('UserButton action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch click action on login button click', () => {
        click(<LoginButton />, 'userButton');

        testDispatchedAction(mapAppShowComponent(MapAppComponents.LOGIN_MODAL));
    });

    it('should dispatch click action on login button click', () => {
        click(<LogoutButton />, 'userButton');

        testDispatchedActionsInOrder([
            mapAppShowComponent(MapAppComponents.PRODUCT_DESCRIPTION),
            loggedInUserReset(),
            loginModalButtonClick(LoginModalButton.USER_BUTTON),
            loginModalRemoteRequest(LoginModalCheck.NONE),
        ]);
    });
});
