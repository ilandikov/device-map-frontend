import { fireEvent, getByTestId, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { configureTestStore } from '../../../../../tests/utils';
import { NavigationButtons } from '../NavigationButtons';
import { UserAuthState } from '../UserAuthStateUtils';
import { resetLoginModalMocks, setUserAuthState } from './LoginModalTestHelpers';

const store = configureTestStore();

function componentWithStoreProvider(goBackState: UserAuthState) {
    return render(
        <Provider store={store}>
            <NavigationButtons {...{ setUserAuthState, goBackState }} />
        </Provider>,
    );
}

describe('Navigation buttons tests', () => {
    beforeEach(() => {
        resetLoginModalMocks();
    });

    it('should go back to welcome stage on cancel button click', () => {
        const { container } = componentWithStoreProvider(UserAuthState.WELCOME);

        const cancelButton = getByTestId(container, 'cancelButton');
        fireEvent.click(cancelButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, UserAuthState.WELCOME);
    });

    it('should go back to a desired go back state on go back button click', () => {
        const { container } = componentWithStoreProvider(UserAuthState.MAIL_INPUT);

        const goBackButton = getByTestId(container, 'goBackButton');
        fireEvent.click(goBackButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, UserAuthState.MAIL_INPUT);
    });
});
