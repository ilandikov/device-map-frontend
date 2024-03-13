import { getByTestId } from '@testing-library/react';

export function createEvent(value: any) {
    return { target: { value: `${value}` } };
}

export function getNonNumeric() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:',.<>/?`~";
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

export function getInput(container: HTMLElement, inputIndex: number) {
    return getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;
}
