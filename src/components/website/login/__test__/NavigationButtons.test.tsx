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

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('Navigation buttons tests', () => {
    beforeEach(() => {
        resetLoginModalMocks();
        mockDispatch.mockReset();
    });

    it('should go back to welcome stage on cancel button click', () => {
        const { container } = componentWithStoreProvider(UserAuthState.WELCOME);

        const cancelButton = getByTestId(container, 'cancelButton');
        fireEvent.click(cancelButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'buttonClicked', button: 'cancel' });
    });

    it('should go back to a desired go back state on go back button click', () => {
        const { container } = componentWithStoreProvider(UserAuthState.MAIL_INPUT);

        const goBackButton = getByTestId(container, 'goBackButton');
        fireEvent.click(goBackButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'buttonClicked', button: 'goBack' });
    });
});
