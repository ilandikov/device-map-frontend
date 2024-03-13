import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createEvent, getNonNumeric } from '../../TestHelpers';
import { OTPInput } from '../OTPInput';
import { getInput } from './OTPForm.test';

function renderOTPInput() {
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
    it('should enter numeric characters in OTP input', () => {
        const { container } = renderOTPInput();
        const input = getInput(container, 32);
        expect(input.value).toEqual('');

        fireEvent.change(input, createEvent('1'));
        expect(input.value).toEqual('1');

        fireEvent.change(input, createEvent(getNonNumeric()));
        expect(input.value).toEqual('');
    });

    it('should rewrite an existing value that has already been input in OTP input', () => {
        const { container } = renderOTPInput();
        const input = getInput(container, 32);

        fireEvent.change(input, createEvent('3'));
        expect(input.value).toEqual('3');

        input.focus();

        expect(input.value).toEqual('');
    });
});
