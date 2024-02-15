import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordCreationForm } from '../PasswordCreationForm';
import { mockLoginModalHooks } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const { setUserAuthState, setUserPassword, setUserPasswordRepeat } = mockLoginModalHooks();

const store = configureTestStore();

function componentWithStoreProvider(
    userAuthState: UserAuthState,
    userEmail: string,
    userPassword: string,
    userPasswordRepeat: string,
) {
    return render(
        <Provider store={store}>
            <PasswordCreationForm
                {...{
                    userAuthState,
                    setUserAuthState,
                    userPassword,
                    setUserPassword,
                    userPasswordRepeat,
                    setUserPasswordRepeat,
                }}
            />
        </Provider>,
    );
}

describe('PasswordCreationForm action tests', () => {
    it('should update user password when typed', () => {
        const { container } = componentWithStoreProvider(UserAuthState.PASSWORD_CREATION, '', '', '');
        const userPasswordInput = getByTestId(container, 'userPassword');

        expect(userPasswordInput).toBeInTheDocument();
        fireEvent.change(userPasswordInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPassword).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update repeated user password when typed', () => {
        const { container } = componentWithStoreProvider(UserAuthState.PASSWORD_CREATION, '', '', '');
        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');

        expect(userPasswordRepeatInput).toBeInTheDocument();
        fireEvent.change(userPasswordRepeatInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordRepeat).toHaveBeenCalledWith('evenBetterPassword');
    });

    it('should call password verification when next button is pressed', () => {
        const spyOnUserAuthStateFromUserPasswords = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserPasswords');

        const { container } = componentWithStoreProvider(
            UserAuthState.PASSWORD_CREATION,
            '',
            'passwordOne',
            'PasswordTwo',
        );

        const tryVerifyPasswordsButton = getByText(container, 'next');

        expect(tryVerifyPasswordsButton).toBeInTheDocument();
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnUserAuthStateFromUserPasswords).toHaveBeenCalledWith('passwordOne', 'PasswordTwo');
    });
});
