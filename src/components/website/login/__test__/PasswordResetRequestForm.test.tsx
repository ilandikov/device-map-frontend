import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import { createEvent } from '../../TestHelpers';
import { LoginModalInputTypes, loginModalButtonClick, loginModalInput } from '../redux/actions';
import { mockDispatch } from '../redux/__mocks__/LoginModalState';

const store = configureTestStore();

function componentWithStoreProvider() {
    return render(
        <Provider store={store}>
            <PasswordResetRequestForm />
        </Provider>,
    );
}

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('PasswordResetRequest form action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update user mail when set', () => {
        const { container } = componentWithStoreProvider();

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_EMAIL, 'new@email.com'),
        );
    });

    it('should transition to login OTP state on OTP button click', () => {
        const { container } = componentWithStoreProvider();

        const requestOTPButton = getByText(container, 'OTPSendSMS');
        fireEvent.click(requestOTPButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('OTPSendSMS'));
    });
});
