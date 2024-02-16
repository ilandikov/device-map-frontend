import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import { UserAuthState } from '../LoginModal';
import { resetHookMocks, setUserAuthState, setUserEmail } from './LoginModalTestHelpers';

const store = configureTestStore();

function componentWithStoreProvider(userEmail: string = '') {
    return render(
        <Provider store={store}>
            <PasswordResetRequestForm {...{ setUserAuthState, userEmail, setUserEmail }} />
        </Provider>,
    );
}

describe('rename me', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it('should update user mail when set', () => {
        const { container } = componentWithStoreProvider();

        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput, { target: { value: 'new@email.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should transition to login OTP state on OTP button click', () => {
        const { container } = componentWithStoreProvider();

        const requestOTPButton = getByText(container, 'OTPSendSMS');
        expect(requestOTPButton).toBeInTheDocument();
        fireEvent.click(requestOTPButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.LOGIN_OTP);
    });
});
