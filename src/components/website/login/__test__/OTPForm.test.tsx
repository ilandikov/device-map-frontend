import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { OTPForm } from '../OTPForm';
import {
    createEvent,
    getNonNumeric,
    renderForActionDispatchTest,
    renderForSnapshotTest,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalInput,
    loginModalVerifyRequest,
} from '../redux/actions';
import { mockDispatch } from '../redux/__mocks__/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

function getInput(container: HTMLElement, inputIndex: number) {
    return getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;
}

describe('OTPForm snapshot tests', () => {
    it('should match snapshot', () => {
        const component = renderForSnapshotTest(<OTPForm />);

        expect(component).toMatchSnapshot();
    });
});

describe('OTP input elements individual tests', () => {
    it.each([0, 1, 2, 3, 4, 5])('should enter numeric characters in OTP input number %i', (inputIndex) => {
        const { container } = render(<OTPForm />);
        const input = getInput(container, inputIndex);
        expect(input.value).toEqual('');

        fireEvent.change(input, createEvent('1'));
        expect(input.value).toEqual('1');

        fireEvent.change(input, createEvent(getNonNumeric()));
        expect(input.value).toEqual('');
    });

    it.each([0, 1, 2, 3, 4, 5])(
        'should rewrite an existing value that has already been input in OTP input number %i',
        (inputIndex) => {
            const { container } = render(<OTPForm />);
            const input = getInput(container, inputIndex);

            fireEvent.change(input, createEvent('3'));
            expect(input.value).toEqual('3');

            input.focus();

            expect(input.value).toEqual('');
        },
    );
});

describe('OTP form tests', () => {
    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            const { container } = render(<OTPForm />);

            const input = getInput(container, inputIndex);
            fireEvent.change(input, createEvent('1'));

            const nextInput = getInput(container, inputIndex + 1);
            expect(nextInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { container } = render(<OTPForm />);

        const input = getInput(container, 5);
        fireEvent.change(input, createEvent('1'));

        const nextButton = getByText(container, 'next');
        expect(nextButton).toHaveFocus();
    });

    it('should focus on the next empty input after a digit has been input', () => {
        const { container } = render(<OTPForm />);
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

function inputOTPDigit(container: HTMLElement, inputIndex: number, OTPDigit: string) {
    const input0 = getInput(container, inputIndex);
    fireEvent.change(input0, createEvent(OTPDigit));
}

describe('OTP form action tests', () => {
    it('should send OTP code and verification request on next button click', () => {
        const container = renderForActionDispatchTest(<OTPForm />);

        inputOTPDigit(container, 0, '2');

        const nextButton = getByText(container, 'next');
        fireEvent.click(nextButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalInput(LoginModalInputTypes.OTP, '2'));
        expect(mockDispatch).toHaveBeenNthCalledWith(2, loginModalVerifyRequest(LoginModalVerifyTypes.OTP));
    });
});
