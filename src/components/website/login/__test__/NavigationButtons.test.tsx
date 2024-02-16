import { fireEvent, getByTestId, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { configureTestStore } from '../../../../../tests/utils';
import { NavigationButtons } from '../NavigationButtons';
import { UserAuthState } from '../LoginModal';
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
    it('should click on cancel button', () => {
        const { container } = componentWithStoreProvider();
        const cancelButton = getByTestId(container, 'cancelButton');

        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.WELCOME);
    });

    it('should click on go back button', () => {
        const { container } = componentWithStoreProvider();
        const goBackButton = getByTestId(container, 'goBackButton');

        expect(goBackButton).toBeInTheDocument();
        fireEvent.click(goBackButton);
    });
});
