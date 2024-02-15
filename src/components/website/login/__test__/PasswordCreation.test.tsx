import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { LoginModal, UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

let setUserAuthState: jest.Mock;
let setUserEmail: jest.Mock;
let setUserPassword: jest.Mock;
let setUserPasswordRepeat: jest.Mock;
function mockUseUserAuthState(
    initialUserAuthState: UserAuthState,
    initialUserEmail: string = '',
    userPassword: string = '',
    userPasswordRepeat: string = '',
) {
    setUserAuthState = jest.fn();
    setUserAuthState.mockImplementation((userAuthState) => userAuthState);
    setUserEmail = jest.fn();
    setUserEmail.mockImplementation((userEmail) => userEmail);
    setUserPassword = jest.fn();
    setUserPassword.mockImplementation((userEmail) => userEmail);
    setUserPasswordRepeat = jest.fn();
    setUserPasswordRepeat.mockImplementation((userEmail) => userEmail);
    React.useState = jest
        .fn()
        .mockImplementationOnce(() => [initialUserAuthState, setUserAuthState])
        .mockImplementationOnce(() => [initialUserEmail, setUserEmail])
        .mockImplementationOnce(() => [userPassword, setUserPassword])
        .mockImplementationOnce(() => [userPasswordRepeat, setUserPasswordRepeat]);
}

const store = configureTestStore();

const componentWithStoreProvider = (
    <Provider store={store}>
        <LoginModal />
    </Provider>
);

describe('LoginModal action tests - password creation stages', () => {
    it('should update user password when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION);
        const { container } = render(componentWithStoreProvider);
        const userPasswordInput = getByTestId(container, 'userPassword');

        expect(userPasswordInput).toBeInTheDocument();
        fireEvent.change(userPasswordInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPassword).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update repeated user password when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION);
        const { container } = render(componentWithStoreProvider);
        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');

        expect(userPasswordRepeatInput).toBeInTheDocument();
        fireEvent.change(userPasswordRepeatInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordRepeat).toHaveBeenCalledWith('evenBetterPassword');
    });

    it('should call password verification when next button is pressed', () => {
        const spyOnUserAuthStateFromUserPasswords = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserPasswords');

        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '', 'passwordOne', 'PasswordTwo');
        const { container } = render(componentWithStoreProvider);

        const tryVerifyPasswordsButton = getByText(container, 'next');

        expect(tryVerifyPasswordsButton).toBeInTheDocument();
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnUserAuthStateFromUserPasswords).toHaveBeenCalledWith('passwordOne', 'PasswordTwo');
    });
});
