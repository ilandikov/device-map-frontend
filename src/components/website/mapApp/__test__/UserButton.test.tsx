import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
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
import { AllActions } from '../../../../redux/store';

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

function clickButton(container: HTMLElement, buttonTestId: string) {
    const button = getByTestId(container, buttonTestId);
    fireEvent.click(button);
}

function testDispatchedActionsInOrder(expectedActions: AllActions[]) {
    expectedActions.forEach((action, index) => {
        expect(mockDispatch).toHaveBeenNthCalledWith(index + 1, action);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(expectedActions.length);
}

describe('UserButton action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<LoginButton />);

        const loginButton = getByTestId(container, 'userButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppShowComponent(MapAppComponents.LOGIN_MODAL));
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<LogoutButton />);

        clickButton(container, 'userButton');

        testDispatchedActionsInOrder([
            mapAppShowComponent(MapAppComponents.PRODUCT_DESCRIPTION),
            mapAppResetCurrentUser(),
            loginModalButtonClick(LoginModalButton.USER_BUTTON),
            loginModalRemoteRequest(LoginModalCheck.NONE),
        ]);
    });
});
