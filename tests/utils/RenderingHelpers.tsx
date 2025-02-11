import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { fireEvent, getByTestId, render } from '@testing-library/react';
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

export function renderForSnapshotTest(component: React.JSX.Element) {
    return renderer.create(componentWithStoreProvider(component)).toJSON();
}

export function renderForActionDispatchTest(component: React.JSX.Element) {
    const { container } = render(componentWithStoreProvider(component));
    return container;
}

export function clickButtonInComponent(component: React.JSX.Element, buttonTestId: string) {
    const container = renderForActionDispatchTest(component);
    const button = getByTestId(container, buttonTestId);
    fireEvent.click(button);
}

export function testDispatchedActionsInOrder(expectedActions: AllActions[]) {
    expectedActions.forEach((action, index) => {
        expect(mockDispatch).toHaveBeenNthCalledWith(index + 1, action);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(expectedActions.length);
}
