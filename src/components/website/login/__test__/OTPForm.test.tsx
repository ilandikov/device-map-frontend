import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { OTPForm } from '../OTPForm';
import {
    click,
    createEvent,
    getNonNumeric,
    renderForActionDispatchTest,
    testDispatchedAction,
    testDispatchedActionsInOrder,
    testSnapshot,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalCheck,
    LoginModalInputType,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { AuthenticationStep } from '../redux/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

function getInput(container: HTMLElement, inputIndex: number) {
    return getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;
}

describe('OTPForm snapshot tests', () => {
    it('should match snapshot at OTP for user creation step without error', () => {
        mockAuthenticationState({ step: AuthenticationStep.PASSWORD_CREATION_OTP, error: null });

        testSnapshot(<OTPForm />);
    });

    it('should match snapshot at OTP for password reset step with error', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
            error: new Error('thisShouldNotHappen'),
        });

        testSnapshot(<OTPForm />);
    });
});

function testTypeDigitAndExpectValue(input: HTMLInputElement, typed: string, expected: string) {
    fireEvent.change(input, createEvent(typed));
    expect(input.value).toEqual(expected);
}

function renderOTPFormAndGetInputs() {
    const container = renderForActionDispatchTest(<OTPForm />);
    const inputs = [0, 1, 2, 3, 4, 5].map((inputIndex) => {
        return getInput(container, inputIndex);
    });
    const nextButton = getByTestId(container, 'nextButton');
    return { inputs, nextButton };
}

describe('OTP input elements individual tests', () => {
    it.each([0, 1, 2, 3, 4, 5])('should enter numeric characters in OTP input number %i', (inputIndex) => {
        const { inputs } = renderOTPFormAndGetInputs();
        const input = inputs[inputIndex];

        testTypeDigitAndExpectValue(input, '1', '1');

        testTypeDigitAndExpectValue(input, getNonNumeric(), '');
    });

    it.each([0, 1, 2, 3, 4, 5])(
        'should rewrite an existing value that has already been input in OTP input number %i',
        (inputIndex) => {
            const { inputs } = renderOTPFormAndGetInputs();
            const input = inputs[inputIndex];

            testTypeDigitAndExpectValue(input, '3', '3');

            input.focus();

            expect(input.value).toEqual('');
        },
    );
});

describe('OTP form tests', () => {
    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            const { inputs } = renderOTPFormAndGetInputs();
            const input = inputs[inputIndex];
            const nextInput = inputs[inputIndex + 1];

            fireEvent.change(input, createEvent('1'));

            expect(nextInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { inputs, nextButton } = renderOTPFormAndGetInputs();

        testTypeDigitAndExpectValue(inputs[5], '1', '1');

        expect(nextButton).toHaveFocus();
    });

    it('should focus on the next empty input after a digit has been input', () => {
        const container = renderForActionDispatchTest(<OTPForm />);
        const input0 = getInput(container, 0);
        const input1 = getInput(container, 1);
        const input2 = getInput(container, 2);
        const input3 = getInput(container, 3);
        fireEvent.change(input2, createEvent('2'));
        fireEvent.change(input1, createEvent('1'));

        fireEvent.change(input0, createEvent('1'));
        expect(input3).toHaveFocus();
    });
});

describe('OTP form paste tests', () => {
    it('should dispatch 3 digit value over 3 inputs', () => {
        mockAuthenticationState({});
        const container = renderForActionDispatchTest(<OTPForm />);

        const input0 = getInput(container, 0);
        const input1 = getInput(container, 1);
        const input2 = getInput(container, 2);
        const input3 = getInput(container, 3);
        fireEvent.change(input0, createEvent('649'));

        expect(input0.value).toEqual('6');
        expect(input1.value).toEqual('4');
        expect(input2.value).toEqual('9');
        expect(input3).toHaveFocus();
    });

    it('should not overflow the inputs and focus on the button', () => {
        mockAuthenticationState({});
        const container = renderForActionDispatchTest(<OTPForm />);

        const input3 = getInput(container, 3);
        const input4 = getInput(container, 4);
        const input5 = getInput(container, 5);
        const nextButton = getByText(container, 'next');
        fireEvent.change(input3, createEvent('0574'));

        expect(input3.value).toEqual('0');
        expect(input4.value).toEqual('5');
        expect(input5.value).toEqual('7');

        expect(nextButton).toHaveFocus();
    });

    it('should not input anything if input contains a non numerical character', () => {
        mockAuthenticationState({});
        const container = renderForActionDispatchTest(<OTPForm />);

        const input2 = getInput(container, 2);
        const input3 = getInput(container, 3);
        const input4 = getInput(container, 4);
        input2.focus();
        fireEvent.change(input2, createEvent('3e4'));

        expect(input2.value).toEqual('');
        expect(input3.value).toEqual('');
        expect(input4.value).toEqual('');

        expect(input2).toHaveFocus();
    });

    it('should overwrite existing values in multiple inputs', () => {
        mockAuthenticationState({});
        const container = renderForActionDispatchTest(<OTPForm />);

        const input1 = getInput(container, 1);
        const input2 = getInput(container, 2);
        const input3 = getInput(container, 3);
        const input4 = getInput(container, 4);
        const input5 = getInput(container, 5);

        fireEvent.change(input1, createEvent('6103'));
        fireEvent.change(input1, createEvent('974'));

        expect(input1.value).toEqual('9');
        expect(input2.value).toEqual('7');
        expect(input3.value).toEqual('4');
        expect(input4.value).toEqual('3');

        expect(input5).toHaveFocus();
    });
});

function inputOTPDigit(container: HTMLElement, inputIndex: number, OTPDigit: string) {
    const input0 = getInput(container, inputIndex);
    fireEvent.change(input0, createEvent(OTPDigit));
}

describe('OTP form action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should send OTP code and verification request on next button click', () => {
        const container = renderForActionDispatchTest(<OTPForm />);

        inputOTPDigit(container, 0, '2');
        inputOTPDigit(container, 1, '0');
        inputOTPDigit(container, 2, '8');
        inputOTPDigit(container, 3, '4');
        inputOTPDigit(container, 4, '7');
        inputOTPDigit(container, 5, '3');

        const nextButton = getByTestId(container, 'nextButton');
        fireEvent.click(nextButton);

        testDispatchedActionsInOrder([
            loginModalInput(LoginModalInputType.OTP, '208473'),
            loginModalRemoteRequest(LoginModalCheck.OTP),
        ]);
    });

    it('should request the OTP code again on resend OTP button click', () => {
        click(<OTPForm />, 'sendOTPAgainButton');

        testDispatchedAction(loginModalRemoteRequest(LoginModalCheck.NONE));
    });
});
