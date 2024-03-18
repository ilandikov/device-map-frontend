import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { configureTestStore } from '../../../../../tests/utils';

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
