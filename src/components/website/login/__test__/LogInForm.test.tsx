import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { LogInForm } from '../LogInForm';
import {
    createEvent,
    renderForActionDispatchTest,
    renderForSnapshotTest,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { AuthenticationStep } from '../redux/AuthenticationState';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('LogInForm snapshot test', () => {
    it('should match snapshot without error', () => {
        mockAuthenticationState({ email: 'verify@me.uk' });
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
        const container = renderForActionDispatchTest(<LogInForm />);

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, createEvent('hereIsMyMail@server.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputType.EMAIL, 'hereIsMyMail@server.com'),
        );
    });

    it('should show the already input email on password input stage', () => {
        mockAuthenticationState({ email: 'here_is_my@email.com' });
        const container = renderForActionDispatchTest(<LogInForm />);

        const emailInput = getByTestId(container, 'emailInput') as HTMLInputElement;
        expect(emailInput.value).toEqual('here_is_my@email.com');
    });

    it('should update user password when typed', () => {
        const container = renderForActionDispatchTest(<LogInForm />);

        const userPasswordInput = getByTestId(container, 'userPasswordLogin');
        fireEvent.change(userPasswordInput, createEvent('strongPassword'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputType.PASSWORD, 'strongPassword'),
        );
    });

    it('should call user authentication when next button is pressed', () => {
        const container = renderForActionDispatchTest(<LogInForm />);

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME_AND_PASSWORD),
        );
    });

    it('should transition to password reset state when reset button was clicked', () => {
        const container = renderForActionDispatchTest(<LogInForm />);

        const resetPasswordButton = getByText(container, 'resetPassword');
        fireEvent.click(resetPasswordButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('resetPassword'));
    });
});
