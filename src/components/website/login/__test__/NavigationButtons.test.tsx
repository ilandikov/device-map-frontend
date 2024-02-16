import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { configureTestStore } from '../../../../../tests/utils';
import { NavigationButtons } from '../NavigationButtons';

const store = configureTestStore();

function componentWithStoreProvider() {
    return render(
        <Provider store={store}>
            <NavigationButtons />
        </Provider>,
    );
}

describe('Navigation buttons tests', () => {
    it('should render component', () => {
        const { container } = componentWithStoreProvider();
        expect(container).toBeTruthy();
    });
});
