import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { OTPInputForm } from '../OTPInputForm';
import { UserAuthState } from '../LoginModal';
import { setUserAuthState } from './LoginModalTestHelpers';

function renderOTPInputComponent(
    userAuthState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP = UserAuthState.SIGNUP_OTP,
) {
    return render(<OTPInputForm {...{ userAuthState, setUserAuthState }} />);
}

function createEvent(value: any) {
    return { target: { value: `${value}` } };
}

function getNonNumeric() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:',.<>/?`~";
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
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
            const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            expect(OTPInput).toBeInTheDocument();
            OTPInput.focus();
            fireEvent.change(OTPInput, { target: { value: '1' } });

            const nextOTPInput = getByTestId(container, `OTPInput${inputIndex + 1}`) as HTMLInputElement;
            expect(nextOTPInput).toBeInTheDocument();
            expect(nextOTPInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { container } = renderOTPInputComponent();
        const OTPInput = getByTestId(container, 'OTPInput5') as HTMLInputElement;

        expect(OTPInput).toBeInTheDocument();
        OTPInput.focus();
        fireEvent.change(OTPInput, { target: { value: '1' } });

        const nextButton = getByText(container, 'next');

        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toHaveFocus();
    });

    it.each([0, 1, 2, 3, 4, 5])(
        'should rewrite an existing value that has already been input in OTP input number %i',
        (inputIndex) => {
            const { container } = renderOTPInputComponent();
            const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            expect(OTPInput).toBeInTheDocument();
            fireEvent.change(OTPInput, { target: { value: '3' } });
            expect(OTPInput.value).toEqual('3');

            OTPInput.focus();
            expect(OTPInput.value).toEqual('');
        },
    );

    it('should focus on the next empty input after a digit has been input', () => {
        const { container } = renderOTPInputComponent();
        const OTPInput0 = getByTestId(container, 'OTPInput0') as HTMLInputElement;
        const OTPInput1 = getByTestId(container, 'OTPInput1') as HTMLInputElement;
        const OTPInput2 = getByTestId(container, 'OTPInput2') as HTMLInputElement;
        const OTPInput3 = getByTestId(container, 'OTPInput3') as HTMLInputElement;
        fireEvent.change(OTPInput1, { target: { value: '1' } });
        fireEvent.change(OTPInput2, { target: { value: '2' } });

        OTPInput0.focus();
        fireEvent.change(OTPInput0, { target: { value: '1' } });

        expect(OTPInput3).toHaveFocus();
    });
});

describe('OTPInputForm action tests', () => {
    it('should transition from sign up OTP to loading OTP state', () => {
        const { container } = renderOTPInputComponent(UserAuthState.SIGNUP_OTP);

        const nextButton = getByText(container, 'next');
        expect(nextButton).toBeInTheDocument();

        fireEvent.click(nextButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.SIGNUP_OTP_LOADING);
    });

    it('should transition from log in OTP to loading OTP state', () => {
        const { container } = renderOTPInputComponent(UserAuthState.LOGIN_OTP);

        const nextButton = getByText(container, 'next');
        expect(nextButton).toBeInTheDocument();

        fireEvent.click(nextButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.LOGIN_OTP_LOADING);
    });
});
