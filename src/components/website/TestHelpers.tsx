import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { configureTestStore } from '../../../tests/utils';

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
