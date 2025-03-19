import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import * as prettier from 'prettier';
import { Options } from 'approvals/lib/Core/Options';
import { verify } from 'approvals/lib/Providers/Jest/JestApprovals';
import { AllActions } from '../../src/redux/store';
import { mockDispatch } from '../../src/redux/__mocks__/mocks';
import { configureTestStore } from './index';

export function createEvent(value: any) {
    return { target: { value: `${value}` } };
}

export function getNonNumeric() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:',.<>/?`~";
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

function componentWithStoreProvider(component: React.JSX.Element) {
    return <Provider store={configureTestStore()}>{component}</Provider>;
}

export function testSnapshot(component: React.JSX.Element) {
    const componentJSON = renderer.create(componentWithStoreProvider(component)).toJSON();
    expect(componentJSON).toMatchSnapshot();
}

export function renderForActionDispatchTest(component: React.JSX.Element) {
    const { container } = render(componentWithStoreProvider(component));
    return container;
}

function prettifyHTML(html: string) {
    return prettier.format(html, {
        parser: 'html',
        bracketSameLine: true,
        htmlWhitespaceSensitivity: 'ignore',
        printWidth: 120,
    });
}

export function verifyComponent(component: React.JSX.Element) {
    const { container } = render(componentWithStoreProvider(component));
    const htmlOutput = prettifyHTML(container.innerHTML);
    const options = new Options().forFile().withFileExtention('.html');
    verify(htmlOutput, options);
}

export function click(component: React.JSX.Element, buttonTestId: string) {
    const container = renderForActionDispatchTest(component);
    const button = getByTestId(container, buttonTestId);
    fireEvent.click(button);
}

export function type(component: React.JSX.Element, inputTestId: string, userTyped: string) {
    const container = renderForActionDispatchTest(component);
    const input = getByTestId(container, inputTestId);
    fireEvent.change(input, createEvent(userTyped));
}

export function testDispatchedActionsInOrder(expectedActions: AllActions[]) {
    expectedActions.forEach((action, index) => {
        expect(mockDispatch).toHaveBeenNthCalledWith(index + 1, action);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(expectedActions.length);
}

export function testDispatchedAction(expectedAction: AllActions) {
    testDispatchedActionsInOrder([expectedAction]);
}

export function testValueInInput(component: React.JSX.Element, input: string, value: string) {
    const container = renderForActionDispatchTest(component);
    const emailInput = getByTestId(container, input) as HTMLInputElement;
    expect(emailInput.value).toEqual(value);
}
