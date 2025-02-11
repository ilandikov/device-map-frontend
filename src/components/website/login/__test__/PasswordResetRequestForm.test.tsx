import React from 'react';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import { click, renderForSnapshotTest, testDispatchedAction, type } from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalCheck,
    LoginModalInputType,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';

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
        type(<PasswordResetRequestForm />, 'emailInput', 'new@email.com');

        testDispatchedAction(loginModalInput(LoginModalInputType.EMAIL, 'new@email.com'));
    });

    it('should transition to login OTP state on OTP button click', () => {
        click(<PasswordResetRequestForm />, 'sendOTPButton');

        testDispatchedAction(loginModalRemoteRequest(LoginModalCheck.USERNAME));
    });
});
