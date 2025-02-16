import React from 'react';
import { LogInForm } from '../LogInForm';
import {
    click,
    testDispatchedAction,
    testSnapshot,
    testValueInInput,
    type,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalButton,
    LoginModalCheck,
    LoginModalInputType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { AuthenticationStep } from '../redux/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('LogInForm snapshot test', () => {
    it('should match snapshot without error', () => {
        mockAuthenticationState({ email: 'verify@me.uk', password: 'password1' });

        testSnapshot(<LogInForm />);
    });

    it('should match snapshot with error', () => {
        mockAuthenticationState({ error: new Error('somethingIsWrong') });

        testSnapshot(<LogInForm />);
    });
});

describe('LogInForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it.each([
        [
            {
                state: { step: AuthenticationStep.LOGIN },
                userAction: () => type(<LogInForm />, 'emailInput', 'hereIsMyMail@server.com'),
                dispatched: loginModalInput(LoginModalInputType.EMAIL, 'hereIsMyMail@server.com'),
            },
        ],
    ])('should update the user email on input on password input stage', ({ state, userAction, dispatched }) => {
        mockAuthenticationState(state);

        userAction();

        testDispatchedAction(dispatched);
    });

    it('should show the already input email on password input stage', () => {
        mockAuthenticationState({ email: 'here_is_my@email.com' });

        testValueInInput(<LogInForm />, 'emailInput', 'here_is_my@email.com');
    });

    it('should update user password when typed', () => {
        type(<LogInForm />, 'passwordInput', 'strongPassword');

        testDispatchedAction(loginModalInput(LoginModalInputType.PASSWORD, 'strongPassword'));
    });

    it('should call user authentication when next button is pressed', () => {
        click(<LogInForm />, 'nextButton');

        testDispatchedAction(loginModalRemoteRequest(LoginModalCheck.NONE));
    });

    it('should transition to password reset state when reset button was clicked', () => {
        click(<LogInForm />, 'resetPasswordButton');

        testDispatchedAction(loginModalButtonClick(LoginModalButton.RESET_PASSWORD));
    });
});
