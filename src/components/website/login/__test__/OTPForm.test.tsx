import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { OTPForm } from '../OTPForm';
import { UserAuthState } from '../LoginModal';
import { createEvent } from '../../TestHelpers';
import { resetLoginModalMocks, setUserAuthState } from './LoginModalTestHelpers';

function renderOTPForm(userAuthState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP = UserAuthState.SIGNUP_OTP) {
    return render(<OTPForm {...{ userAuthState, setUserAuthState }} />);
}

export function getInput(container: HTMLElement, inputIndex: number) {
    return getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;
}

describe('OTP form tests', () => {
    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            const { container } = renderOTPForm();
            const input = getInput(container, inputIndex);

            fireEvent.change(input, createEvent('1'));

            const nextInput = getInput(container, inputIndex + 1);
            expect(nextInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { container } = renderOTPForm();
        const input = getInput(container, 5);

        fireEvent.change(input, createEvent('1'));

        const nextButton = getByText(container, 'next');
        expect(nextButton).toHaveFocus();
    });

    it('should focus on the next empty input after a digit has been input', () => {
        const { container } = renderOTPForm();
        const input0 = getInput(container, 0);
        const input1 = getInput(container, 1);
        const input2 = getInput(container, 2);
        const input3 = getInput(container, 3);
        fireEvent.change(input1, createEvent('1'));
        fireEvent.change(input2, createEvent('2'));

        fireEvent.change(input0, createEvent('1'));

        expect(input3).toHaveFocus();
    });
});

describe('OTP form action tests', () => {
    beforeEach(() => {
        resetLoginModalMocks();
    });

    function verifyNextButton(
        renderState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP,
        nextButtonCallingState: UserAuthState.SIGNUP_OTP_LOADING | UserAuthState.LOGIN_OTP_LOADING,
    ) {
        const { container } = renderOTPForm(renderState);

        const nextButton = getByText(container, 'next');
        fireEvent.click(nextButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, nextButtonCallingState);
    }

    it('should transition from sign up OTP to loading OTP state', () => {
        verifyNextButton(UserAuthState.SIGNUP_OTP, UserAuthState.SIGNUP_OTP_LOADING);
    });

    it('should transition from log in OTP to loading OTP state', () => {
        verifyNextButton(UserAuthState.LOGIN_OTP, UserAuthState.LOGIN_OTP_LOADING);
    });
});
