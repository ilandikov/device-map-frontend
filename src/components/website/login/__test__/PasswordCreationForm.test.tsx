import React from 'react';
import { PasswordCreationForm } from '../PasswordCreationForm';
import { click, testDispatchedAction, testSnapshot, type } from '../../../../../tests/utils/RenderingHelpers';
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

describe('PasswordCreationForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockAuthenticationState({ password: 'one2three', passwordRepeat: 'anotherPassword' });

        testSnapshot(<PasswordCreationForm />);
    });

    it('should match the snapshot at password not match error', () => {
        mockAuthenticationState({
            error: new Error('renderMeToo'),
        });

        testSnapshot(<PasswordCreationForm />);
    });
});

describe('PasswordCreationForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update user password when typed', () => {
        type(<PasswordCreationForm />, 'passwordInput', 'verySecurePassword1');

        testDispatchedAction(loginModalInput(LoginModalInputType.PASSWORD, 'verySecurePassword1'));
    });

    it('should update repeated user password when typed', () => {
        type(<PasswordCreationForm />, 'passwordRepeatInput', 'evenBetterPassword');

        testDispatchedAction(loginModalInput(LoginModalInputType.PASSWORD_REPEAT, 'evenBetterPassword'));
    });

    it('should call password verification when next button is pressed', () => {
        click(<PasswordCreationForm />, 'nextButton');

        testDispatchedAction(loginModalRemoteRequest(LoginModalCheck.PASSWORD));
    });
});
