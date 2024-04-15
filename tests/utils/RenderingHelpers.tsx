import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import { LoginModalAction } from '../../src/components/website/login/redux/LoginModalAction';
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

export function renderForSnapshotTest(component: React.JSX.Element) {
    return renderer.create(componentWithStoreProvider(component)).toJSON();
}

export function renderForActionDispatchTest(component: React.JSX.Element) {
    const { container } = render(componentWithStoreProvider(component));
    return container;
}

export function doUserInput(component: React.JSX.Element, inputTestId: string, inputValue: string) {
    const container = renderForActionDispatchTest(component);
    const input = getByTestId(container, inputTestId);
    fireEvent.change(input, createEvent(inputValue));
}

export function verifyDispatchedAction(expectedAction: LoginModalAction) {
    expect(mockDispatch).toHaveBeenNthCalledWith(1, expectedAction);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
}

export function doUserButtonClick(component: React.JSX.Element, buttonText: string) {
    const container = renderForActionDispatchTest(component);
    const button = getByText(container, buttonText);
    fireEvent.click(button);
}
