import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { MailInputError, UserAuthState } from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { MailInputForm } from '../MailInputForm';
import { createEvent } from '../../TestHelpers';
import { renderAsJSON, resetLoginModalMocks, setUserAuthState, setUserEmail } from './LoginModalTestHelpers';

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

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('MailInputForm snapshot tests', () => {
    beforeEach(() => {
        resetHookMock();
    });

    it('should match the snapshot without error', () => {
        mockMailInputErrorUseState(null);
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists error', () => {
        mockMailInputErrorUseState(new Error(MailInputError.ALREADY_EXISTS));
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid error', () => {
        mockMailInputErrorUseState(new Error(MailInputError.NOT_VALID));
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        resetHookMock();
        resetLoginModalMocks();
        mockDispatch.mockReset();
    });

    it('should call email setter from email input', () => {
        mockMailInputErrorUseState(null);
        const { container } = render(componentWithStoreProvider(''));

        const emailInput = getByTestId(container, 'emailInput');

        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(setUserEmail).toHaveBeenNthCalledWith(1, 'new@email.com');
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'userEmailInput', userEmail: 'new@email.com' });
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        const spyOnGetUserEmailError = jest.spyOn(userAuthStateUtils, 'getUserEmailErrorAndNextState');

        mockMailInputErrorUseState(null);
        const { container } = render(componentWithStoreProvider('new@email.com'));

        const tryVerifyEmailButton = getByText(container, 'next');

        fireEvent.click(tryVerifyEmailButton);

        expect(spyOnGetUserEmailError).toHaveBeenNthCalledWith(1, 'new@email.com');
        expect(setMailInputError).toHaveBeenCalledTimes(1);
        expect(setUserAuthState).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'requestVerifyUserEmail' });
    });

    it('should move from mail already exists to password verification stage', () => {
        mockMailInputErrorUseState(new Error(MailInputError.ALREADY_EXISTS));
        const { container } = render(componentWithStoreProvider(''));
        const loginButton = getByText(container, 'accountLogin');

        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, UserAuthState.LOGIN);
    });
});
