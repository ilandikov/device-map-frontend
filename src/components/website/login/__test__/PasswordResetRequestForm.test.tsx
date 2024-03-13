import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import { createEvent } from '../../TestHelpers';
import { UserAuthState } from '../UserAuthStateUtils';
import { setUserAuthState, setUserEmail } from './LoginModalTestHelpers';

const store = configureTestStore();

function componentWithStoreProvider(userEmail: string = '') {
    return render(
        <Provider store={store}>
            <PasswordResetRequestForm {...{ setUserAuthState, userEmail, setUserEmail }} />
        </Provider>,
    );
}

describe('PasswordResetRequest form action tests', () => {
    it('should update user mail when set', () => {
        const { container } = componentWithStoreProvider();

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(setUserEmail).toHaveBeenNthCalledWith(1, 'new@email.com');
    });

    it('should transition to login OTP state on OTP button click', () => {
        const { container } = componentWithStoreProvider();

        const requestOTPButton = getByText(container, 'OTPSendSMS');
        fireEvent.click(requestOTPButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, UserAuthState.LOGIN_OTP);
    });
});
