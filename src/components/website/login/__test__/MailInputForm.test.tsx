import React from 'react';
import { MailInputForm } from '../MailInputForm';
import { click, renderForSnapshotTest, testDispatchedAction, type } from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalButton,
    LoginModalCheck,
    LoginModalInputType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { CognitoErrors } from '../redux/cognitoHelpers';
import { MailInputError } from '../redux/AuthenticationErrors';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MailInputForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockAuthenticationState({ email: 'enteredMail@form.fr', error: null });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists error', () => {
        mockAuthenticationState({
            email: 'existing@mail.ru',
            error: new Error(CognitoErrors.USERNAME_EXISTS),
        });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid error', () => {
        mockAuthenticationState({ email: 'notAMailAddress', error: new Error(MailInputError.NOT_VALID) });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should call email setter from email input', () => {
        type(<MailInputForm />, 'emailInput', 'new@email.com');

        testDispatchedAction(loginModalInput(LoginModalInputType.EMAIL, 'new@email.com'));
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        click(<MailInputForm />, 'nextButton');

        testDispatchedAction(loginModalRemoteRequest(LoginModalCheck.USERNAME));
    });

    it('should move from mail already exists to password verification stage', () => {
        mockAuthenticationState({ error: new Error(CognitoErrors.USERNAME_EXISTS) });

        click(<MailInputForm />, 'loginButton');

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN));
    });
});
