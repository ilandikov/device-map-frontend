import { fireEvent, getByTestId, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { configureTestStore } from '../../../../../tests/utils';
import { NavigationButtons } from '../NavigationButtons';
import { mockDispatch } from '../redux/__mocks__/LoginModalState';
import { loginModalButtonClick } from '../redux/actions';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

function componentWithStoreProvider() {
    return render(
        <Provider store={configureTestStore()}>
            <NavigationButtons />
        </Provider>,
    );
}

describe('Navigation buttons tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should go back to welcome stage on cancel button click', () => {
        const { container } = componentWithStoreProvider();

        const cancelButton = getByTestId(container, 'cancelButton');
        fireEvent.click(cancelButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('cancel'));
    });

    it('should go back to a desired go back state on go back button click', () => {
        const { container } = componentWithStoreProvider();

        const goBackButton = getByTestId(container, 'goBackButton');
        fireEvent.click(goBackButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('goBack'));
    });
});
