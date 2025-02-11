import React from 'react';
import { LogInForm } from '../LogInForm';
import {
    click,
    renderForSnapshotTest,
    testDispatchedAction,
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
        const component = renderForSnapshotTest(<LogInForm />);
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
        mockAuthenticationState({ error: new Error('somethingIsWrong') });
        const component = renderForSnapshotTest(<LogInForm />);
        expect(component).toMatchSnapshot();
    });
});

describe('LogInForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update the user email on input on password input stage', () => {
        mockAuthenticationState({ step: AuthenticationStep.LOGIN });

        type(<LogInForm />, 'emailInput', 'hereIsMyMail@server.com');

        testDispatchedAction(loginModalInput(LoginModalInputType.EMAIL, 'hereIsMyMail@server.com'));
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
