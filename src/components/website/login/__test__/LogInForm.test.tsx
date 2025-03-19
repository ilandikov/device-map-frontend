import React from 'react';
import {
    click,
    testDispatchedAction,
    type,
    verifyComponentAtAuthenticationState,
} from '../../../../../tests/utils/RenderingHelpers';
import { LogInForm } from '../LogInForm';
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
    it.each([
        {
            name: 'should be verified without error',
            authenticationState: { email: 'verify@me.uk', password: 'password1' },
        },
        {
            name: 'should be verified when error is present',
            authenticationState: { error: new Error('somethingIsWrong') },
        },
    ])('$name', ({ authenticationState }) => {
        verifyComponentAtAuthenticationState(authenticationState, <LogInForm />);
    });
});

describe('LogInForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it.each([
        {
            name: 'should update the user email on input on password input stage',
            state: { step: AuthenticationStep.LOGIN },
            userAction: () => type(<LogInForm />, 'emailInput', 'hereIsMyMail@server.com'),
            dispatched: loginModalInput(LoginModalInputType.EMAIL, 'hereIsMyMail@server.com'),
        },
        {
            name: 'should update user password when typed',
            state: {},
            userAction: () => type(<LogInForm />, 'passwordInput', 'strongPassword'),
            dispatched: loginModalInput(LoginModalInputType.PASSWORD, 'strongPassword'),
        },
        {
            name: 'should call user authentication when next button is pressed',
            state: {},
            userAction: () => click(<LogInForm />, 'nextButton'),
            dispatched: loginModalRemoteRequest(LoginModalCheck.NONE),
        },
        {
            name: 'should update user password when typed',
            state: {},
            userAction: () => click(<LogInForm />, 'resetPasswordButton'),
            dispatched: loginModalButtonClick(LoginModalButton.RESET_PASSWORD),
        },
    ])('$name', ({ state, userAction, dispatched }) => {
        mockAuthenticationState(state);

        userAction();

        testDispatchedAction(dispatched);
    });
});
