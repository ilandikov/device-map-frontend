import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import { createEvent, renderForActionDispatchTest } from '../../TestHelpers';
import { LoginModalInputTypes, loginModalButtonClick, loginModalInput } from '../redux/actions';
import { mockDispatch } from '../redux/__mocks__/LoginModalState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('PasswordResetRequest form action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update user mail when set', () => {
        const container = renderForActionDispatchTest(<PasswordResetRequestForm />);

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_EMAIL, 'new@email.com'),
        );
    });

    it('should transition to login OTP state on OTP button click', () => {
        const container = renderForActionDispatchTest(<PasswordResetRequestForm />);

        const requestOTPButton = getByText(container, 'OTPSendSMS');
        fireEvent.click(requestOTPButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('OTPSendSMS'));
    });
});
