import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordCreationForm } from '../PasswordCreationForm';
import { setUserAuthState, setUserPassword, setUserPasswordRepeat } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const store = configureTestStore();

function RenameToComponentWithStoreProvider(props: {
    userAuthState: UserAuthState;
    userPassword: string;
    userPasswordRepeat: string;
}) {
    return (
        <Provider store={store}>
            <PasswordCreationForm
                {...{
                    userAuthState: props.userAuthState,
                    setUserAuthState,
                    userPassword: props.userPassword,
                    setUserPassword,
                    userPasswordRepeat: props.userPasswordRepeat,
                    setUserPasswordRepeat,
                }}
            />
        </Provider>
    );
}

describe('PasswordCreationForm action tests', () => {
    it('should update user password when typed', () => {
        const { container } = render(
            <RenameToComponentWithStoreProvider
                userAuthState={UserAuthState.SIGNUP_PASSWORD}
                userPassword={''}
                userPasswordRepeat={''}
            />,
        );
        const userPasswordInput = getByTestId(container, 'userPassword');

        expect(userPasswordInput).toBeInTheDocument();
        fireEvent.change(userPasswordInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPassword).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update repeated user password when typed', () => {
        const { container } = render(
            <RenameToComponentWithStoreProvider
                userAuthState={UserAuthState.SIGNUP_PASSWORD}
                userPassword={''}
                userPasswordRepeat={''}
            />,
        );
        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');

        expect(userPasswordRepeatInput).toBeInTheDocument();
        fireEvent.change(userPasswordRepeatInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordRepeat).toHaveBeenCalledWith('evenBetterPassword');
    });

    it('should call password verification when next button is pressed', () => {
        const spyOnUserAuthStateFromUserPasswords = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserPasswords');

        const { container } = render(
            <RenameToComponentWithStoreProvider
                userAuthState={UserAuthState.SIGNUP_PASSWORD}
                userPassword={'passwordOne'}
                userPasswordRepeat={'PasswordTwo'}
            />,
        );

        const tryVerifyPasswordsButton = getByText(container, 'next');

        expect(tryVerifyPasswordsButton).toBeInTheDocument();
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnUserAuthStateFromUserPasswords).toHaveBeenCalledWith('passwordOne', 'PasswordTwo');
    });
});
