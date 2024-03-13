import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { OTPInput, OTPInputForm } from '../OTPInputForm';
import { UserAuthState } from '../LoginModal';
import { createEvent, getNonNumeric } from '../../TestHelpers';
import { resetLoginModalMocks, setUserAuthState } from './LoginModalTestHelpers';

function renderOTPInputFormComponent(
    userAuthState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP = UserAuthState.SIGNUP_OTP,
) {
    return render(<OTPInputForm {...{ userAuthState, setUserAuthState }} />);
}

function renderOTPInputComponent() {
    return render(
        <OTPInput
            {...{
                index: 32,
                onChange: () => {},
            }}
            ref={null}
        />,
    );
}

describe('OTP input tests', () => {
    function getInput(container: HTMLElement, inputIndex: number) {
        return getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;
    }

    it('should enter numeric characters in OTP input', () => {
        const { container } = renderOTPInputComponent();
        const input = getInput(container, 32);
        expect(input.value).toEqual('');

        fireEvent.change(input, createEvent('1'));
        expect(input.value).toEqual('1');

        fireEvent.change(input, createEvent(getNonNumeric()));
        expect(input.value).toEqual('');
    });

    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            const { container } = renderOTPInputFormComponent();
            const input = getInput(container, inputIndex);

            fireEvent.change(input, createEvent('1'));

            const nextInput = getInput(container, inputIndex + 1);
            expect(nextInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { container } = renderOTPInputFormComponent();
        const input = getInput(container, 5);

        fireEvent.change(input, createEvent('1'));

        const nextButton = getByText(container, 'next');
        expect(nextButton).toHaveFocus();
    });

    it.each([0, 1, 2, 3, 4, 5])(
        'should rewrite an existing value that has already been input in OTP input number %i',
        (inputIndex) => {
            const { container } = renderOTPInputFormComponent();
            const input = getInput(container, inputIndex);

            fireEvent.change(input, createEvent('3'));
            expect(input.value).toEqual('3');

            input.focus();

            expect(input.value).toEqual('');
        },
    );

    it('should focus on the next empty input after a digit has been input', () => {
        const { container } = renderOTPInputFormComponent();
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

describe('OTPInputForm action tests', () => {
    beforeEach(() => {
        resetLoginModalMocks();
    });

    function verifyNextButton(
        renderState: UserAuthState.SIGNUP_OTP | UserAuthState.LOGIN_OTP,
        nextButtonCallingState: UserAuthState.SIGNUP_OTP_LOADING | UserAuthState.LOGIN_OTP_LOADING,
    ) {
        const { container } = renderOTPInputFormComponent(renderState);

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
