import { fireEvent, getByTestId, getByText, render, renderHook } from '@testing-library/react';
import React, { useEffect, useRef, useState } from 'react';
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

function myHook(props: { callBack: () => void; error: Error | null }) {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current === false) {
            hasMounted.current = true;
            return;
        }

        if (props.error) {
            return;
        }

        props.callBack();
    });
}

describe('Custom hook test', () => {
    const callBack = jest.fn();

    afterEach(() => {
        callBack.mockReset();
    });

    it('should not call callback after the first render', () => {
        renderHook(() => myHook({ callBack, error: null }));

        expect(callBack).toHaveBeenCalledTimes(0);
    });

    function getArrayOfRandomLength() {
        const max = 100;
        const min = 10;
        const arrayLength = Math.floor(Math.random() * max + min);
        return Array.from({ length: arrayLength }, (_, i) => i + 1);
    }

    it('should call callback after any number of rerenders if there was no error', () => {
        const noError = null;
        const { rerender } = renderHook(() => myHook({ callBack, error: noError }));

        const randomNumberOfTimes = getArrayOfRandomLength();
        randomNumberOfTimes.forEach((i) => {
            rerender();
        });

        expect(callBack).toHaveBeenCalledTimes(randomNumberOfTimes.length);
    });

    it('should not call callback if error is present', () => {
        const error = new Error('oops');
        const { rerender } = renderHook((props) => myHook(props), { initialProps: { callBack, error } });

        const randomNumberOfTimes = getArrayOfRandomLength();
        randomNumberOfTimes.forEach((errorNumber) => {
            rerender({ callBack, error: new Error('Error number ' + errorNumber.toString()) });
        });

        expect(callBack).not.toHaveBeenCalled();
    });
});
