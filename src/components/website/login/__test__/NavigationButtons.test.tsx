import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { configureTestStore } from '../../../../../tests/utils';
import { NavigationButtons } from '../NavigationButtons';
import { mockLoginModalHooks } from './LoginModalTestHelpers';

const store = configureTestStore();

const { setUserAuthState } = mockLoginModalHooks();

function componentWithStoreProvider() {
    return render(
        <Provider store={store}>
            <NavigationButtons {...{ setUserAuthState }} />
        </Provider>,
    );
}

describe('Navigation buttons tests', () => {
    it('should render component', () => {
        const { container } = componentWithStoreProvider();
        expect(container).toBeTruthy();
    });
});
