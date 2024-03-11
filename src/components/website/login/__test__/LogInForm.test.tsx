import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { UserAuthState } from '../LoginModal';
import { LogInForm } from '../LogInForm';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { setUserAuthState, setUserEmail, setUserPassword } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const store = configureTestStore();

function componentWithStoreProvider(
    userAuthState: UserAuthState,
    userEmail: string,
    userPassword: string,
    userPasswordRepeat: string,
) {
    return render(
        <Provider store={store}>
            <LogInForm
                {...{
                    userAuthState,
                    setUserAuthState,
                    userEmail,
                    setUserEmail,
                    userPassword,
                    setUserPassword,
                    userPasswordRepeat,
                }}
            />
        </Provider>,
    );
}

describe('LogInForm action tests', () => {
    it('should update the user email on input on password input stage', () => {
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, '', '', '');

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, { target: { value: 'hereIsMyMail@server.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('hereIsMyMail@server.com');
    });

    it('should show the already input email on password input stage', () => {
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, 'here_is_my@email.com', '', '');

        const emailInput = getByTestId(container, 'emailInput') as HTMLInputElement;

        expect(emailInput.value).toEqual('here_is_my@email.com');
    });

    it('should update user password when typed', () => {
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, 'user@email.com', '', '');

        const userPasswordInput = getByTestId(container, 'userPasswordLogin');
        fireEvent.change(userPasswordInput, { target: { value: 'strongPassword' } });

        expect(setUserPassword).toHaveBeenCalledWith('strongPassword');
    });

    it('should call user authentication when next button is pressed', () => {
        const spyOnUserAuthStateFromUserLogin = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserLogin');
        const { container } = componentWithStoreProvider(
            UserAuthState.SIGNUP_PASSWORD,
            'user@mail.com',
            'aPassword',
            '',
        );

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnUserAuthStateFromUserLogin).toHaveBeenCalledWith('user@mail.com', 'aPassword');
    });

    it('should transition to password reset state when reset button was clicked', () => {
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, 'user@email.com', '', '');

        const resetPasswordButton = getByText(container, 'resetPassword');
        fireEvent.click(resetPasswordButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.LOGIN_PASSWORD_RESET);
    });
});
