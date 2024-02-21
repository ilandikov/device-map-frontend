import { fireEvent, getByTestId, getByText, render, renderHook } from '@testing-library/react';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { MailInputError } from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { MailInputForm } from '../MailInputForm';
import { renderAsJSON, setUserAuthState, setUserEmail } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const store = configureTestStore();

function componentWithStoreProvider(userEmail: string) {
    return (
        <Provider store={store}>
            <MailInputForm
                {...{
                    setUserAuthState,
                    userEmail,
                    setUserEmail,
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

let setMailInputError: jest.Mock;

function mockMailInputErrorUseState(initialMailInputError: Error | null) {
    (useState as jest.Mock).mockReturnValueOnce([initialMailInputError, setMailInputError]);
}

function resetHookMock() {
    setMailInputError = jest.fn().mockImplementation((error) => error);
}

describe('MailInputForm snapshot tests', () => {
    beforeEach(() => {
        resetHookMock();
    });

    it('should match the snapshot at mail input stage', () => {
        mockMailInputErrorUseState(null);
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists stage', () => {
        mockMailInputErrorUseState(new Error(MailInputError.ALREADY_EXISTS));
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid stage', () => {
        mockMailInputErrorUseState(new Error(MailInputError.NOT_VALID));
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        resetHookMock();
    });

    it('should call email setter from email input', () => {
        mockMailInputErrorUseState(null);
        const { container } = render(componentWithStoreProvider(''));

        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput, { target: { value: 'new@email.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        const spyOnUserAuthStateFromUserEmail = jest.spyOn(userAuthStateUtils, 'getUserEmailError');

        mockMailInputErrorUseState(null);
        const { container } = render(componentWithStoreProvider('new@email.com'));

        const tryVerifyEmailButton = getByText(container, 'next');

        expect(tryVerifyEmailButton).toBeInTheDocument();
        fireEvent.click(tryVerifyEmailButton);

        expect(spyOnUserAuthStateFromUserEmail).toHaveBeenCalledWith('new@email.com');
        expect(setMailInputError).toHaveBeenCalledTimes(1);
        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.SIGNUP_PASSWORD);
    });

    it('should move from mail already exists to password verification stage', () => {
        mockMailInputErrorUseState(new Error(MailInputError.ALREADY_EXISTS));
        const { container } = render(componentWithStoreProvider(''));
        const loginButton = getByText(container, 'accountLogin');

        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.LOGIN);
    });
});

function myHook() {
    return;
}

describe('Custom hook test', () => {
    it('rename me too', () => {
        const { rerender } = renderHook(() => myHook());

        expect(rerender).toBeTruthy();
    });
});
