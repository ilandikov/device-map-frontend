import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { OTPInputForm } from '../OTPInputForm';
import { UserAuthState } from '../LoginModal';
import { createEvent, getNonNumeric } from '../../TestHelpers';
import { setUserAuthState } from './LoginModalTestHelpers';

function renderOTPInputComponent(
    userAuthState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP = UserAuthState.SIGNUP_OTP,
) {
    return render(<OTPInputForm {...{ userAuthState, setUserAuthState }} />);
}

describe('OTP input tests', () => {
    it.each([0, 1, 2, 3, 4, 5])('should enter numeric characters in OTP input number %i', (inputIndex) => {
        const { container } = renderOTPInputComponent();
        const input = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;
        expect(input.value).toEqual('');

        fireEvent.change(input, createEvent('1'));
        expect(input.value).toEqual('1');

        fireEvent.change(input, createEvent(getNonNumeric()));
        expect(input.value).toEqual('');
    });

    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            const { container } = renderOTPInputComponent();
            const input = getByTestId(container, `OTPInput${inputIndex}`);

            fireEvent.change(input, createEvent('1'));

            const nextInput = getByTestId(container, `OTPInput${inputIndex + 1}`);
            expect(nextInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { container } = renderOTPInputComponent();
        const input = getByTestId(container, 'OTPInput5');

        fireEvent.change(input, createEvent('1'));

        const nextButton = getByText(container, 'next');
        expect(nextButton).toHaveFocus();
    });

    it.each([0, 1, 2, 3, 4, 5])(
        'should rewrite an existing value that has already been input in OTP input number %i',
        (inputIndex) => {
            const { container } = renderOTPInputComponent();
            const input = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            fireEvent.change(input, createEvent('3'));
            expect(input.value).toEqual('3');

            input.focus();

            expect(input.value).toEqual('');
        },
    );

    it('should focus on the next empty input after a digit has been input', () => {
        const { container } = renderOTPInputComponent();
        const input0 = getByTestId(container, 'OTPInput0');
        const input1 = getByTestId(container, 'OTPInput1');
        const input2 = getByTestId(container, 'OTPInput2');
        const input3 = getByTestId(container, 'OTPInput3');
        fireEvent.change(input1, createEvent('1'));
        fireEvent.change(input2, createEvent('2'));

        fireEvent.change(input0, createEvent('1'));

        expect(input3).toHaveFocus();
    });
});

describe('OTPInputForm action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    function verifyNextButton(
        renderState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP,
        nextButtonCallingState: UserAuthState.SIGNUP_OTP_LOADING | UserAuthState.LOGIN_OTP_LOADING,
    ) {
        const { container } = renderOTPInputComponent(renderState);

        const nextButton = getByText(container, 'next');
        fireEvent.click(nextButton);

        expect(setUserAuthState).toHaveBeenCalledWith(nextButtonCallingState);
    }

    it('should transition from sign up OTP to loading OTP state', () => {
        verifyNextButton(UserAuthState.SIGNUP_OTP, UserAuthState.SIGNUP_OTP_LOADING);
    });

    it('should transition from log in OTP to loading OTP state', () => {
        verifyNextButton(UserAuthState.LOGIN_OTP, UserAuthState.LOGIN_OTP_LOADING);
    });
});
