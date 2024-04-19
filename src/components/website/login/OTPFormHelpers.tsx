import React from 'react';

export function collectOTPValue(inputRefs: React.MutableRefObject<HTMLInputElement>[]): string {
    let OTPCode = '';
    inputRefs.forEach((input) => {
        OTPCode += input.current.value;
    });
    return OTPCode;
}

export function isOTPInputEventValid(event: React.ChangeEvent<HTMLInputElement>): boolean {
    const oneToSixDigitsRegExp = /^\d{1,6}$/;
    return oneToSixDigitsRegExp.test(event.target.value.slice(0, 6));
}

export function fillInputsFromInputEvent(
    event: React.ChangeEvent<HTMLInputElement>,
    startInputIndex: number,
    inputElementRefs: React.MutableRefObject<HTMLInputElement>[],
): void {
    const inputCharArray = Array.from(event.target.value);
    for (const [inputCharIndex, inputChar] of inputCharArray.entries()) {
        const currentInputIndex = startInputIndex + inputCharIndex;
        if (currentInputIndex === inputElementRefs.length) {
            break;
        }

        inputElementRefs[currentInputIndex].current.value = inputChar;
    }
}

export function focusOnNextInputOrNextButton(
    startInputIndex: number,
    inputRefs: React.MutableRefObject<HTMLInputElement>[],
    nextButton: React.MutableRefObject<HTMLButtonElement>,
): void {
    const nextInputIndex = startInputIndex + 1;

    if (nextInputIndex === inputRefs.length) {
        return nextButton.current.focus();
    }

    const valueInNextInput = inputRefs[nextInputIndex].current.value;
    if (valueInNextInput !== '') {
        return focusOnNextInputOrNextButton(nextInputIndex, inputRefs, nextButton);
    }

    return inputRefs[nextInputIndex].current.focus();
}
