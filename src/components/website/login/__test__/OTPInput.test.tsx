import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { OTPInput } from '../OTPInput';

// TODO when OTP input will incorporate the button section, there should be no need to mock this
jest.spyOn(React, 'useRef').mockReturnValue({
    current: {
        focus: jest.fn(),
    },
});

const mockNextButton = React.useRef();

const OTPInputComponent = (
    <OTPInput
        nextButton={mockNextButton}
        setUserAuthState={() => {
            return;
        }}
    />
);

describe('OTP input tests', () => {
    it.each([0, 1, 2, 3, 4, 5])('should enter numeric characters in OTP input number %i', (inputIndex) => {
        const { container } = render(OTPInputComponent);
        const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

        expect(OTPInput).toBeInTheDocument();
        fireEvent.change(OTPInput, { target: { value: `${inputIndex}` } });

        expect(OTPInput.value).toEqual(`${inputIndex}`);
    });

    it.each([0, 1, 2, 3, 4, 5])('should not enter non numeric characters in OTP input number %i', (inputIndex) => {
        const { container } = render(OTPInputComponent);
        const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

        expect(OTPInput).toBeInTheDocument();
        fireEvent.change(OTPInput, { target: { value: 'a' } });

        expect(OTPInput.value).toEqual('');
    });

    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            const { container } = render(OTPInputComponent);
            const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            expect(OTPInput).toBeInTheDocument();
            OTPInput.focus();
            fireEvent.change(OTPInput, { target: { value: '1' } });

            const nextOTPInput = getByTestId(container, `OTPInput${inputIndex + 1}`) as HTMLInputElement;
            expect(nextOTPInput).toBeInTheDocument();
            expect(nextOTPInput).toHaveFocus();
        },
    );

    it.failing('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        const { container } = render(OTPInputComponent);
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
            const { container } = render(OTPInputComponent);
            const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            expect(OTPInput).toBeInTheDocument();
            fireEvent.change(OTPInput, { target: { value: '3' } });
            expect(OTPInput.value).toEqual('3');

            OTPInput.focus();
            expect(OTPInput.value).toEqual('');
        },
    );

    it('should focus on the next empty input after a digit has been input', () => {
        const { container } = render(OTPInputComponent);
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
