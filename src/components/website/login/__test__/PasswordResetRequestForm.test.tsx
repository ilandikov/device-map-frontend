import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import {
    createEvent,
    renderForActionDispatchTest,
    renderForSnapshotTest,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalInput,
    loginModalVerifyRequest,
} from '../redux/actions';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../redux/__mocks__/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('PasswordResetRequestForm snapshot tests', () => {
    it('should match the snapshot', () => {
        mockAuthenticationState({ email: 'reset@password.kr', error: new Error('somethingIsWrong') });
        const component = renderForSnapshotTest(<PasswordResetRequestForm />);

        expect(component).toMatchSnapshot();
    });
});

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

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_FOR_PASSWORD_RESET),
        );
    });
});
