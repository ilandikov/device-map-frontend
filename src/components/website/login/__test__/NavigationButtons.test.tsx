import { fireEvent, getByTestId, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { configureTestStore } from '../../../../../tests/utils';
import { NavigationButtons } from '../NavigationButtons';
import { UserAuthState } from '../LoginModal';
import { resetHookMocks, setUserAuthState } from './LoginModalTestHelpers';

const store = configureTestStore();

function componentWithStoreProvider(goBackState: UserAuthState = UserAuthState.WELCOME) {
    return render(
        <Provider store={store}>
            <NavigationButtons {...{ setUserAuthState, goBackState }} />
        </Provider>,
    );
}

describe('Navigation buttons tests', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it('should go back to welcome stage on cancel button click', () => {
        const { container } = componentWithStoreProvider();
        const cancelButton = getByTestId(container, 'cancelButton');

        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.WELCOME);
    });

    it('should go back to a desired go back state on go back button click', () => {
        const { container } = componentWithStoreProvider(UserAuthState.MAIL_INPUT_START);
        const goBackButton = getByTestId(container, 'goBackButton');

        expect(goBackButton).toBeInTheDocument();
        fireEvent.click(goBackButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT_START);
    });
});
