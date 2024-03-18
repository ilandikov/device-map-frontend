import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { configureTestStore } from '../../../../../tests/utils';

export function renderAsJSON(component: React.ReactElement) {
    return renderer.create(component).toJSON();
}

export function componentWithStoreProvider(component: React.JSX.Element) {
    return <Provider store={configureTestStore()}>{component}</Provider>;
}

export function renderForSnapshotTest(component: React.JSX.Element) {
    return renderAsJSON(componentWithStoreProvider(component));
}

export function renderForActionDispatchTest(component: React.JSX.Element) {
    const { container } = render(componentWithStoreProvider(component));
    return container;
}
