import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordCreationForm } from '../PasswordCreationForm';
import { renderAsJSON, setUserAuthState, setUserPassword, setUserPasswordRepeat } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const store = configureTestStore();

function componentWithStoreProvider(props: { userPassword: string; userPasswordRepeat: string }) {
    return (
        <Provider store={store}>
            <PasswordCreationForm
                {...{
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

jest.mock('react', () => {
    const originalModule = jest.requireActual('react');
    return {
        ...originalModule,
        useState: jest.fn(),
    };
});

let setPasswordInputError: jest.Mock;

function mockPasswordInputErrorUseState(initialMailInputError: Error | null) {
    (useState as jest.Mock).mockReturnValueOnce([initialMailInputError, setPasswordInputError]);
}

function resetHookMock() {
    setPasswordInputError = jest.fn().mockImplementation((error) => error);
}

describe('PasswordCreationForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockPasswordInputErrorUseState(null);
        const component = renderAsJSON(
            componentWithStoreProvider({
                userPassword: '',
                userPasswordRepeat: '',
            }),
        );

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match error', () => {
        mockPasswordInputErrorUseState(new Error());
        const component = renderAsJSON(
            componentWithStoreProvider({
                userPassword: '',
                userPasswordRepeat: '',
            }),
        );

        expect(component).toMatchSnapshot();
    });
});

describe('PasswordCreationForm action tests', () => {
    beforeEach(() => {
        resetHookMock();
    });

    it('should update user password when typed', () => {
        mockPasswordInputErrorUseState(null);
        const { container } = render(
            componentWithStoreProvider({
                userPassword: '',
                userPasswordRepeat: '',
            }),
        );

        const userPasswordInput = getByTestId(container, 'userPassword');
        fireEvent.change(userPasswordInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPassword).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update repeated user password when typed', () => {
        mockPasswordInputErrorUseState(null);
        const { container } = render(
            componentWithStoreProvider({
                userPassword: '',
                userPasswordRepeat: '',
            }),
        );

        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');
        fireEvent.change(userPasswordRepeatInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordRepeat).toHaveBeenCalledWith('evenBetterPassword');
    });

    it('should call password verification when next button is pressed', () => {
        const spyOnGetPasswordInputError = jest.spyOn(userAuthStateUtils, 'getPasswordInputErrorAndNextState');
        mockPasswordInputErrorUseState(null);
        const { container } = render(
            componentWithStoreProvider({
                userPassword: 'passwordOne',
                userPasswordRepeat: 'PasswordTwo',
            }),
        );

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnGetPasswordInputError).toHaveBeenCalledWith('passwordOne', 'PasswordTwo');
        expect(setPasswordInputError).toHaveBeenCalledTimes(1);
        expect(setUserAuthState).toHaveBeenCalledTimes(1);
    });
});
