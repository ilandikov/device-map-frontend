import { fireEvent, getByText, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from '../redux/__mocks__/LoginModalState';
import { UserAuthState } from '../redux/state';
import { loginModalButtonClick } from '../redux/actions';
import { configureTestStore } from '../../../../../tests/utils';
import { WelcomeForm } from '../WelcomeForm';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

const componentWithStoreProvider = (
    <Provider store={configureTestStore()}>
        <WelcomeForm />
    </Provider>
);

describe('WelcomeForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should transition to email input from welcome state', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.WELCOME,
        });
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountRegister'));
    });

    it('should transition to login from welcome state', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.WELCOME,
        });
        const { container } = render(componentWithStoreProvider);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountLogin'));
    });
});
