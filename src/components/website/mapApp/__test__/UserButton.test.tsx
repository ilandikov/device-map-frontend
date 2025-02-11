import React from 'react';
import {
    click,
    renderForSnapshotTest,
    testDispatchedAction,
    testDispatchedActionsInOrder,
} from '../../../../../tests/utils/RenderingHelpers';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { mapAppResetCurrentUser, mapAppShowComponent } from '../redux/MapAppAction';
import { LoginButton, LogoutButton } from '../UserButton';
import {
    LoginModalButton,
    LoginModalCheck,
    loginModalButtonClick,
    loginModalRemoteRequest,
} from '../../login/redux/LoginModalAction';
import { MapAppComponents } from '../redux/MapAppState';

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
        click(<LoginButton />, 'userButton');

        testDispatchedAction(mapAppShowComponent(MapAppComponents.LOGIN_MODAL));
    });

    it('should dispatch click action on login button click', () => {
        click(<LogoutButton />, 'userButton');

        testDispatchedActionsInOrder([
            mapAppShowComponent(MapAppComponents.PRODUCT_DESCRIPTION),
            mapAppResetCurrentUser(),
            loginModalButtonClick(LoginModalButton.USER_BUTTON),
            loginModalRemoteRequest(LoginModalCheck.NONE),
        ]);
    });
});
